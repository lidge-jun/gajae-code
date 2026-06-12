import { beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import { existsSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { runNativeOrchestrateCommand } from "../../src/gjc-runtime/orchestrate-runtime";

describe("orchestrate complete — Final Summary receipt (99.00.03 P1-6)", () => {
	let cwd: string;

	beforeEach(() => {
		cwd = mkdtempSync(path.join(os.tmpdir(), "jwc-final-summary-"));
		delete process.env.JWC_SESSION_ID;
	});

	async function run(args: string[]): Promise<{ stdout?: string; stderr?: string; status: number }> {
		return await runNativeOrchestrateCommand(args, cwd);
	}

	async function driveToD(extra: string[] = []): Promise<void> {
		expect((await run(["i", ...extra])).status).toBe(0);
		expect((await run(["p", "--spec-ref", ".jwc/specs/x.md", ...extra])).status).toBe(0);
		expect((await run(["a", ...extra])).status).toBe(0);
		const passFile = path.join(cwd, "audit.txt");
		await fs.writeFile(passFile, "PASS — anchors verified", "utf-8");
		expect((await run(["verdict", "--worker-output", passFile, ...extra])).status).toBe(0);
		expect((await run(["b", ...extra])).status).toBe(0);
		const doneFile = path.join(cwd, "verify.txt");
		await fs.writeFile(doneFile, "DONE", "utf-8");
		expect((await run(["verdict", "--worker-output", doneFile, ...extra])).status).toBe(0);
		expect((await run(["c", ...extra])).status).toBe(0);
		expect((await run(["d", ...extra])).status).toBe(0);
	}

	it("appends a shared-scope receipt with transition metadata and prints the path", async () => {
		await driveToD();
		const result = await run(["complete", "--note", "세션 슬래시 표면 마감 — 테스트 노트"]);
		expect(result.status).toBe(0);
		expect(result.stdout).toContain("Final Summary receipt:");

		const worklogPath = path.join(cwd, ".jwc", "state", "worklog.md");
		expect(existsSync(worklogPath)).toBe(true);
		const worklog = await fs.readFile(worklogPath, "utf-8");
		expect(worklog).toContain("## Final Summary —");
		expect(worklog).toContain("transition: d → complete");
		expect(worklog).toContain("session: shared");
		expect(worklog).toContain("세션 슬래시 표면 마감 — 테스트 노트");
	});

	it("writes into the session-scoped worklog when --session-id rides along", async () => {
		const extra = ["--session-id", "test-session-1"];
		await driveToD(extra);
		expect((await run(["complete", ...extra])).status).toBe(0);

		const worklogPath = path.join(cwd, ".jwc", "state", "sessions", "test-session-1", "worklog.md");
		expect(existsSync(worklogPath)).toBe(true);
		const worklog = await fs.readFile(worklogPath, "utf-8");
		expect(worklog).toContain("session: test-session-1");
	});

	it("includes receipt_path in --json output and accumulates receipts append-only", async () => {
		await driveToD();
		const first = await run(["complete", "--json"]);
		expect(first.status).toBe(0);
		const parsed = JSON.parse(first.stdout ?? "{}") as { receipt_path?: string };
		expect(parsed.receipt_path).toBeTruthy();

		await driveToD();
		expect((await run(["complete"])).status).toBe(0);
		const worklog = await fs.readFile(parsed.receipt_path as string, "utf-8");
		expect(worklog.match(/## Final Summary —/g)?.length).toBe(2);
	});
});
