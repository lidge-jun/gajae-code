import { afterEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import {
	type DefaultMcpConfigInstallResult,
	getManagedDefaultMcpServers,
	installDefaultMcpConfig,
} from "@gajae-code/coding-agent/defaults/jwc-defaults";
import type { MCPConfigFile, MCPServerConfig, MCPStdioServerConfig } from "../src/runtime-mcp/types";

const tempRoots: string[] = [];

async function makeTempRoot(): Promise<string> {
	const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "jwc-default-mcp-"));
	tempRoots.push(tempRoot);
	return tempRoot;
}

async function readConfig(root: string): Promise<MCPConfigFile> {
	return (await Bun.file(path.join(root, "mcp.json")).json()) as MCPConfigFile;
}

function expectStdioServer(config: MCPServerConfig | undefined): MCPStdioServerConfig {
	if (!config || !("command" in config)) {
		throw new Error("Expected stdio MCP server config");
	}
	return config;
}

afterEach(async () => {
	await Promise.all(tempRoots.splice(0).map(root => fs.rm(root, { recursive: true, force: true })));
});

describe("default MCP config", () => {
	it("installs bundled managed MCP defaults into the target agent mcp.json on macOS", async () => {
		const targetRoot = await makeTempRoot();

		const result = await installDefaultMcpConfig({ targetRoot, platform: "darwin" });

		const managedDefaults = getManagedDefaultMcpServers("darwin");
		expect(result).toEqual({
			targetRoot,
			path: path.join(targetRoot, "mcp.json"),
			serverNames: Object.keys(managedDefaults),
			status: "written",
		} satisfies DefaultMcpConfigInstallResult);
		const config = await readConfig(targetRoot);
		expect(config.mcpServers?.context7).toEqual({
			command: "npx",
			args: ["-y", "@upstash/context7-mcp@latest"],
		});
		const computerUse = expectStdioServer(config.mcpServers?.["computer-use"]);
		const managedComputerUse = expectStdioServer(managedDefaults["computer-use"]);
		expect(computerUse).toEqual(managedComputerUse);
		expect(computerUse).toMatchObject({
			command: "node",
			env: {
				CU_MCP_MODE: "consolidated",
			},
		});
		expect(computerUse.args?.[0]).toEndWith("packages/cu-mcp-server/dist/index.js");
		expect(computerUse.env?.CU_NATIVE_PATH).toEndWith("packages/cu-mcp-server/bin/cu-native");
		expect(config.mcpServers?.["cua-driver"]).toEqual({
			command: "cua-driver",
			args: ["mcp"],
		});
	});

	it("reports missing, different, and matching states in check mode", async () => {
		const targetRoot = await makeTempRoot();

		const missing = await installDefaultMcpConfig({ targetRoot, check: true, platform: "darwin" });
		expect(missing.status).toBe("missing");

		const managedDefaults = getManagedDefaultMcpServers("darwin");
		await Bun.write(
			path.join(targetRoot, "mcp.json"),
			JSON.stringify(
				{
					mcpServers: {
						...managedDefaults,
						context7: { command: "node", args: ["old.js"] },
					},
				},
				null,
				2,
			),
		);
		const different = await installDefaultMcpConfig({ targetRoot, check: true, platform: "darwin" });
		expect(different.status).toBe("different");

		await installDefaultMcpConfig({ targetRoot, platform: "darwin" });
		const matching = await installDefaultMcpConfig({ targetRoot, check: true, platform: "darwin" });
		expect(matching.status).toBe("matching");
	});

	it("updates only managed default server entries and preserves the rest of mcp.json", async () => {
		const targetRoot = await makeTempRoot();
		await Bun.write(
			path.join(targetRoot, "mcp.json"),
			JSON.stringify(
				{
					$schema: "https://example.test/schema.json",
					disabledServers: ["legacy"],
					mcpServers: {
						context7: { command: "node", args: ["old.js"] },
						"computer-use": { command: "node", args: ["old-cu.js"] },
						legacy: { command: "legacy-mcp", args: ["--safe"] },
					},
				} satisfies MCPConfigFile,
				null,
				2,
			),
		);

		const result = await installDefaultMcpConfig({ targetRoot, platform: "darwin" });

		expect(result.status).toBe("written");
		const managedDefaults = getManagedDefaultMcpServers("darwin");
		const config = await readConfig(targetRoot);
		expect(config.$schema).toBe("https://example.test/schema.json");
		expect(config.disabledServers).toEqual(["legacy"]);
		expect(config.mcpServers?.legacy).toEqual({ command: "legacy-mcp", args: ["--safe"] });
		expect(config.mcpServers?.context7).toEqual({
			command: "npx",
			args: ["-y", "@upstash/context7-mcp@latest"],
		});
		expect(config.mcpServers?.["computer-use"]).toEqual(managedDefaults["computer-use"]);
		expect(config.mcpServers?.["cua-driver"]).toEqual(managedDefaults["cua-driver"]);
	});

	it("installs only platform-neutral MCP defaults outside macOS", async () => {
		const targetRoot = await makeTempRoot();
		await Bun.write(
			path.join(targetRoot, "mcp.json"),
			JSON.stringify(
				{
					mcpServers: {
						context7: { command: "node", args: ["old.js"] },
						"computer-use": { command: "node", args: ["existing-cu.js"] },
						"cua-driver": { command: "existing-cua", args: ["mcp"] },
					},
				} satisfies MCPConfigFile,
				null,
				2,
			),
		);

		const result = await installDefaultMcpConfig({ targetRoot, platform: "linux" });

		expect(result.serverNames).toEqual(["context7"]);
		const config = await readConfig(targetRoot);
		expect(config.mcpServers?.context7).toEqual({
			command: "npx",
			args: ["-y", "@upstash/context7-mcp@latest"],
		});
		expect(config.mcpServers?.["computer-use"]).toEqual({
			command: "node",
			args: ["existing-cu.js"],
		});
		expect(config.mcpServers?.["cua-driver"]).toEqual({
			command: "existing-cua",
			args: ["mcp"],
		});
	});
});
