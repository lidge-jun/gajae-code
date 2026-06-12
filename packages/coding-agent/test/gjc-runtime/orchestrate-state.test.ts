import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { runNativeOrchestrateCommand } from "../../src/gjc-runtime/orchestrate-runtime";
import {
	canTransitionPabcd,
	PABCD_STAGES,
	type PabcdStage,
	pabcdStatePath,
	parseCriticVerdict,
	parseWorkerVerdict,
	readPabcdState,
	VALID_PABCD_TRANSITIONS,
	writeNativeWorkflowEnvelopeAtomic,
} from "../../src/gjc-runtime/orchestrate-state";
import { WORKFLOW_STATE_VERSION } from "../../src/skill-state/workflow-state-version";

describe("pabcd transition table (cli-jaw canTransition port)", () => {
	it("allows only i or p as entry stages when no state exists", () => {
		expect(canTransitionPabcd(null, "i").ok).toBe(true);
		expect(canTransitionPabcd(null, "p").ok).toBe(true);
		for (const stage of ["a", "b", "c", "d", "complete"] as const) {
			expect(canTransitionPabcd(null, stage).ok).toBe(false);
		}
	});

	it("enforces the full forward-only table with i-return", () => {
		for (const from of PABCD_STAGES) {
			for (const to of PABCD_STAGES) {
				const expected = VALID_PABCD_TRANSITIONS[from].includes(to);
				const result = canTransitionPabcd(from, to, {
					audit_status: "pass",
					verification_status: "done",
				});
				expect(result.ok, `${from} → ${to}`).toBe(expected);
			}
		}
	});

	it("returning to i is always allowed from any active stage", () => {
		for (const from of PABCD_STAGES.filter(stage => stage !== "i")) {
			expect(canTransitionPabcd(from as PabcdStage, "i").ok).toBe(true);
		}
	});

	it("gates a→b on audit verdict pass (strict equality)", () => {
		expect(canTransitionPabcd("a", "b", { audit_status: "pending" }).ok).toBe(false);
		expect(canTransitionPabcd("a", "b", { audit_status: "fail" }).ok).toBe(false);
		expect(canTransitionPabcd("a", "b", {}).ok).toBe(false);
		expect(canTransitionPabcd("a", "b", { audit_status: "pass" }).ok).toBe(true);
		// Explicit user approval overrides the gate.
		expect(canTransitionPabcd("a", "b", { audit_status: "fail", user_approved: true }).ok).toBe(true);
	});

	it("gates b→c on verification verdict done (strict equality)", () => {
		expect(canTransitionPabcd("b", "c", { verification_status: "pending" }).ok).toBe(false);
		expect(canTransitionPabcd("b", "c", { verification_status: "needs_fix" }).ok).toBe(false);
		expect(canTransitionPabcd("b", "c", { verification_status: "done" }).ok).toBe(true);
		expect(canTransitionPabcd("b", "c", { user_approved: true }).ok).toBe(true);
	});

	it("supports 3-way reject routing from c", () => {
		for (const to of ["d", "b", "p", "i"] as const) {
			expect(canTransitionPabcd("c", to).ok).toBe(true);
		}
	});
});

describe("parseWorkerVerdict (cli-jaw port)", () => {
	it("parses word-boundary verdict tokens", () => {
		expect(parseWorkerVerdict("verdict: PASS — anchors verified")).toBe("pass");
		expect(parseWorkerVerdict("## FAIL\nfindings below")).toBe("fail");
		expect(parseWorkerVerdict("report DONE")).toBe("done");
		expect(parseWorkerVerdict("NEEDS_FIX: import broken")).toBe("needs_fix");
	});

	it("checks NEEDS_FIX before FAIL when both could match", () => {
		expect(parseWorkerVerdict("NEEDS_FIX — would otherwise FAIL")).toBe("needs_fix");
	});

	it("ignores prose without strict tokens", () => {
		expect(parseWorkerVerdict("the tests passed previously")).toBeNull();
		expect(parseWorkerVerdict("this is done-ish and failing")).toBeNull();
		expect(parseWorkerVerdict("")).toBeNull();
	});
});

describe("parseCriticVerdict (D050-23 stage-p vocabulary)", () => {
	it("parses critic tokens with negative verdicts first", () => {
		expect(parseCriticVerdict("verdict: OKAY")).toBe("okay");
		expect(parseCriticVerdict("ITERATE — sharpen AC 3")).toBe("iterate");
		expect(parseCriticVerdict("REJECT: scope hole")).toBe("reject");
		// Mixed prose fail-closes to the negative verdict.
		expect(parseCriticVerdict("would be OKAY but REJECT for now")).toBe("reject");
	});

	it("ignores prose without strict tokens", () => {
		expect(parseCriticVerdict("looks okay to me")).toBeNull();
		expect(parseCriticVerdict("")).toBeNull();
	});
});

