/**
 * Native IPABCD orchestrate runtime (050 band, 054 B4).
 *
 * Stage entry/transition/gate core for `orchestrate i|p|a|b|c|d|complete`.
 * The runtime owns the state machine only — plan drafting (D050-19), parallel
 * audits (D050-20), and build execution stay with the main session, guided by
 * the stage prompts emitted here. Verdicts from read-only subagents are
 * recorded via `orchestrate verdict --worker-output <path>`.
 */
import * as fs from "node:fs/promises";
import orchestrateA from "../prompts/jaw/orchestrate-a.md" with { type: "text" };
import auditArchitect from "../prompts/jaw/orchestrate-audit-architect.md" with { type: "text" };
import auditPlanner from "../prompts/jaw/orchestrate-audit-planner.md" with { type: "text" };
import orchestrateB from "../prompts/jaw/orchestrate-b.md" with { type: "text" };
import orchestrateC from "../prompts/jaw/orchestrate-c.md" with { type: "text" };
import orchestrateD from "../prompts/jaw/orchestrate-d.md" with { type: "text" };
import orchestrateI from "../prompts/jaw/orchestrate-i.md" with { type: "text" };
import orchestrateP from "../prompts/jaw/orchestrate-p.md" with { type: "text" };
import { WORKFLOW_STATE_VERSION } from "../skill-state/workflow-state-version";
import {
	canTransitionPabcd,
	PABCD_MAX_A_ROUNDS,
	PABCD_MAX_P_ROUNDS,
	PABCD_STAGES,
	type PabcdCtx,
	type PabcdEnvelope,
	type PabcdStage,
	pabcdStatePath,
	parseCriticVerdict,
	parseWorkerVerdict,
	readPabcdState,
	writeNativeWorkflowEnvelopeAtomic,
} from "./orchestrate-state";

export interface OrchestrateCommandResult {
	stdout?: string;
	stderr?: string;
	status: number;
}

const STAGE_PROMPTS: Readonly<Record<Exclude<PabcdStage, "complete">, string>> = {
	i: orchestrateI,
	p: orchestrateP,
	a: orchestrateA,
	b: orchestrateB,
	c: orchestrateC,
	d: orchestrateD,
};

/**
 * Stage-a spawn prompts with the PASS|FAIL output contract fixed (D050-23).
 * Fetch via `orchestrate audit-prompt planner|architect` so spawned auditors
 * never fall back to the ralplan-vocabulary embedded agent prompts.
 */
export const ORCHESTRATE_AUDIT_PROMPTS: Readonly<Record<"planner" | "architect", string>> = {
	planner: auditPlanner,
	architect: auditArchitect,
};

interface ParsedArgs {
	positional: string[];
	sessionId?: string;
	deliberate: boolean;
	json: boolean;
	userApproved: boolean;
	auditMode?: "solo" | "dual";
	specRef?: string;
	planRef?: string;
	workerOutput?: string;
}

function parseArgs(argv: string[]): ParsedArgs | { error: string } {
	const parsed: ParsedArgs = { positional: [], deliberate: false, json: false, userApproved: false };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		switch (arg) {
			case "--deliberate":
				parsed.deliberate = true;
				break;
			case "--json":
				parsed.json = true;
				break;
			case "--user-approved":
				parsed.userApproved = true;
				break;
			case "--session-id":
			case "--audit-mode":
			case "--spec-ref":
			case "--plan-ref":
			case "--worker-output": {
				const value = argv[++i];
				if (value === undefined) return { error: `missing value for ${arg}` };
				if (arg === "--session-id") parsed.sessionId = value;
				else if (arg === "--audit-mode") {
					if (value !== "solo" && value !== "dual")
						return { error: `--audit-mode must be solo|dual, got: ${value}` };
					parsed.auditMode = value;
				} else if (arg === "--spec-ref") parsed.specRef = value;
				else if (arg === "--plan-ref") parsed.planRef = value;
				else parsed.workerOutput = value;
				break;
			}
			default:
				if (arg.startsWith("--")) return { error: `unknown flag: ${arg}` };
				parsed.positional.push(arg);
		}
	}
	return parsed;
}

function isStage(value: string): value is PabcdStage {
	return (PABCD_STAGES as readonly string[]).includes(value);
}

async function readCurrent(
	cwd: string,
	sessionId: string | undefined,
): Promise<{ envelope: PabcdEnvelope | null } | { error: string }> {
	const result = await readPabcdState(cwd, sessionId);
	if (result === null) return { envelope: null };
	if (!result.ok) return { error: `corrupt pabcd state at ${pabcdStatePath(cwd, sessionId)}: ${result.error}` };
	const value = result.value;
	const stage = typeof value.current_phase === "string" && isStage(value.current_phase) ? value.current_phase : null;
	if (stage === null) return { error: `pabcd state has unknown stage: ${String(value.current_phase)}` };
	return {
		envelope: {
			skill: "pabcd",
			version: typeof value.version === "number" ? value.version : WORKFLOW_STATE_VERSION,
			updated_at: value.updated_at ?? new Date().toISOString(),
			current_phase: stage,
			active: value.active ?? true,
			...(value.session_id !== undefined ? { session_id: value.session_id } : {}),
			...(value.spec_ref !== undefined ? { spec_ref: value.spec_ref } : {}),
			...(value.plan_ref !== undefined ? { plan_ref: value.plan_ref } : {}),
			ctx: (value.ctx as PabcdCtx | undefined) ?? {},
		},
	};
}

