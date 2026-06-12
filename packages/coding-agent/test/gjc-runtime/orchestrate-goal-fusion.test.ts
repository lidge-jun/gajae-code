import { describe, expect, it } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { runNativeOrchestrateCommand } from "../../src/gjc-runtime/orchestrate-runtime";
import { createUltragoalPlan, startNextUltragoalGoal } from "../../src/gjc-runtime/ultragoal-runtime";

function tempCwd(): string {
	return mkdtempSync(path.join(os.tmpdir(), "jwc-fusion-"));
}

function readLedgerEvents(cwd: string): Array<Record<string, unknown>> {
	const ledgerPath = path.join(cwd, ".jwc", "ultragoal", "ledger.jsonl");
	try {
		return readFileSync(ledgerPath, "utf8")
			.split("\n")
			.filter(Boolean)
			.map(line => JSON.parse(line) as Record<string, unknown>);
	} catch {
		return [];
	}
}

describe("orchestrate↔goal fusion (99.08-B)", () => {
	it("appends a goal checkpoint on each stage transition when a goal is active", async () => {
		const cwd = tempCwd();
		await createUltragoalPlan({ cwd, brief: "fusion e2e objective" });
		await startNextUltragoalGoal({ cwd });

		const enter = await runNativeOrchestrateCommand(["i"], cwd);
		expect(enter.status).toBe(0);
		const after = readLedgerEvents(cwd).filter(
			event => event.event === "goal_checkpointed" && String(event.evidence ?? "").includes("pabcd"),
		);
		expect(after.length).toBe(1);
		expect(String(after[0].evidence)).toContain("pabcd idle→i");
		expect(String(after[0].evidence)).toContain("pabcd-state.json");
	});

	it("transition still succeeds with no goal plan (no-op fusion)", async () => {
		const cwd = tempCwd();
		const enter = await runNativeOrchestrateCommand(["i"], cwd);
		expect(enter.status).toBe(0);
		expect(readLedgerEvents(cwd).length).toBe(0);
	});
});