describe("native pabcd envelope writer (D050-22)", () => {
	let cwd: string;

	beforeEach(async () => {
		cwd = await fs.mkdtemp(path.join(os.tmpdir(), "pabcd-state-test-"));
	});

	afterEach(async () => {
		await fs.rm(cwd, { recursive: true, force: true });
	});

	it("writes a checksum-stamped envelope with a native receipt", async () => {
		const filePath = await writeNativeWorkflowEnvelopeAtomic(
			cwd,
			{
				skill: "pabcd",
				version: WORKFLOW_STATE_VERSION,
				updated_at: new Date().toISOString(),
				current_phase: "i",
				active: true,
				ctx: {},
			},
			{ command: "orchestrate i", toPhase: "i" },
		);
		expect(filePath).toBe(pabcdStatePath(cwd));
		const raw = JSON.parse(await fs.readFile(filePath, "utf-8")) as {
			skill: string;
			receipt: { skill: string; owner: string; content_sha256?: { algorithm: string } };
		};
		expect(raw.skill).toBe("pabcd");
		expect(raw.receipt.skill).toBe("pabcd");
		expect(raw.receipt.owner).toBe("gjc-runtime");
		expect(raw.receipt.content_sha256?.algorithm).toBe("sha256");
	});

	it("fail-closes on an invalid stage", async () => {
		await expect(
			writeNativeWorkflowEnvelopeAtomic(
				cwd,
				{
					skill: "pabcd",
					version: WORKFLOW_STATE_VERSION,
					updated_at: new Date().toISOString(),
					// Deliberately invalid stage for the fail-closed gate.
					current_phase: "z" as unknown as PabcdStage,
					active: true,
				},
				{ command: "orchestrate z" },
			),
		).rejects.toThrow(/Refusing to write invalid native pabcd envelope/);
	});

	it("scopes state per session directory", async () => {
		await writeNativeWorkflowEnvelopeAtomic(
			cwd,
			{
				skill: "pabcd",
				version: WORKFLOW_STATE_VERSION,
				updated_at: new Date().toISOString(),
				current_phase: "p",
				active: true,
			},
			{ command: "orchestrate p", sessionId: "session.one" },
		);
		const scoped = await readPabcdState(cwd, "session.one");
		expect(scoped?.ok).toBe(true);
		const unscoped = await readPabcdState(cwd);
		expect(unscoped).toBeNull();
		expect(pabcdStatePath(cwd, "session.one")).toContain(path.join("sessions", "session%2Eone"));
	});
});