function statusText(envelope: PabcdEnvelope | null, json: boolean): string {
	if (json) {
		return `${JSON.stringify(
			envelope
				? {
						active: envelope.active,
						stage: envelope.current_phase,
						spec_ref: envelope.spec_ref ?? null,
						plan_ref: envelope.plan_ref ?? null,
						ctx: envelope.ctx ?? {},
					}
				: { active: false, stage: null },
		)}\n`;
	}
	if (!envelope) return "pabcd: idle (no active orchestration). Start with: orchestrate i\n";
	const ctx = envelope.ctx ?? {};
	const bits = [
		`stage=${envelope.current_phase}`,
		envelope.spec_ref ? `spec_ref=${envelope.spec_ref}` : null,
		envelope.plan_ref ? `plan_ref=${envelope.plan_ref}` : null,
		ctx.a_audit_mode ? `a_audit_mode=${ctx.a_audit_mode}` : null,
		ctx.audit_status ? `audit=${ctx.audit_status}` : null,
		ctx.verification_status ? `verification=${ctx.verification_status}` : null,
	].filter(Boolean);
	return `pabcd: ${bits.join(" ")}\n`;
}

function nextCtxFor(target: PabcdStage, current: PabcdCtx, args: ParsedArgs): PabcdCtx {
	const ctx: PabcdCtx = { ...current };
	// user_approved is a per-transition override, never persisted (cli-jaw parity).
	delete ctx.user_approved;
	if (args.deliberate) ctx.deliberate = true;
	if (target === "p") {
		ctx.p_round = 0;
		ctx.p_review_passed = false;
	} else if (target === "a") {
		ctx.a_round = 0;
		ctx.audit_status = "pending";
		// D050-21: solo|dual decided at stage-a entry; --deliberate forces dual.
		ctx.a_audit_mode = ctx.deliberate ? "dual" : (args.auditMode ?? ctx.a_audit_mode ?? "dual");
	} else if (target === "b") {
		ctx.verification_status = "pending";
	}
	return ctx;
}

async function recordVerdict(cwd: string, args: ParsedArgs): Promise<OrchestrateCommandResult> {
	if (!args.workerOutput) {
		return { stderr: "orchestrate verdict requires --worker-output <path>\n", status: 2 };
	}
	let text: string;
	try {
		text = await fs.readFile(args.workerOutput, "utf-8");
	} catch (error) {
		return { stderr: `cannot read worker output: ${(error as Error).message}\n`, status: 2 };
	}
	const current = await readCurrent(cwd, args.sessionId);
	if ("error" in current) return { stderr: `${current.error}\n`, status: 2 };
	if (!current.envelope) return { stderr: "no active pabcd state — nothing to record a verdict against\n", status: 1 };
	const envelope = current.envelope;
	const ctx: PabcdCtx = { ...(envelope.ctx ?? {}) };
	const stage = envelope.current_phase;

	// Stage p uses the critic vocabulary (D050-23): OKAY|ITERATE|REJECT.
	if (stage === "p") {
		const criticVerdict = parseCriticVerdict(text);
		if (criticVerdict === null) {
			return { stderr: "no critic verdict token found (stage p expects OKAY|ITERATE|REJECT)\n", status: 1 };
		}
		if (criticVerdict === "okay") {
			ctx.p_review_passed = true;
		} else {
			ctx.p_review_passed = false;
			ctx.p_round = (ctx.p_round ?? 0) + 1;
			if (ctx.p_round >= PABCD_MAX_P_ROUNDS) {
				const written = await persist(cwd, { ...envelope, ctx }, args, "verdict", stage, stage);
				if ("error" in written) return { stderr: `${written.error}\n`, status: 2 };
				return {
					stdout: `verdict=${criticVerdict} p_round=${ctx.p_round} — round cap reached (≤${PABCD_MAX_P_ROUNDS}): do NOT write pending-approval, escalate to the user (D050-19)\n`,
					status: 0,
				};
			}
		}
		const written = await persist(cwd, { ...envelope, ctx }, args, "verdict", stage, stage);
		if ("error" in written) return { stderr: `${written.error}\n`, status: 2 };
		return { stdout: `verdict=${criticVerdict} recorded for stage p\n`, status: 0 };
	}

	const verdict = parseWorkerVerdict(text);
	if (verdict === null) {
		return { stderr: "no verdict token found in worker output (expected PASS|FAIL|DONE|NEEDS_FIX)\n", status: 1 };
	}
	if (stage === "a" && (verdict === "pass" || verdict === "fail")) {
		ctx.audit_status = verdict;
		if (verdict === "fail") {
			ctx.a_round = (ctx.a_round ?? 0) + 1;
			if (ctx.a_round >= PABCD_MAX_A_ROUNDS) {
				const written = await persist(cwd, { ...envelope, ctx }, args, "verdict", stage, stage);
				if ("error" in written) return { stderr: `${written.error}\n`, status: 2 };
				return {
					stdout: `verdict=fail a_round=${ctx.a_round} — round cap reached (≤${PABCD_MAX_A_ROUNDS}): escalate to the user (D050-20)\n`,
					status: 0,
				};
			}
		}
	} else if (stage === "b" && (verdict === "done" || verdict === "needs_fix")) {
		ctx.verification_status = verdict;
	} else {
		return {
			stderr: `verdict ${verdict.toUpperCase()} does not apply to stage '${stage}' (a expects PASS|FAIL, b expects DONE|NEEDS_FIX)\n`,
			status: 1,
		};
	}
	const written = await persist(cwd, { ...envelope, ctx }, args, "verdict", stage, stage);
	if ("error" in written) return { stderr: `${written.error}\n`, status: 2 };
	return { stdout: `verdict=${verdict} recorded for stage ${stage}\n`, status: 0 };
}

