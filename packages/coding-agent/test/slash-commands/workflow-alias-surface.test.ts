import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { GOAL_PLAN_PENDING_BRIEF, runNativeGoalCommand } from "@gajae-code/coding-agent/gjc-runtime/goal-runtime";
import {
	BUILTIN_SLASH_COMMAND_DEFS,
	BUILTIN_SLASH_COMMANDS_INTERNAL,
} from "@gajae-code/coding-agent/slash-commands/builtin-registry";

describe("workflow alias slash surface (99.07 S4)", () => {
	it("registers /gd, /goalplan, /interview as handle-bearing commands", () => {
		for (const name of ["gd", "goalplan", "interview"]) {
			const spec = BUILTIN_SLASH_COMMANDS_INTERNAL.find(cmd => cmd.name === name);
			expect(spec, `/${name} missing from registry`).toBeDefined();
			expect(spec?.allowArgs).toBe(true);
			expect(typeof spec?.handle).toBe("function");
		}
	});

	it("exposes reset in /orchestrate subcommand autocomplete", () => {
		const orchestrate = BUILTIN_SLASH_COMMAND_DEFS.find(def => def.name === "orchestrate");
		expect(orchestrate?.subcommands?.map(sub => sub.name)).toContain("reset");
		expect(orchestrate?.inlineHint).toContain("reset");
	});
});

describe("goal plan hint invariant (99.07 S4)", () => {
	let tmpDir: string;

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "jwc-goalplan-"));
	});

	afterEach(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it("stores the hint inside the pending-refinement brief, never as the objective", async () => {
		const result = await runNativeGoalCommand(["plan", "session switch UX"], tmpDir);
		expect(result.status).toBe(0);

		const briefPath = path.join(tmpDir, ".jwc", "ultragoal", "brief.md");
		const goalsPath = path.join(tmpDir, ".jwc", "ultragoal", "goals.json");
		const stored = [briefPath, goalsPath]
			.filter(p => fs.existsSync(p))
			.map(p => fs.readFileSync(p, "utf8"))
			.join("\n");
		expect(stored.length).toBeGreaterThan(0);
		// The brief must carry the sentinel; the hint rides along but does not
		// replace it (hint is directional guidance, not the objective).
		expect(stored).toContain(GOAL_PLAN_PENDING_BRIEF);
		const sentinelIndex = stored.indexOf(GOAL_PLAN_PENDING_BRIEF);
		const hintIndex = stored.indexOf("session switch UX");
		expect(hintIndex).toBeGreaterThan(sentinelIndex);
	});
});