describe("orchestrate runtime full cycle", () => {
	let cwd: string;

	beforeEach(async () => {
		cwd = await fs.mkdtemp(path.join(os.tmpdir(), "pabcd-runtime-test-"));
	});

	afterEach(async () => {
		await fs.rm(cwd, { recursive: true, force: true });
	});

	async function run(args: string[]): Promise<{ stdout?: string; stderr?: string; status: number }> {
		return await runNativeOrchestrateCommand(args, cwd);
	}

	it("runs i→p→a→(verdict pass)→b→(verdict done)→c→d→complete", async () => {
		expect((await run(["i"])).status).toBe(0);
		expect((await run(["p", "--spec-ref", ".jwc/specs/jaw-interview-x.md"])).status).toBe(0);
		expect((await run(["a"])).status).toBe(0);

		// Gate: b refused while audit is pending.
		const refused = await run(["b"]);
		expect(refused.status).toBe(1);
		expect(refused.stderr).toContain("requires audit verdict 'pass'");

		const passFile = path.join(cwd, "audit.txt");
		await fs.writeFile(passFile, "PASS — all anchors verified", "utf-8");
		expect((await run(["verdict", "--worker-output", passFile])).status).toBe(0);
		expect((await run(["b"])).status).toBe(0);

		const doneFile = path.join(cwd, "verify.txt");
		await fs.writeFile(doneFile, "DONE", "utf-8");
		expect((await run(["verdict", "--worker-output", doneFile])).status).toBe(0);
		expect((await run(["c"])).status).toBe(0);
		expect((await run(["d"])).status).toBe(0);
		expect((await run(["complete"])).status).toBe(0);

		const status = await run(["status", "--json"]);
		const parsed = JSON.parse(status.stdout ?? "{}") as {
			active: boolean;
			stage: string;
			spec_ref: string | null;
			ctx: { audit_status?: string; verification_status?: string };
		};
		expect(parsed.active).toBe(false);
		expect(parsed.stage).toBe("complete");
		expect(parsed.spec_ref).toBe(".jwc/specs/jaw-interview-x.md");
		expect(parsed.ctx.audit_status).toBe("pass");
		expect(parsed.ctx.verification_status).toBe("done");
	});

	it("escalates after the a-round cap (D050-20: a_round ≤ 3)", async () => {
		await run(["i"]);
		await run(["p"]);
		await run(["a"]);
		const failFile = path.join(cwd, "fail.txt");
		await fs.writeFile(failFile, "FAIL — findings", "utf-8");
		expect((await run(["verdict", "--worker-output", failFile])).stdout).toContain("verdict=fail");
		expect((await run(["verdict", "--worker-output", failFile])).stdout).toContain("verdict=fail");
		const third = await run(["verdict", "--worker-output", failFile]);
		expect(third.stdout).toContain("round cap reached");
	});

	it("rejects stage skips and unknown stages", async () => {
		expect((await run(["b"])).status).toBe(1);
		await run(["i"]);
		const skip = await run(["c"]);
		expect(skip.status).toBe(1);
		expect(skip.stderr).toContain("Invalid transition");
		expect((await run(["z"])).status).toBe(2);
	});

	it("forces dual audit mode under --deliberate (D050-21)", async () => {
		await run(["i"]);
		await run(["p", "--deliberate"]);
		await run(["a", "--audit-mode", "solo"]);
		const status = await run(["status", "--json"]);
		const parsed = JSON.parse(status.stdout ?? "{}") as { ctx: { a_audit_mode?: string } };
		expect(parsed.ctx.a_audit_mode).toBe("dual");
	});

	it("enters p directly with a spec (D050-2 handoff, no i round-trip)", async () => {
		const entry = await run(["p", "--spec-ref", ".jwc/specs/jaw-interview-direct.md"]);
		expect(entry.status).toBe(0);
		const status = await run(["status", "--json"]);
		const parsed = JSON.parse(status.stdout ?? "{}") as { stage: string; spec_ref: string | null };
		expect(parsed.stage).toBe("p");
		expect(parsed.spec_ref).toBe(".jwc/specs/jaw-interview-direct.md");
	});

	it("records stage-p critic verdicts and escalates at the p-round cap (D050-19)", async () => {
		await run(["p"]);
		const iterateFile = path.join(cwd, "critic-iterate.txt");
		await fs.writeFile(iterateFile, "ITERATE — AC 2 is ambiguous", "utf-8");
		const first = await run(["verdict", "--worker-output", iterateFile]);
		expect(first.stdout).toContain("verdict=iterate");
		const second = await run(["verdict", "--worker-output", iterateFile]);
		expect(second.stdout).toContain("round cap reached");
		expect(second.stdout).toContain("do NOT write pending-approval");

		const okayFile = path.join(cwd, "critic-okay.txt");
		await fs.writeFile(okayFile, "OKAY", "utf-8");
		expect((await run(["verdict", "--worker-output", okayFile])).stdout).toContain("verdict=okay");
		const status = await run(["status", "--json"]);
		const parsed = JSON.parse(status.stdout ?? "{}") as { ctx: { p_review_passed?: boolean } };
		expect(parsed.ctx.p_review_passed).toBe(true);
	});

	it("serves the stage-a audit prompts with the PASS|FAIL contract (D050-23)", async () => {
		for (const lens of ["planner", "architect"] as const) {
			const result = await run(["audit-prompt", lens]);
			expect(result.status).toBe(0);
			expect(result.stdout).toContain("READ-ONLY");
			expect(result.stdout).toContain("`PASS` or `FAIL`");
		}
		expect((await run(["audit-prompt"])).status).toBe(2);
		expect((await run(["audit-prompt", "critic"])).status).toBe(2);
	});
});

describe("direct P entry without a spec (260613 — i는 P의 필수 선행이 아님)", () => {
	it("idle → p succeeds with no spec_ref", () => {
		const result = canTransitionPabcd(null, "p");
		expect(result.ok).toBe(true);
	});

	it("idle entry failure message offers direct p without demanding a spec", () => {
		const result = canTransitionPabcd(null, "b");
		expect(result.ok).toBe(false);
		expect(result.reason).toContain("plan directly — spec optional");
	});
});