async function persist(
	cwd: string,
	envelope: PabcdEnvelope,
	args: ParsedArgs,
	command: string,
	fromPhase: string | undefined,
	toPhase: string,
): Promise<{ path: string } | { error: string }> {
	try {
		const filePath = await writeNativeWorkflowEnvelopeAtomic(
			cwd,
			{
				...envelope,
				updated_at: new Date().toISOString(),
				...(args.sessionId ? { session_id: args.sessionId } : {}),
			},
			{ command, sessionId: args.sessionId, fromPhase, toPhase },
		);
		return { path: filePath };
	} catch (error) {
		return { error: (error as Error).message };
	}
}

export async function runNativeOrchestrateCommand(argv: string[], cwd: string): Promise<OrchestrateCommandResult> {
	const parsed = parseArgs(argv);
	if ("error" in parsed) return { stderr: `${parsed.error}\n`, status: 2 };
	const sub = parsed.positional[0]?.toLowerCase();

	if (sub === undefined || sub === "status") {
		const current = await readCurrent(cwd, parsed.sessionId);
		if ("error" in current) return { stderr: `${current.error}\n`, status: 2 };
		return { stdout: statusText(current.envelope, parsed.json), status: 0 };
	}

	if (sub === "verdict") return await recordVerdict(cwd, parsed);

	if (sub === "audit-prompt") {
		const lens = parsed.positional[1]?.toLowerCase();
		if (lens !== "planner" && lens !== "architect") {
			return { stderr: "orchestrate audit-prompt requires a lens: planner | architect\n", status: 2 };
		}
		return { stdout: ORCHESTRATE_AUDIT_PROMPTS[lens], status: 0 };
	}

	if (!isStage(sub)) {
		return {
			stderr: `unknown stage '${sub}' (expected ${PABCD_STAGES.join("|")}, status, verdict, audit-prompt)\n`,
			status: 2,
		};
	}
	const target: PabcdStage = sub;

	const current = await readCurrent(cwd, parsed.sessionId);
	if ("error" in current) return { stderr: `${current.error}\n`, status: 2 };
	const from = current.envelope?.active ? current.envelope.current_phase : null;
	const baseCtx: PabcdCtx = current.envelope?.ctx ?? {};
	const gateCtx: PabcdCtx = parsed.userApproved ? { ...baseCtx, user_approved: true } : baseCtx;

	const transition = canTransitionPabcd(from, target, gateCtx);
	if (!transition.ok) return { stderr: `${transition.reason}\n`, status: 1 };

	const envelope: PabcdEnvelope = {
		skill: "pabcd",
		version: WORKFLOW_STATE_VERSION,
		updated_at: new Date().toISOString(),
		current_phase: target,
		active: target !== "complete",
		...(parsed.specRef !== undefined
			? { spec_ref: parsed.specRef }
			: current.envelope?.spec_ref !== undefined
				? { spec_ref: current.envelope.spec_ref }
				: {}),
		...(parsed.planRef !== undefined
			? { plan_ref: parsed.planRef }
			: current.envelope?.plan_ref !== undefined
				? { plan_ref: current.envelope.plan_ref }
				: {}),
		ctx: nextCtxFor(target, baseCtx, parsed),
	};

	const written = await persist(cwd, envelope, parsed, `orchestrate ${target}`, from ?? undefined, target);
	if ("error" in written) return { stderr: `${written.error}\n`, status: 2 };

	if (parsed.json) {
		return { stdout: `${JSON.stringify({ ok: true, from, to: target, state_path: written.path })}\n`, status: 0 };
	}
	const prompt = target === "complete" ? "pabcd: orchestration complete — state closed.\n" : STAGE_PROMPTS[target];
	return { stdout: `✅ pabcd → ${target}\n\n${prompt}`, status: 0 };
}
