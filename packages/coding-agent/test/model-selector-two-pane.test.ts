/**
 * ALL-tab split view (99.30.04 S7). With profiles present, the ALL tab
 * renders two panes — Profiles (left) and Models (right) — zipped per row.
 * ←/→ move pane focus (tab switching stays on tab/shift+tab); ↑/↓ navigate
 * the focused pane only. Non-ALL tabs keep the flat single-column list.
 */
import { beforeAll, describe, expect, test, vi } from "bun:test";
import type { Model } from "@gajae-code/ai";
import type { ModelProfileDefinition } from "@gajae-code/coding-agent/config/model-profiles";
import type { ModelRegistry } from "@gajae-code/coding-agent/config/model-registry";
import { Settings } from "@gajae-code/coding-agent/config/settings";
import { ModelSelectorComponent } from "@gajae-code/coding-agent/modes/components/model-selector";
import { getThemeByName, setThemeInstance, type Theme } from "@gajae-code/coding-agent/modes/theme/theme";
import type { TUI } from "@gajae-code/tui";

function stripAnsi(text: string): string {
	return text.replace(/\x1b\[[0-9;]*m/g, "");
}

let testTheme: Theme | undefined;

function installTestTheme(): void {
	if (!testTheme) throw new Error("theme not loaded");
	setThemeInstance(testTheme);
}

function createModel(provider: string, id: string): Model {
	return {
		id,
		name: id,
		api: "openai-completions",
		provider,
		baseUrl: `https://example.invalid/${provider}`,
		reasoning: false,
		input: ["text"],
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
		contextWindow: 128_000,
		maxTokens: 8192,
	} as unknown as Model;
}

const PROFILE: ModelProfileDefinition = {
	name: "profile-a",
	source: "user",
	roles: {},
} as unknown as ModelProfileDefinition;

function createRegistry(models: Model[]): ModelRegistry {
	return {
		getAll: () => models,
		getAvailable: () => models,
		refresh: vi.fn(async () => {}),
		refreshProvider: vi.fn(async () => {}),
		getError: () => undefined,
		getDiscoverableProviders: () => [],
		getCanonicalModels: () => [],
		resolveCanonicalModel: () => undefined,
		getProviderDiscoveryState: () => undefined,
		getModelProfiles: () => new Map([[PROFILE.name, PROFILE]]),
	} as unknown as ModelRegistry;
}

async function createSelector(models: Model[]): Promise<ModelSelectorComponent> {
	installTestTheme();
	const ui = { requestRender: vi.fn() } as unknown as TUI;
	const selector = new ModelSelectorComponent(
		ui,
		undefined,
		Settings.isolated({}),
		createRegistry(models),
		[],
		() => {},
		() => {},
	);
	await Bun.sleep(10);
	installTestTheme();
	return selector;
}

const MODELS = [createModel("openai-codex", "gpt-5.5"), createModel("openai-codex", "gpt-5.4")];

describe("ModelSelector ALL-tab split view (99.30.04)", () => {
	beforeAll(async () => {
		testTheme = await getThemeByName("red-claw");
	});

	test("profiles and models render side by side on the same rows", async () => {
		const selector = await createSelector(MODELS);
		const lines = selector.render(220).map(stripAnsi);
		const headerRow = lines.find(line => line.includes("Profiles") && line.includes("Models"));
		expect(headerRow).toBeDefined();
		expect(headerRow).toContain("│");
		const profileRow = lines.find(line => line.includes("profile-a"));
		expect(profileRow).toContain("gpt-5.5");
	});

	test("space moves focus to the models pane; enter targets a model", async () => {
		const selector = await createSelector(MODELS);
		selector.handleInput(" "); // space: pane toggle
		selector.handleInput("\n");
		const rendered = stripAnsi(selector.render(220).join("\n"));
		expect(rendered).toContain("Action for: gpt-5.5");
	});

	test("up/down in the profiles pane does not move the model cursor", async () => {
		const selector = await createSelector(MODELS);
		selector.handleInput("\x1b[B"); // ↓ within profiles (single profile wraps to itself)
		selector.handleInput(" "); // space: focus models
		selector.handleInput("\n");
		const rendered = stripAnsi(selector.render(220).join("\n"));
		expect(rendered).toContain("Action for: gpt-5.5");
	});

	test("arrow keys keep cycling tabs (split view does not intercept them)", async () => {
		const selector = await createSelector(MODELS);
		selector.handleInput("\x1b[C"); // → cycles ALL → CANONICAL via TabBar
		await Bun.sleep(0);
		const rendered = stripAnsi(selector.render(220).join("\n"));
		expect(rendered).not.toContain("Profiles");
	});

	test("header row advertises the space switch", async () => {
		const selector = await createSelector(MODELS);
		const rendered = stripAnsi(selector.render(220).join("\n"));
		expect(rendered).toContain("space to switch pane");
	});
});
