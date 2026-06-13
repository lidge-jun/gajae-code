import { describe, expect, it } from "bun:test";
import { BUILTIN_SLASH_COMMANDS_INTERNAL } from "../../src/slash-commands/builtin-registry";
import type { SlashCommandRuntime } from "../../src/slash-commands/types";

function findSearchEngineCommand() {
	const command = BUILTIN_SLASH_COMMANDS_INTERNAL.find(entry => entry.name === "searchengine");
	expect(command).toBeTruthy();
	return command;
}

function createRuntime(options: {
	outputs: string[];
	settingsLog: Array<{ key: string; value: unknown }>;
	currentWebSearch?: string;
	activeModelProvider?: string;
	configChanges?: number[];
}): SlashCommandRuntime {
	return {
		session: {
			model: options.activeModelProvider ? { provider: options.activeModelProvider } : undefined,
		},
		sessionManager: {},
		settings: {
			get: (key: string) => (key === "providers.webSearch" ? (options.currentWebSearch ?? "auto") : undefined),
			set: (key: string, value: unknown) => {
				options.settingsLog.push({ key, value });
			},
		},
		cwd: process.cwd(),
		output: (text: string) => {
			options.outputs.push(text);
		},
		refreshCommands: () => undefined,
		reloadPlugins: async () => undefined,
		notifyConfigChanged: () => {
			options.configChanges?.push(1);
		},
	} as unknown as SlashCommandRuntime;
}

describe("searchengine slash command", () => {
	it("declares allowArgs so '/searchengine chatgpt' dispatches instead of falling through to chat", () => {
		// cmd_audit P1: an args-advertising spec without allowArgs is silently
		// refused by the TUI dispatcher and the input leaks to the LLM as chat.
		const command = findSearchEngineCommand();
		expect(command?.allowArgs).toBe(true);
	});

	it("registers the uppercase /SEARCHENGINE alias (lookup is case-sensitive)", () => {
		const command = findSearchEngineCommand();
		expect(command?.aliases).toContain("SEARCHENGINE");
	});

	it("prints current provider and candidates on bare invocation", async () => {
		const outputs: string[] = [];
		const settingsLog: Array<{ key: string; value: unknown }> = [];
		const command = findSearchEngineCommand();

		await command?.handle?.(
			{ name: "searchengine", args: "", text: "/searchengine" },
			createRuntime({ outputs, settingsLog, currentWebSearch: "auto", activeModelProvider: "openai-codex" }),
		);

		const output = outputs.join("\n");
		expect(output).toContain("Search engine: auto");
		expect(output).toContain("codex");
		expect(output).toContain("Providers:");
		expect(settingsLog).toHaveLength(0);
	});

	it("canonicalizes chatgpt alias to codex and persists + notifies", async () => {
		const outputs: string[] = [];
		const settingsLog: Array<{ key: string; value: unknown }> = [];
		const configChanges: number[] = [];
		const command = findSearchEngineCommand();

		await command?.handle?.(
			{ name: "searchengine", args: "chatgpt", text: "/searchengine chatgpt" },
			createRuntime({ outputs, settingsLog, configChanges }),
		);

		expect(settingsLog).toEqual([{ key: "providers.webSearch", value: "codex" }]);
		expect(configChanges).toHaveLength(1);
		expect(outputs.join("\n")).toContain("Search engine set to codex");
	});

	it("accepts canonical provider ids directly", async () => {
		const outputs: string[] = [];
		const settingsLog: Array<{ key: string; value: unknown }> = [];
		const command = findSearchEngineCommand();

		await command?.handle?.(
			{ name: "searchengine", args: "perplexity", text: "/searchengine perplexity" },
			createRuntime({ outputs, settingsLog }),
		);

		expect(settingsLog).toEqual([{ key: "providers.webSearch", value: "perplexity" }]);
	});

	it("restores auto and describes the active model's native target", async () => {
		const outputs: string[] = [];
		const settingsLog: Array<{ key: string; value: unknown }> = [];
		const command = findSearchEngineCommand();

		await command?.handle?.(
			{ name: "searchengine", args: "auto", text: "/searchengine auto" },
			createRuntime({ outputs, settingsLog, activeModelProvider: "anthropic" }),
		);

		expect(settingsLog).toEqual([{ key: "providers.webSearch", value: "auto" }]);
		expect(outputs.join("\n")).toContain("anthropic");
	});

	it("rejects unknown providers with usage and does not mutate settings", async () => {
		const outputs: string[] = [];
		const settingsLog: Array<{ key: string; value: unknown }> = [];
		const command = findSearchEngineCommand();

		await command?.handle?.(
			{ name: "searchengine", args: "altavista", text: "/searchengine altavista" },
			createRuntime({ outputs, settingsLog }),
		);

		expect(settingsLog).toHaveLength(0);
		const output = outputs.join("\n");
		expect(output).toContain("Unknown search engine: altavista");
		expect(output).toContain("Aliases:");
	});
});
