import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { GOAL_PLAN_PENDING_BRIEF, runNativeGoalCommand } from "../../src/jwc-runtime/goal-cli";
import { readGoalLedger, readGoalPlan } from "../../src/jwc-runtime/goal-engine";

const QUALITY_GATE = JSON.stringify({
	architectReview: { verdict: "approved", evidence: "review notes attached" },
	executorQa: { verdict: "pass", evidence: "bun test 12 pass" },
	iteration: { count: 1, evidence: "single-pass implementation" },
});

describe("jwc goal adapter (060/061)", () => {
	let cwd: string;

	beforeEach(() => {
		cwd = mkdtempSync(path.join(os.tmpdir(), "jwc-goal-"));
	});

	afterEach(() => {
		rmSync(cwd, { recursive: true, force: true });
	});

	it("set → update(evidence) → checkpoint lands in the ledger", async () => {
		const set = await runNativeGoalCommand(["set", "ship the importer"], cwd);
		expect(set.status).toBe(0);
		const update = await runNativeGoalCommand(
			["update", "parser done", "--evidence", "bun test parser 12 pass"],
			cwd,
		);
		expect(update.status).toBe(0);
		const ledger = await readGoalLedger(cwd);
		const checkpoint = ledger.find(event => event.event === "goal_checkpointed");
		expect(checkpoint).toBeDefined();
		expect(checkpoint?.evidence).toBe("parser done; bun test parser 12 pass");
		const plan = await readGoalPlan(cwd);
		expect(plan?.goals[0]?.status).toBe("active");
	});

	it("rejects update without --evidence before reaching the engine", async () => {
		await runNativeGoalCommand(["set", "objective"], cwd);
		const result = await runNativeGoalCommand(["update", "no proof"], cwd);
		expect(result.status).toBe(1);
		expect(result.stderr).toContain("--evidence");
		const ledger = await readGoalLedger(cwd);
		expect(ledger.some(event => event.event === "goal_checkpointed")).toBe(false);
	});

	it("joins multiple --evidence paths with '; '", async () => {
		await runNativeGoalCommand(["set", "objective"], cwd);
		await runNativeGoalCommand(["update", "s", "--evidence", "a", "--evidence", "b", "--evidence", "c"], cwd);
		const ledger = await readGoalLedger(cwd);
		const checkpoint = ledger.find(event => event.event === "goal_checkpointed");
		expect(checkpoint?.evidence).toBe("s; a; b; c");
	});

	it("done requires an evidence-bearing checkpoint, then defers to the engine quality gate", async () => {
		await runNativeGoalCommand(["set", "objective"], cwd);
		const premature = await runNativeGoalCommand(["done", "--quality-gate-json", QUALITY_GATE], cwd);
		expect(premature.status).toBe(1);
		expect(premature.stderr).toContain("evidence-bearing checkpoint");

		await runNativeGoalCommand(["update", "work done", "--evidence", "tests green"], cwd);
		// Adapter pre-check passes; the strict engine gate (architect review
		// CLEAR/APPROVE, red-team artifacts) now owns the verdict — done is
		// guard-delegated by design (확정 #3), so a thin gate must be refused
		// by the ENGINE, not by the adapter pre-check.
		const done = await runNativeGoalCommand(["done", "verified", "--quality-gate-json", QUALITY_GATE], cwd);
		expect(done.status).toBe(1);
		expect(done.stderr).toContain("architect review");
		expect(done.stderr).not.toContain("evidence-bearing checkpoint");
		const plan = await readGoalPlan(cwd);
		expect(plan?.goals[0]?.status).toBe("active");
	});

	it("pause --agent gates: 1st tap counts, 2nd tap with --audit pauses + ledger event", async () => {
		await runNativeGoalCommand(["set", "objective"], cwd);
		const first = await runNativeGoalCommand(["pause", "--agent"], cwd);
		expect(first.status).toBe(1);
		expect(first.stderr).toContain("pause NOT executed");

		const second = await runNativeGoalCommand(["pause", "--agent", "--audit", "no viable path remains"], cwd);
		expect(second.status).toBe(0);
		expect(second.stdout).toContain("audited");
		const ledger = await readGoalLedger(cwd);
		const audited = ledger.find(event => event.event === "goal_pause_audited");
		expect(audited?.actor).toBe("agent");
		expect(audited?.evidence).toBe("no viable path remains");
	});

	it("pause --agent --audit without a prior tap is rejected", async () => {
		await runNativeGoalCommand(["set", "objective"], cwd);
		const result = await runNativeGoalCommand(["pause", "--agent", "--audit", "summary"], cwd);
		expect(result.status).toBe(1);
		expect(result.stderr).toContain("2-tap gate");
	});

	it("show/drop aliases behave as status/cancel", async () => {
		await runNativeGoalCommand(["set", "objective"], cwd);
		const show = await runNativeGoalCommand(["show"], cwd);
		expect(show.status).toBe(0);
		expect(show.stdout).toContain("Stories: G001:active");

		const drop = await runNativeGoalCommand(["drop", "scope changed"], cwd);
		expect(drop.status).toBe(0);
		const plan = await readGoalPlan(cwd);
		expect(plan?.goals[0]?.status).toBe("superseded");
	});

	it("plan → refine switches the pending sentinel to a direct objective", async () => {
		const planResult = await runNativeGoalCommand(["plan", "improve onboarding"], cwd);
		expect(planResult.status).toBe(0);
		let plan = await readGoalPlan(cwd);
		expect(plan?.brief).toContain(GOAL_PLAN_PENDING_BRIEF);

		const refine = await runNativeGoalCommand(["refine", "ship the onboarding wizard v2"], cwd);
		expect(refine.status).toBe(0);
		plan = await readGoalPlan(cwd);
		expect(plan?.jwcObjective).toBe("ship the onboarding wizard v2");
		expect(plan?.goals[0]?.objective).toBe("ship the onboarding wizard v2");
	});

	it("history renders recent ledger events newest-first with a limit", async () => {
		await runNativeGoalCommand(["set", "objective"], cwd);
		await runNativeGoalCommand(["update", "one", "--evidence", "e1"], cwd);
		await runNativeGoalCommand(["update", "two", "--evidence", "e2"], cwd);
		const history = await runNativeGoalCommand(["history", "2"], cwd);
		expect(history.status).toBe(0);
		const lines = history.stdout?.trim().split("\n") ?? [];
		expect(lines).toHaveLength(2);
		expect(lines[0]).toContain("goal_checkpointed");
		expect(lines[0]).toContain("two; e2");
	});

	it("rejects unknown verbs with the verb list", async () => {
		const result = await runNativeGoalCommand(["explode"], cwd);
		expect(result.status).toBe(2);
		expect(result.stderr).toContain("show→status");
	});
});

describe("goal status readability (99.00.03 P1-2)", () => {
	it("leads with the user objective and the 5-field block", async () => {
		const cwd = mkdtempSync(path.join(os.tmpdir(), "jwc-goal-status-"));
		await runNativeGoalCommand(["set", "사용자 목표 헤드라인"], cwd);
		const status = await runNativeGoalCommand(["status"], cwd);
		expect(status.stdout?.startsWith("Goal:    사용자 목표 헤드라인")).toBe(true);
		expect(status.stdout).toContain("Status:  active");
		expect(status.stdout).toContain("Mode:    ultragoal ledger (.jwc/ultragoal/)");
		expect(status.stdout).toContain("ID:      G001");
		expect(status.stdout).not.toContain("Complete the durable ultragoal plan");
	});
});
