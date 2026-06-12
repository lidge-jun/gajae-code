/**
 * Native IPABCD orchestrate state (050 band, D050-22).
 *
 * NOT a canonical workflow skill: `pabcd` lives in its own native registry so
 * `CANONICAL_GJC_WORKFLOW_SKILLS` (bundled-4 product invariant), the skill-docs
 * gates, and the dogfood template stay untouched. The canonical write gate
 * (`RequiredOnWriteEnvelopeSchema`) fail-closes on the 4 canonical slugs, so
 * native state has its own strict write schema + writer (D050-22 audit, 054 B1).
 *
 * Envelope file: `.jwc/state/pabcd-state.json` (logical contract name in the
 * 050 decision docs: `pabcd.json` — D050-8). Transition table and the worker
 * verdict parser are ports of cli-jaw `src/orchestrator/state-machine.ts`
 * (`canTransition`, `parseWorkerVerdict`).
 */
import * as path from "node:path";
import { z } from "zod";
import {
	WORKFLOW_STATE_RECEIPT_FRESH_MS,
	WORKFLOW_STATE_RECEIPT_VERSION,
	WORKFLOW_STATE_VERSION,
} from "../skill-state/workflow-state-version";
import { readGjcJson, WorkflowStateContentChecksumSchema } from "./state-schema";
import { stampWorkflowEnvelopeChecksum, writeTextAtomic } from "./state-writer";

/** Native (non-skill) workflow command registry — separate from canonical skills. */
export const NATIVE_WORKFLOW_COMMANDS = ["pabcd"] as const;
export type NativeWorkflowCommand = (typeof NATIVE_WORKFLOW_COMMANDS)[number];

export const PABCD_STAGES = ["i", "p", "a", "b", "c", "d", "complete"] as const;
export type PabcdStage = (typeof PABCD_STAGES)[number];
export const PABCD_INITIAL_STAGE: PabcdStage = "i";

/** D050-20: parallel audit revision cap; D050-19: P critic revision cap. */
export const PABCD_MAX_A_ROUNDS = 3;
export const PABCD_MAX_P_ROUNDS = 2;

export type PabcdAuditVerdict = "pending" | "pass" | "fail";
export type PabcdVerificationVerdict = "pending" | "done" | "needs_fix";
export type PabcdAuditMode = "solo" | "dual";

export interface PabcdCtx {
	/** D050-21: trivial → "solo" (Architect only), default "dual". */
	a_audit_mode?: PabcdAuditMode;
	a_round?: number;
	p_round?: number;
	p_review_passed?: boolean;
	audit_status?: PabcdAuditVerdict;
	verification_status?: PabcdVerificationVerdict;
	user_approved?: boolean;
	deliberate?: boolean;
}

export interface PabcdEnvelope {
	skill: NativeWorkflowCommand;
	version: number;
	updated_at: string;
	current_phase: PabcdStage;
	active: boolean;
	session_id?: string;
	spec_ref?: string;
	plan_ref?: string;
	ctx?: PabcdCtx;
	receipt?: unknown;
}

// ─── Transitions (port of cli-jaw state-machine.ts canTransition) ──────────
// Entry with no state file mirrors cli-jaw IDLE: only "i" or "p" may start.

export const PABCD_ENTRY_STAGES: readonly PabcdStage[] = ["i", "p"];

export const VALID_PABCD_TRANSITIONS: Readonly<Record<PabcdStage, readonly PabcdStage[]>> = {
	i: ["p"],
	p: ["i", "a"],
	a: ["i", "b"],
	b: ["i", "c"],
	c: ["i", "d", "b", "p"], // 3-way reject routing (cli-jaw P2-4)
	d: ["i", "complete"],
	complete: ["i"],
};

export interface PabcdTransitionResult {
	ok: boolean;
	reason?: string;
}

