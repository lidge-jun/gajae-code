import { describe, expect, it } from "bun:test";
import { existsSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { runNativeJawInterviewCommand } from "../../src/gjc-runtime/jaw-interview-runtime";
import { runNativeOrchestrateCommand } from "../../src/gjc-runtime/orchestrate-runtime";
import { pabcdStatePath } from "../../src/gjc-runtime/orchestrate-state";

function tempCwd(): string {
	return mkdtempSync(path.join(os.tmpdir(), "jwc-reset-"));
}

async function withEnvSession<T>(sessionId: string | undefined, fn: () => Promise<T>): Promise<T> {
	const prev = process.env.JWC_SESSION_ID;
	if (sessionId === undefined) delete process.env.JWC_SESSION_ID;
	else process.env.JWC_SESSION_ID = sessionId;
	try {
		return await fn();
	} finally {
		if (prev === undefined) delete process.env.JWC_SESSION_ID;
		else process.env.JWC_SESSION_ID = prev;
	}
}

describe("orchestrate reset (99.07 U1)", () => {
	it("is a no-op exit-0 when already idle", async () => {
		await withEnvSession(undefined, async () => {
			const result = await runNativeOrchestrateCommand(["reset"], tempCwd());
			expect(result.status).toBe(0);
			expect(result.stdout).toContain("already idle");
		});
	});

	it("deletes mid-cycle state and allows clean p re-entry (live scenario: stuck in i)", async () => {
		await withEnvSession(undefined, async () => {
			const cwd = tempCwd();
			await runNativeOrchestrateCommand(["i"], cwd);
			// the live incident path: i → complete is rejected with the escape hint
			const blocked = await runNativeOrchestrateCommand(["complete"], cwd);
			expect(blocked.status).not.toBe(0);
			expect(blocked.stderr).toContain("jwc orchestrate reset");

			const reset = await runNativeOrchestrateCommand(["reset"], cwd);
			expect(reset.status).toBe(0);
			expect(reset.stdout).toContain("stage=i");
			expect(existsSync(pabcdStatePath(cwd))).toBe(false);

			const direct = await runNativeOrchestrateCommand(["p"], cwd);
			expect(direct.status).toBe(0);
			const status = await runNativeOrchestrateCommand(["status"], cwd);
			expect(status.stdout).toContain("stage=p");
		});
	});

	it("clears context fully unlike complete", async () => {
		await withEnvSession(undefined, async () => {
			const cwd = tempCwd();
			await runNativeOrchestrateCommand(["i", "--spec-ref", ".jwc/specs/x.md"], cwd);
			await runNativeOrchestrateCommand(["reset"], cwd);
			await runNativeOrchestrateCommand(["i"], cwd);
			const status = await runNativeOrchestrateCommand(["status", "--json"], cwd);
			expect(status.stdout).not.toContain("specs/x.md");
		});
	});

	it("scopes deletion to the env session and leaves other sessions intact", async () => {
		const cwd = tempCwd();
		await withEnvSession("sess-A", async () => {
			await runNativeOrchestrateCommand(["i"], cwd);
		});
		await withEnvSession("sess-B", async () => {
			await runNativeOrchestrateCommand(["i"], cwd);
		});
		await withEnvSession("sess-A", async () => {
			await runNativeOrchestrateCommand(["reset"], cwd);
		});
		expect(existsSync(pabcdStatePath(cwd, "sess-A"))).toBe(false);
		expect(existsSync(pabcdStatePath(cwd, "sess-B"))).toBe(true);
	});

	it("explicit --session-id wins over env for reset", async () => {
		const cwd = tempCwd();
		await withEnvSession("env-x", async () => {
			await runNativeOrchestrateCommand(["i", "--session-id", "flag-y"], cwd);
			const reset = await runNativeOrchestrateCommand(["reset", "--session-id", "flag-y"], cwd);
			expect(reset.status).toBe(0);
			expect(existsSync(pabcdStatePath(cwd, "flag-y"))).toBe(false);
		});
	});

	it("--shared also clears the shared path from a scoped session", async () => {
		const cwd = tempCwd();
		await withEnvSession(undefined, async () => {
			await runNativeOrchestrateCommand(["i"], cwd); // shared write
		});
		await withEnvSession("sess-C", async () => {
			await runNativeOrchestrateCommand(["i"], cwd); // scoped write
			await runNativeOrchestrateCommand(["reset", "--shared"], cwd);
		});
		expect(existsSync(pabcdStatePath(cwd))).toBe(false);
		expect(existsSync(pabcdStatePath(cwd, "sess-C"))).toBe(false);
	});

	it("--dry-run reports without deleting", async () => {
		await withEnvSession(undefined, async () => {
			const cwd = tempCwd();
			await runNativeOrchestrateCommand(["i"], cwd);
			const dry = await runNativeOrchestrateCommand(["reset", "--dry-run"], cwd);
			expect(dry.status).toBe(0);
			expect(dry.stdout).toContain("would reset");
			expect(existsSync(pabcdStatePath(cwd))).toBe(true);
		});
	});

	it("unknown-stage error now lists reset", async () => {
		await withEnvSession(undefined, async () => {
			const result = await runNativeOrchestrateCommand(["bogus"], tempCwd());
			expect(result.stderr).toContain("reset");
		});
	});
});

describe("interview cancel (99.07 U2)", () => {
	it("closes interview state and reports cleanly without --force workarounds", async () => {
		await withEnvSession(undefined, async () => {
			const cwd = tempCwd();
			await runNativeJawInterviewCommand(["test idea for cancel"], cwd);
			const cancel = await runNativeJawInterviewCommand(["cancel"], cwd);
			expect(cancel.status).toBe(0);
			expect(cancel.stdout).toContain("cancelled:");
			expect(cancel.stdout).toContain("jaw-interview closed");
		});
	});

	it("cancel on a fresh cwd is a clean no-op", async () => {
		await withEnvSession(undefined, async () => {
			const cancel = await runNativeJawInterviewCommand(["cancel"], tempCwd());
			expect(cancel.status).toBe(0);
			expect(cancel.stdout).toContain("no interview state");
		});
	});
});
