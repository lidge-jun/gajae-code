import { normalizeWorkflowSkillSlug } from "../jwc-runtime/state-schema";
import { CANONICAL_JWC_WORKFLOW_SKILLS, type CanonicalJwcWorkflowSkill } from "../skill-state/active-state";

export interface SkillKeywordDefinition {
	keyword: string;
	skill: JwcWorkflowSkill;
	priority: number;
	guidance: string;
}

export const GJC_WORKFLOW_SKILLS = CANONICAL_JWC_WORKFLOW_SKILLS;

export type JwcWorkflowSkill = CanonicalJwcWorkflowSkill;

export const JWC_SKILL_KEYWORD_DEFINITIONS: readonly SkillKeywordDefinition[] = [
	{
		keyword: "$jaw-interview",
		skill: "jaw-interview",
		priority: 8,
		guidance: "Activate jwc jaw-interview requirements workflow",
	},
	{
		keyword: "deep interview",
		skill: "jaw-interview",
		priority: 8,
		guidance: "Activate jwc jaw-interview requirements workflow",
	},
	{
		keyword: "interview me",
		skill: "jaw-interview",
		priority: 8,
		guidance: "Activate jwc jaw-interview requirements workflow",
	},
	{
		keyword: "don't assume",
		skill: "jaw-interview",
		priority: 8,
		guidance: "Activate jwc jaw-interview requirements workflow",
	},
	{
		keyword: "$ralplan",
		skill: "ralplan",
		priority: 9,
		guidance: "Use jwc orchestrate p for consensus planning",
	},
	{
		keyword: "consensus plan",
		skill: "ralplan",
		priority: 9,
		guidance: "Use jwc orchestrate p for consensus planning",
	},
	{
		keyword: "$ultragoal",
		skill: "ultragoal",
		priority: 8,
		guidance: "Activate jwc goal durable goal workflow",
	},
	{
		keyword: "$goal",
		skill: "ultragoal",
		priority: 8,
		guidance: "Activate jwc goal durable goal workflow",
	},
	{
		keyword: "$team",
		skill: "team",
		priority: 8,
		guidance: "Activate jwc team workflow",
	},
	{
		keyword: "coordinated team",
		skill: "team",
		priority: 8,
		guidance: "Activate jwc team workflow",
	},
] as const;

export function isJwcWorkflowSkill(value: string): value is JwcWorkflowSkill {
	return (GJC_WORKFLOW_SKILLS as readonly string[]).includes(normalizeWorkflowSkillSlug(value));
}

export function compareSkillKeywordMatches(
	a: { priority: number; keyword: string },
	b: { priority: number; keyword: string },
): number {
	if (b.priority !== a.priority) return b.priority - a.priority;
	if (b.keyword.length !== a.keyword.length) return b.keyword.length - a.keyword.length;
	return a.keyword.localeCompare(b.keyword);
}