export function canTransitionPabcd(
	from: PabcdStage | null,
	to: PabcdStage,
	ctx?: PabcdCtx | null,
): PabcdTransitionResult {
	if (from === null) {
		return PABCD_ENTRY_STAGES.includes(to)
			? { ok: true }
			: { ok: false, reason: `No active pabcd state. Start with: jwc orchestrate i (or p with a spec).` };
	}
	if (!VALID_PABCD_TRANSITIONS[from]?.includes(to)) {
		return {
			ok: false,
			reason: `Invalid transition: ${from} → ${to}. Stages are forward-only with i-return; start from the next valid stage.`,
		};
	}
	// Any stage → i: always allowed, context preserved by caller.
	if (to === "i") return { ok: true };
	// a → b gated on audit verdict (strict equality) or explicit user approval.
	if (from === "a" && to === "b") {
		if (ctx?.user_approved) return { ok: true };
		if (ctx?.audit_status !== "pass") {
			return {
				ok: false,
				reason: `a → b requires audit verdict 'pass' or explicit user approval (current: ${ctx?.audit_status ?? "none"}). Record the audit verdict via --worker-output or pass --user-approved.`,
			};
		}
	}
	// b → c gated on verification verdict (strict equality) or explicit user approval.
	if (from === "b" && to === "c") {
		if (ctx?.user_approved) return { ok: true };
		if (ctx?.verification_status !== "done") {
			return {
				ok: false,
				reason: `b → c requires verification verdict 'done' or explicit user approval (current: ${ctx?.verification_status ?? "none"}). Record the verification verdict via --worker-output or pass --user-approved.`,
			};
		}
	}
	return { ok: true };
}

// ─── Worker verdict parser (port of cli-jaw state-machine.ts) ──────────────

export type PabcdWorkerVerdict = "pass" | "fail" | "done" | "needs_fix";

export function parseWorkerVerdict(text: string): PabcdWorkerVerdict | null {
	if (!text || typeof text !== "string") return null;
	// NEEDS_FIX must be checked before FAIL because the substring "FIX" can co-occur with "FAIL".
	// Strict word-boundary matches avoid catching prose like "passed previously" → 'pass'.
	if (/\bNEEDS_FIX\b/.test(text)) return "needs_fix";
	if (/\bDONE\b/.test(text)) return "done";
	if (/\bPASS\b/.test(text)) return "pass";
	if (/\bFAIL\b/.test(text)) return "fail";
	return null;
}

/**
 * Stage-p critic verdict parser (D050-23: P keeps the ralplan critic
 * vocabulary OKAY|ITERATE|REJECT — separate from the stage-a PASS|FAIL parser).
 * Negative verdicts are checked first so mixed prose fail-closes.
 */
export type PabcdCriticVerdict = "okay" | "iterate" | "reject";

export function parseCriticVerdict(text: string): PabcdCriticVerdict | null {
	if (!text || typeof text !== "string") return null;
	if (/\bREJECT\b/.test(text)) return "reject";
	if (/\bITERATE\b/.test(text)) return "iterate";
	if (/\bOKAY\b/.test(text)) return "okay";
	return null;
}

// ─── Native envelope schemas (mirror state-schema, skill fixed to "pabcd") ──

const nativeSkillEnum = z.literal("pabcd");
const ownerEnum = z.enum(["gjc-state-cli", "gjc-runtime", "gjc-hook"]);
const receiptStatusEnum = z.enum(["fresh", "stale"]);
const stageEnum = z.enum([...PABCD_STAGES]);

