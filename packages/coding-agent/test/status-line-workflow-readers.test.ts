import { describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
	readPabcdSegmentState,
	readUltragoalLedgerStats,
	truncateObjective,
} from "../src/modes/components/status-line/workflow-readers";

function tempCwd(): string {
	return mkdtempSync(path.join(os.tmpdir(), "jwc-wf-readers-"));
}

describe("workflow readers (99.04 C1)", () => {
	it("truncateObjective collapses whitespace and ellipsizes at max", () => {
		expect(truncateObjective("short goal", 40)).toBe("short goal");
		expect(truncateObjective("  a   b\n c  ", 40)).toBe("a b c");
		const long = "x".repeat(60);
		const cut = truncateObjective(long, 40);
		expect(cut.length).toBe(40);
		expect(cut.endsWith("…")).toBe(true);
	});

	it("pabcd reader returns null when no state file exists", async () => {
		expect(await readPabcdSegmentState(tempCwd())).toBeNull();
	});

	it("pabcd reader surfaces active stage + gate fields, fail-open on corrupt JSON", async () => {
		const cwd = tempCwd();
		const stateDir = path.join(cwd, ".jwc", "state");
		mkdirSync(stateDir, { recursive: true });
		writeFileSync(
			path.join(stateDir, "pabcd-state.json"),
			JSON.stringify({ skill: "pabcd", active: true, current_phase: "b", ctx: { verification_status: "pending" } }),
		);
		const state = await readPabcdSegmentState(cwd);
		expect(state?.stage).toBe("b");
		expect(state?.verificationStatus).toBe("pending");

		writeFileSync(path.join(stateDir, "pabcd-state.json"), "{corrupt");
		expect(await readPabcdSegmentState(cwd)).toBeNull();
	});

	it("pabcd reader returns null for inactive or complete envelopes", async () => {
		const cwd = tempCwd();
		const stateDir = path.join(cwd, ".jwc", "state");
		mkdirSync(stateDir, { recursive: true });
		writeFileSync(path.join(stateDir, "pabcd-state.json"), JSON.stringify({ active: false, current_phase: "b" }));
		expect(await readPabcdSegmentState(cwd)).toBeNull();
		writeFileSync(
			path.join(stateDir, "pabcd-state.json"),
			JSON.stringify({ active: true, current_phase: "complete" }),
		);
		expect(await readPabcdSegmentState(cwd)).toBeNull();
	});

	it("ledger stats count checkpoints and flag blank last evidence", () => {
		const cwd = tempCwd();
		const dir = path.join(cwd, ".jwc", "ultragoal");
		mkdirSync(dir, { recursive: true });
		const ledger = path.join(dir, "ledger.jsonl");
		writeFileSync(
			ledger,
			[
				JSON.stringify({ event: "goal_started" }),
				JSON.stringify({ event: "goal_checkpointed", evidence: "tests pass" }),
				JSON.stringify({ event: "goal_checkpointed", evidence: "" }),
				"{corrupt line",
			].join("\n"),
		);
		const stats = readUltragoalLedgerStats(cwd);
		expect(stats?.checkpointCount).toBe(2);
		expect(stats?.lastEvidenceBlank).toBe(true);
	});

	it("ledger stats use the mtime+size cache for unchanged files", () => {
		const cwd = tempCwd();
		const dir = path.join(cwd, ".jwc", "ultragoal");
		mkdirSync(dir, { recursive: true });
		const ledger = path.join(dir, "ledger.jsonl");
		writeFileSync(ledger, JSON.stringify({ event: "goal_checkpointed", evidence: "e1" }));
		const first = readUltragoalLedgerStats(cwd);
		const second = readUltragoalLedgerStats(cwd);
		expect(second).toBe(first); // identical object → cache hit

		// Touch with new mtime + different size → re-parse
		writeFileSync(
			ledger,
			`${JSON.stringify({ event: "goal_checkpointed", evidence: "e1" })}\n${JSON.stringify({ event: "goal_checkpointed", evidence: "e2" })}`,
		);
		utimesSync(ledger, new Date(), new Date(Date.now() + 1000));
		expect(readUltragoalLedgerStats(cwd)?.checkpointCount).toBe(2);
	});

	it("ledger stats return null when no ledger exists", () => {
		expect(readUltragoalLedgerStats(tempCwd())).toBeNull();
	});
});
