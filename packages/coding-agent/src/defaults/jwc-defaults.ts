import * as path from "node:path";
import { getAgentDir, isEnoent, parseFrontmatter } from "@gajae-code/utils";
import autoAnswerUncertainFragment from "./jwc/skills/jaw-interview/auto-answer-uncertain.md" with { type: "text" };
import autoResearchGreenfieldFragment from "./jwc/skills/jaw-interview/auto-research-greenfield.md" with {
	type: "text",
};
import jawInterviewSkill from "./jwc/skills/jaw-interview/SKILL.md" with { type: "text" };
import ralplanSkill from "./jwc/skills/ralplan/SKILL.md" with { type: "text" };
import teamSkill from "./jwc/skills/team/SKILL.md" with { type: "text" };
import aiSlopCleanerFragment from "./jwc/skills/ultragoal/ai-slop-cleaner.md" with { type: "text" };
import browseSkill from "./jwc/skills/browse/SKILL.md" with { type: "text" };
import searchSkill from "./jwc/skills/search/SKILL.md" with { type: "text" };
import ultragoalSkill from "./jwc/skills/ultragoal/SKILL.md" with { type: "text" };
import webAiFragment from "./jwc/skill-fragments/browse/web-ai.md" with { type: "text" };

export const DEFAULT_JWC_DEFINITION_NAMES = ["browse", "jaw-interview", "ralplan", "search", "team", "ultragoal"] as const;
export type DefaultJwcDefinitionName = (typeof DEFAULT_JWC_DEFINITION_NAMES)[number];
export type DefaultJwcDefinitionKind = "skill" | "skill-fragment";
export type EmbeddedDefaultJwcSkill = {
	name: DefaultJwcDefinitionName;
	description: string;
	filePath: string;
	baseDir: string;
	source: "bundled:default";
	hide?: boolean;
	content: string;
};
export type DefaultJwcInstallStatus = "different" | "matching" | "missing" | "skipped" | "written";

export interface DefaultJwcSkillDefinition {
	kind: "skill";
	name: DefaultJwcDefinitionName;
	relativePath: string;
	content: string;
}

export interface DefaultJwcSkillFragmentDefinition {
	kind: "skill-fragment";
	parentSkillName: DefaultJwcDefinitionName;
	relativePath: string;
	content: string;
}

export type DefaultJwcDefinition = DefaultJwcSkillDefinition | DefaultJwcSkillFragmentDefinition;

export interface InstallDefaultJwcDefinitionsOptions {
	check?: boolean;
	force?: boolean;
	targetRoot?: string;
}

export type DefaultJwcDefinitionInstallFile =
	| {
			kind: "skill";
			name: DefaultJwcDefinitionName;
			path: string;
			status: DefaultJwcInstallStatus;
	  }
	| {
			kind: "skill-fragment";
			parentSkillName: DefaultJwcDefinitionName;
			path: string;
			status: DefaultJwcInstallStatus;
	  };

export interface DefaultJwcDefinitionInstallResult {
	targetRoot: string;
	total: number;
	written: number;
	skipped: number;
	matching: number;
	missing: number;
	different: number;
	files: DefaultJwcDefinitionInstallFile[];
}

const DEFAULT_GJC_DEFINITIONS: readonly DefaultJwcDefinition[] = [
	{ kind: "skill", name: "browse", relativePath: "skills/browse/SKILL.md", content: browseSkill },
	{
		kind: "skill",
		name: "jaw-interview",
		relativePath: "skills/jaw-interview/SKILL.md",
		content: jawInterviewSkill,
	},
	{ kind: "skill", name: "ralplan", relativePath: "skills/ralplan/SKILL.md", content: ralplanSkill },
	{ kind: "skill", name: "search", relativePath: "skills/search/SKILL.md", content: searchSkill },
	{ kind: "skill", name: "team", relativePath: "skills/team/SKILL.md", content: teamSkill },
	{ kind: "skill", name: "ultragoal", relativePath: "skills/ultragoal/SKILL.md", content: ultragoalSkill },
	{
		kind: "skill-fragment",
		parentSkillName: "jaw-interview",
		relativePath: "skill-fragments/jaw-interview/auto-research-greenfield.md",
		content: autoResearchGreenfieldFragment,
	},
	{
		kind: "skill-fragment",
		parentSkillName: "jaw-interview",
		relativePath: "skill-fragments/jaw-interview/auto-answer-uncertain.md",
		content: autoAnswerUncertainFragment,
	},
	{
		kind: "skill-fragment",
		parentSkillName: "ultragoal",
		relativePath: "skill-fragments/ultragoal/ai-slop-cleaner.md",
		content: aiSlopCleanerFragment,
	},
	{
		kind: "skill-fragment",
		parentSkillName: "browse",
		relativePath: "skill-fragments/browse/web-ai.md",
		content: webAiFragment,
	},
];

