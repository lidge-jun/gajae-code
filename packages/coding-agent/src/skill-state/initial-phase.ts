import { normalizeWorkflowSkillSlug } from "../jwc-runtime/state-schema";
import type { CanonicalJwcWorkflowSkill } from "./active-state";

/**
 * Canonical initial phase for each GJC workflow skill. Used by both
 * `recordSkillActivation` (UserPromptSubmit hook seeding initial mode-state)
 * and the `jwc state <caller> handoff --to <callee>` runtime when promoting
 * the callee.
 *
 * Keeping this mapping in a neutral skill-state module avoids cycles between
 * `jwc-runtime/state-runtime.ts` and `hooks/skill-state.ts` (which pulls in
 * session-manager and ultragoal verification code).
 */
export function initialPhaseForSkill(skill: CanonicalJwcWorkflowSkill | string): string {
	const normalized = normalizeWorkflowSkillSlug(skill);
	if (normalized === "jaw-interview") return "interviewing";
	if (skill === "ultragoal") return "goal-planning";
	if (skill === "ralplan") return "planner";
	if (skill === "team") return "starting";
	return "planning";
}
