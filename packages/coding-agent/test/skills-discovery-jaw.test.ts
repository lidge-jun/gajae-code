import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { loadSkills } from "@gajae-code/coding-agent/extensibility/skills";
import { cleanupTempHome } from "./helpers/temp-home-cleanup";

function writeSkill(baseDir: string, name: string, description = `${name} test skill`): void {
	const dir = path.join(baseDir, name);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(path.join(dir, "SKILL.md"), `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`);
}

describe("jaw-brand skill discovery (substitution model)", () => {
	let tempDir = "";
	let tempHomeDir = "";
	let originalHome: string | undefined;
	let originalBrand: string | undefined;
	let projectDir = "";

	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gjc-skills-"));
		tempHomeDir = fs.mkdtempSync(path.join(os.tmpdir(), "gjc-skills-home-"));
		originalHome = process.env.HOME;
		originalBrand = process.env.GJC_BRAND_NAME;
		process.env.HOME = tempHomeDir;
		delete process.env.GJC_BRAND_NAME;
		vi.spyOn(os, "homedir").mockReturnValue(tempHomeDir);
		// Project nested under a work dir so .agents walk-up has a non-home ancestor.
		projectDir = path.join(tempHomeDir, "work", "project");
		fs.mkdirSync(projectDir, { recursive: true });
	});

	afterEach(() => {
		if (originalBrand === undefined) delete process.env.GJC_BRAND_NAME;
		else process.env.GJC_BRAND_NAME = originalBrand;
		cleanupTempHome(() => ({ tempDir, tempHomeDir, originalHome }))();
	});

	const cliJawSkillsDir = () => path.join(tempHomeDir, ".cli-jaw", "skills");
	const nativeUserSkillsDir = () => path.join(tempHomeDir, ".gjc", "agent", "skills");
	const agentsSkillsDir = () => path.join(tempHomeDir, "work", ".agents", "skills");

	it("jwc brand: cli-jaw global root replaces the native user root", async () => {
		writeSkill(cliJawSkillsDir(), "jaw-global");
		writeSkill(nativeUserSkillsDir(), "native-user");
		process.env.GJC_BRAND_NAME = "jwc";

		const { skills } = await loadSkills({ cwd: projectDir });
		const names = skills.map(s => s.name);
		expect(names).toContain("jaw-global");
		expect(names).not.toContain("native-user");
	});

	it("jwc brand: cli-jaw wins name collisions against .agents (global beats project)", async () => {
		writeSkill(cliJawSkillsDir(), "shared-skill", "cli-jaw version");
		writeSkill(agentsSkillsDir(), "shared-skill", "agents version");
		process.env.GJC_BRAND_NAME = "jwc";

		const { skills } = await loadSkills({ cwd: projectDir });
		const match = skills.find(s => s.name === "shared-skill");
		expect(match).toBeDefined();
		expect(match?.source).toBe("cli-jaw:user");
	});

	it("jwc brand: native-overlap skills (memory, dev-pabcd) are excluded", async () => {
		writeSkill(cliJawSkillsDir(), "memory");
		writeSkill(cliJawSkillsDir(), "dev-pabcd");
		writeSkill(cliJawSkillsDir(), "diagram");
		process.env.GJC_BRAND_NAME = "jwc";

		const { skills } = await loadSkills({ cwd: projectDir });
		const names = skills.map(s => s.name);
		expect(names).toContain("diagram");
		expect(names).not.toContain("memory");
		expect(names).not.toContain("dev-pabcd");
	});

	it("gjc brand (no env): cli-jaw and .agents sources stay invisible (diff-0)", async () => {
		writeSkill(cliJawSkillsDir(), "jaw-global");
		writeSkill(agentsSkillsDir(), "agents-skill");
		writeSkill(nativeUserSkillsDir(), "native-user");

		const { skills } = await loadSkills({ cwd: projectDir });
		const names = skills.map(s => s.name);
		expect(names).toContain("native-user");
		expect(names).not.toContain("jaw-global");
		expect(names).not.toContain("agents-skill");
	});

	it("jwc brand without ~/.cli-jaw/skills: native user root remains (fallback)", async () => {
		writeSkill(nativeUserSkillsDir(), "native-user");
		process.env.GJC_BRAND_NAME = "jwc";

		const { skills } = await loadSkills({ cwd: projectDir });
		expect(skills.map(s => s.name)).toContain("native-user");
	});

	it("jwc brand: .agents/skills is discovered via project walk-up", async () => {
		writeSkill(agentsSkillsDir(), "agents-skill");
		process.env.GJC_BRAND_NAME = "jwc";

		const { skills } = await loadSkills({ cwd: projectDir });
		const match = skills.find(s => s.name === "agents-skill");
		expect(match).toBeDefined();
		expect(match?.source).toBe("agents:project");
	});
});