export function getDefaultJwcDefinitions(): readonly DefaultJwcDefinition[] {
	return DEFAULT_GJC_DEFINITIONS;
}

export function getDefaultJwcAgentDefinitions(): readonly DefaultJwcDefinition[] {
	return [];
}

export function getEmbeddedDefaultJwcSkillFragments(
	parentSkillName: DefaultJwcDefinitionName,
): DefaultJwcSkillFragmentDefinition[] {
	return DEFAULT_GJC_DEFINITIONS.filter(
		(definition): definition is DefaultJwcSkillFragmentDefinition =>
			definition.kind === "skill-fragment" && definition.parentSkillName === parentSkillName,
	);
}

export function getEmbeddedDefaultJwcSkills(): EmbeddedDefaultJwcSkill[] {
	return DEFAULT_GJC_DEFINITIONS.filter(
		(definition): definition is DefaultJwcSkillDefinition => definition.kind === "skill",
	).map(definition => {
		const { frontmatter } = parseFrontmatter(definition.content, {
			source: `embedded:jwc/${definition.relativePath}`,
			level: "warn",
		});
		const description =
			typeof frontmatter.description === "string" ? frontmatter.description : `jwc ${definition.name} workflow`;
		return {
			name: definition.name,
			description,
			filePath: `embedded:jwc/${definition.relativePath}`,
			baseDir: `embedded:jwc/skills/${definition.name}`,
			source: "bundled:default",
			hide: frontmatter.hide === true,
			content: definition.content,
		};
	});
}

export async function installDefaultJwcDefinitions(
	options: InstallDefaultJwcDefinitionsOptions = {},
): Promise<DefaultJwcDefinitionInstallResult> {
	const targetRoot = options.targetRoot ?? getAgentDir();
	const files: DefaultJwcDefinitionInstallFile[] = [];

	for (const definition of DEFAULT_GJC_DEFINITIONS) {
		const destination = path.join(targetRoot, definition.relativePath);
		const existing = await readExistingText(destination);
		let status: DefaultJwcInstallStatus;

		if (options.check) {
			status = existing === undefined ? "missing" : existing === definition.content ? "matching" : "different";
		} else if (existing !== undefined && !options.force) {
			status = "skipped";
		} else {
			await Bun.write(destination, definition.content);
			status = "written";
		}

		if (definition.kind === "skill") {
			files.push({
				kind: definition.kind,
				name: definition.name,
				path: destination,
				status,
			});
		} else {
			files.push({
				kind: definition.kind,
				parentSkillName: definition.parentSkillName,
				path: destination,
				status,
			});
		}
	}

	return summarizeInstallResult(targetRoot, files);
}

async function readExistingText(filePath: string): Promise<string | undefined> {
	try {
		return await Bun.file(filePath).text();
	} catch (error) {
		if (isEnoent(error)) return undefined;
		throw error;
	}
}

function summarizeInstallResult(
	targetRoot: string,
	files: DefaultJwcDefinitionInstallFile[],
): DefaultJwcDefinitionInstallResult {
	return {
		targetRoot,
		total: files.length,
		written: countStatus(files, "written"),
		skipped: countStatus(files, "skipped"),
		matching: countStatus(files, "matching"),
		missing: countStatus(files, "missing"),
		different: countStatus(files, "different"),
		files,
	};
}

function countStatus(files: readonly DefaultJwcDefinitionInstallFile[], status: DefaultJwcInstallStatus): number {
	return files.filter(file => file.status === status).length;
}
