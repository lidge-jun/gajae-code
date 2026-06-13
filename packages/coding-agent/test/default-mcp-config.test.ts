import { afterEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import {
	type DefaultMcpConfigInstallResult,
	installDefaultMcpConfig,
} from "@gajae-code/coding-agent/defaults/jwc-defaults";
import type { MCPConfigFile } from "../src/runtime-mcp/types";

const tempRoots: string[] = [];

async function makeTempRoot(): Promise<string> {
	const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "jwc-default-mcp-"));
	tempRoots.push(tempRoot);
	return tempRoot;
}

async function readConfig(root: string): Promise<MCPConfigFile> {
	return (await Bun.file(path.join(root, "mcp.json")).json()) as MCPConfigFile;
}

afterEach(async () => {
	await Promise.all(tempRoots.splice(0).map(root => fs.rm(root, { recursive: true, force: true })));
});

describe("default MCP config", () => {
	it("installs bundled Context7 into the target agent mcp.json", async () => {
		const targetRoot = await makeTempRoot();

		const result = await installDefaultMcpConfig({ targetRoot });

		expect(result).toEqual({
			targetRoot,
			path: path.join(targetRoot, "mcp.json"),
			serverName: "context7",
			status: "written",
		} satisfies DefaultMcpConfigInstallResult);
		const config = await readConfig(targetRoot);
		expect(config.mcpServers?.context7).toEqual({
			command: "npx",
			args: ["-y", "@upstash/context7-mcp@latest"],
		});
	});

	it("reports missing, different, and matching states in check mode", async () => {
		const targetRoot = await makeTempRoot();

		const missing = await installDefaultMcpConfig({ targetRoot, check: true });
		expect(missing.status).toBe("missing");

		await Bun.write(
			path.join(targetRoot, "mcp.json"),
			JSON.stringify({ mcpServers: { context7: { command: "node", args: ["old.js"] } } }, null, 2),
		);
		const different = await installDefaultMcpConfig({ targetRoot, check: true });
		expect(different.status).toBe("different");

		await installDefaultMcpConfig({ targetRoot });
		const matching = await installDefaultMcpConfig({ targetRoot, check: true });
		expect(matching.status).toBe("matching");
	});

	it("updates only the context7 server entry and preserves the rest of mcp.json", async () => {
		const targetRoot = await makeTempRoot();
		await Bun.write(
			path.join(targetRoot, "mcp.json"),
			JSON.stringify(
				{
					$schema: "https://example.test/schema.json",
					disabledServers: ["legacy"],
					mcpServers: {
						context7: { command: "node", args: ["old.js"] },
						legacy: { command: "legacy-mcp", args: ["--safe"] },
					},
				} satisfies MCPConfigFile,
				null,
				2,
			),
		);

		const result = await installDefaultMcpConfig({ targetRoot });

		expect(result.status).toBe("written");
		const config = await readConfig(targetRoot);
		expect(config.$schema).toBe("https://example.test/schema.json");
		expect(config.disabledServers).toEqual(["legacy"]);
		expect(config.mcpServers?.legacy).toEqual({ command: "legacy-mcp", args: ["--safe"] });
		expect(config.mcpServers?.context7).toEqual({
			command: "npx",
			args: ["-y", "@upstash/context7-mcp@latest"],
		});
	});
});