/** Lenient read schema — reads never reject evolving/old state (v2 read contract). */
export const NativePabcdEnvelopeSchema = z
	.object({
		skill: z.string().optional(),
		active: z.boolean().optional(),
		current_phase: z.string().optional(),
		version: z.number().optional(),
		updated_at: z.string().optional(),
		session_id: z.string().optional(),
		spec_ref: z.string().optional(),
		plan_ref: z.string().optional(),
		ctx: z
			.object({
				a_audit_mode: z.enum(["solo", "dual"]).optional(),
				a_round: z.number().optional(),
				p_round: z.number().optional(),
				p_review_passed: z.boolean().optional(),
				audit_status: z.enum(["pending", "pass", "fail"]).optional(),
				verification_status: z.enum(["pending", "done", "needs_fix"]).optional(),
				user_approved: z.boolean().optional(),
				deliberate: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		receipt: z.unknown().optional(),
	})
	.passthrough();

/** Strict native receipt required on WRITE — mirrors RequiredWorkflowStateReceiptSchema. */
export const RequiredOnWriteNativeReceiptSchema = z
	.object({
		version: z.number(),
		skill: nativeSkillEnum,
		owner: ownerEnum,
		command: z.string(),
		state_path: z.string(),
		storage_path: z.string(),
		mutated_at: z.string(),
		fresh_until: z.string(),
		status: receiptStatusEnum,
		mutation_id: z.string(),
		content_sha256: WorkflowStateContentChecksumSchema,
	})
	.passthrough();

/** Write-side fail-closed gate for the native pabcd envelope (D050-22). */
export const RequiredOnWriteNativeEnvelopeSchema = z
	.object({
		skill: nativeSkillEnum,
		version: z.literal(WORKFLOW_STATE_VERSION),
		updated_at: z.string(),
		current_phase: stageEnum,
		active: z.boolean(),
		receipt: RequiredOnWriteNativeReceiptSchema,
	})
	.passthrough();

// ─── State paths (mirror jaw-interview-runtime stateDirFor) ────────────────

function encodeSessionSegment(value: string): string {
	return encodeURIComponent(value).replaceAll(".", "%2E");
}

function stateDirFor(cwd: string, sessionId: string | undefined): string {
	return sessionId
		? path.join(cwd, ".jwc", "state", "sessions", encodeSessionSegment(sessionId))
		: path.join(cwd, ".jwc", "state");
}

export function pabcdStatePath(cwd: string, sessionId?: string): string {
	return path.join(stateDirFor(cwd, sessionId), "pabcd-state.json");
}

// ─── Native receipt + writer (D050-22: separate from canonical G1 receipt) ──

export interface NativeWorkflowReceipt {
	version: number;
	skill: NativeWorkflowCommand;
	owner: "gjc-state-cli" | "gjc-runtime" | "gjc-hook";
	command: string;
	state_path: string;
	storage_path: string;
	mutated_at: string;
	fresh_until: string;
	status: "fresh" | "stale";
	mutation_id: string;
	from_phase?: string;
	to_phase?: string;
}

export function buildNativeWorkflowReceipt(input: {
	cwd: string;
	command: string;
	sessionId?: string;
	nowIso?: string;
	mutationId?: string;
	fromPhase?: string;
	toPhase?: string;
}): NativeWorkflowReceipt {
	const mutatedAt = input.nowIso ?? new Date().toISOString();
	const freshUntil = new Date(Date.parse(mutatedAt) + WORKFLOW_STATE_RECEIPT_FRESH_MS).toISOString();
	const statePath = pabcdStatePath(input.cwd, input.sessionId);
	return {
		version: WORKFLOW_STATE_RECEIPT_VERSION,
		skill: "pabcd",
		owner: "gjc-runtime",
		command: input.command,
		state_path: statePath,
		storage_path: statePath,
		mutated_at: mutatedAt,
		fresh_until: freshUntil,
		status: "fresh",
		mutation_id: input.mutationId ?? `pabcd:${mutatedAt}`,
		...(input.fromPhase !== undefined ? { from_phase: input.fromPhase } : {}),
		...(input.toPhase !== undefined ? { to_phase: input.toPhase } : {}),
	};
}

/**
 * Fail-closed native envelope writer. Routes the filesystem mutation through
 * the sanctioned G1 writer (`writeTextAtomic`) after stamping the checksum and
 * validating against the native strict schema — mirrors
 * `writeWorkflowEnvelopeAtomic` without touching the canonical skill enum.
 */
export async function writeNativeWorkflowEnvelopeAtomic(
	cwd: string,
	envelope: PabcdEnvelope,
	options: { command: string; sessionId?: string; nowIso?: string; fromPhase?: string; toPhase?: string },
): Promise<string> {
	const filePath = pabcdStatePath(cwd, options.sessionId);
	const receipt = buildNativeWorkflowReceipt({
		cwd,
		command: options.command,
		sessionId: options.sessionId,
		nowIso: options.nowIso,
		fromPhase: options.fromPhase,
		toPhase: options.toPhase,
	});
	const stamped = stampWorkflowEnvelopeChecksum({ ...envelope, receipt }, filePath);
	const parsed = RequiredOnWriteNativeEnvelopeSchema.safeParse(stamped);
	if (!parsed.success) {
		throw new Error(
			`Refusing to write invalid native pabcd envelope to ${filePath}: ${parsed.error.issues
				.map(issue => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
				.join("; ")}`,
		);
	}
	return await writeTextAtomic(filePath, `${JSON.stringify(stamped, null, 2)}\n`, { cwd });
}

export type NativePabcdEnvelopeParsed = z.infer<typeof NativePabcdEnvelopeSchema>;

/** Read the pabcd envelope (lenient; `null` when absent, fail-open on invalid). */
export async function readPabcdState(
	cwd: string,
	sessionId?: string,
): Promise<
	{ ok: true; value: NativePabcdEnvelopeParsed; raw: unknown } | { ok: false; error: string; raw: unknown } | null
> {
	return await readGjcJson(pabcdStatePath(cwd, sessionId), NativePabcdEnvelopeSchema);
}
