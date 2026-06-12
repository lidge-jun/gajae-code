/**
 * Per-turn PABCD stage header (99.03 M2) — the persistence layer of the
 * workflow surface. Mirrors cli-jaw's `getPrefix()`: a 1–2 line stage banner
 * regenerated every turn so the stage context survives compaction.
 *
 * Pure function over the lenient pabcd envelope so it can be unit-tested
 * without an AgentSession; the session wires it via `#buildPabcdStageMessage`.
 */
import type { NativePabcdEnvelopeParsed } from "../gjc-runtime/orchestrate-state";

const STAGE_LABELS: Record<string, string> = {
	I: "INTERVIEW",
	P: "PLANNING",
	A: "PLAN AUDIT",
	B: "BUILD",
	C: "CHECK",
	D: "DONE",
};

const NEXT_HINTS: Record<string, string> = {
	I: "Complete requirements gathering, then run `jwc orchestrate p` when they are sufficient.",
	P: "Present the plan draft and wait for approval. When approved, run `jwc orchestrate a`.",
	A: "Run the audit subagents. On PASS + user approval, run `jwc orchestrate b`.",
	B: "Implement the plan. On verification DONE, run `jwc orchestrate c`.",
	C: "Run the gates. All green → run `jwc orchestrate d` yourself.",
	D: "Summarize the cycle, then run `jwc orchestrate d --complete`.",
};

/**
 * Build the stage-header content for an active envelope, or null when no
 * header should be injected (inactive, complete, or unknown stage).
 */
export function buildPabcdStageContent(envelope: NativePabcdEnvelopeParsed): string | null {
	if (!envelope.active) return null;
	const stage = (envelope.current_phase ?? "").toUpperCase();
	if (!stage || stage === "COMPLETE") return null;
	const label = STAGE_LABELS[stage];
	if (!label) return null;

	const ctx = envelope.ctx ?? {};
	const gateChips: string[] = [];
	if (stage === "A") {
		const audit = ctx.audit_status ?? "pending";
		if (audit !== "pass") gateChips.push(`audit=${audit}`);
	}
	if (stage === "B") {
		const verification = ctx.verification_status ?? "pending";
		if (verification !== "done") gateChips.push(`verification=${verification}`);
	}
	const gates = gateChips.length > 0 ? ` · ${gateChips.join(" · ")}` : "";

	return `[PABCD — ${stage}: ${label}${gates}]\n${NEXT_HINTS[stage] ?? ""}`.trimEnd();
}
