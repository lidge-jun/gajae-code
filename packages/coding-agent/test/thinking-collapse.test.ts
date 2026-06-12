import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { AssistantMessage } from "@gajae-code/ai";
import { resetSettingsForTest, Settings } from "@gajae-code/coding-agent/config/settings";
import { AssistantMessageComponent } from "@gajae-code/coding-agent/modes/components/assistant-message";
import { initTheme } from "@gajae-code/coding-agent/modes/theme/theme";

/**
 * Thinking block collapse (devlog 083.5): completed thinking blocks render as
 * one-line summaries by default — mirroring tool minimization (083.1) — and
 * expand via setThinkingExpanded (ctrl+t) or the shared setExpanded protocol
 * (ctrl+o global sweep). The live streaming tail always shows in full.
 */

const THINKING = "First reasoning line.\nSecond reasoning line.\nThird reasoning line.";

function buildMessage(overrides: Partial<AssistantMessage> = {}): AssistantMessage {
	return {
		role: "assistant",
		content: [{ type: "thinking", thinking: THINKING }],
		api: "anthropic-messages",
		provider: "anthropic",
		model: "claude-test",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
		},
		stopReason: "stop",
		timestamp: 0,
		...overrides,
	};
}

function renderText(component: AssistantMessageComponent, width = 120): string {
	return Bun.stripANSI(component.render(width).join("\n"));
}

beforeAll(async () => {
	await Settings.init({ inMemory: true });
	await initTheme(false);
});

afterAll(() => {
	resetSettingsForTest();
});

describe("thinking block collapse (083.5)", () => {
	it("collapses a completed thinking block to a one-line summary by default", () => {
		const component = new AssistantMessageComponent(buildMessage());
		const text = renderText(component);

		expect(text).toContain("Thinking … +3 lines");
		expect(text).not.toContain("Second reasoning line.");
	});

	it("expands via setThinkingExpanded (ctrl+t, thinking only)", () => {
		const component = new AssistantMessageComponent(buildMessage());
		component.setThinkingExpanded(true);
		const text = renderText(component);

		expect(text).toContain("Second reasoning line.");
		expect(text).not.toContain("+3 lines");

		component.setThinkingExpanded(false);
		expect(renderText(component)).toContain("Thinking … +3 lines");
	});

	it("expands via the shared setExpanded protocol (ctrl+o global sweep)", () => {
		const component = new AssistantMessageComponent(buildMessage());
		component.setExpanded(true);

		expect(renderText(component)).toContain("Second reasoning line.");
	});

	it("keeps the live streaming tail fully visible, then collapses on settle", () => {
		const component = new AssistantMessageComponent();
		component.setStreaming(true);
		component.updateContent(buildMessage());

		// Trailing thinking block of the streaming segment stays live.
		expect(renderText(component)).toContain("Second reasoning line.");

		// Once followed by visible text, the thinking block is no longer the tail.
		component.updateContent(
			buildMessage({
				content: [
					{ type: "thinking", thinking: THINKING },
					{ type: "text", text: "The answer." },
				],
			}),
		);
		const midText = renderText(component);
		expect(midText).toContain("Thinking … +3 lines");
		expect(midText).toContain("The answer.");
		expect(midText).not.toContain("Second reasoning line.");

		// Message settled with a trailing thinking block — collapses too.
		component.updateContent(buildMessage());
		component.setStreaming(false);
		expect(renderText(component)).toContain("Thinking … +3 lines");
	});

	it("keeps the legacy hideThinkingBlock setting rendering the static label", () => {
		const component = new AssistantMessageComponent(buildMessage(), true);
		const text = renderText(component);

		expect(text).toContain("Thinking...");
		expect(text).not.toContain("+3 lines");
		expect(text).not.toContain("Second reasoning line.");
	});
});

describe("thinking focus ring + transcript (99.10)", () => {
	it("exposes the duck-typed focus protocol: setFocused, expanded getter, hasThinking", () => {
		const component = new AssistantMessageComponent(buildMessage());
		expect(component.hasThinking).toBe(true);
		expect(component.expanded).toBe(false);
		component.setExpanded(true);
		expect(component.expanded).toBe(true);
		expect(typeof component.setFocused).toBe("function");
	});

	it("reports hasThinking=false for text-only messages (ring eligibility filter)", () => {
		const component = new AssistantMessageComponent(
			buildMessage({ content: [{ type: "text", text: "plain answer" }] }),
		);
		expect(component.hasThinking).toBe(false);
	});

	it("renders the accent focus marker without changing line count", () => {
		const component = new AssistantMessageComponent(buildMessage());
		const before = component.render(120);
		component.setFocused(true);
		const after = component.render(120);
		expect(after.length).toBe(before.length);
		expect(Bun.stripANSI(after[0] ?? "")).toContain("❯");
		component.setFocused(false);
		expect(component.render(120)[0]).toBe(before[0]);
	});

	it("keeps collapsed summary while focused (marker is render-only)", () => {
		const component = new AssistantMessageComponent(buildMessage());
		component.setFocused(true);
		const text = renderText(component);
		expect(text).not.toContain("Second reasoning line.");
	});

	it("transcript overlay forces thinking open via the shared expand protocol and restores", async () => {
		const { ToolTranscriptOverlayComponent } = await import(
			"@gajae-code/coding-agent/modes/components/tool-transcript-overlay"
		);
		const component = new AssistantMessageComponent(buildMessage());
		expect(component.expanded).toBe(false);
		const overlay = new ToolTranscriptOverlayComponent([component], {
			close: () => {},
			requestRender: () => {},
		});
		const text = Bun.stripANSI(overlay.render(120).join("\n"));
		expect(text).toContain("Second reasoning line.");
		// Restored to collapsed after the overlay snapshot.
		expect(component.expanded).toBe(false);
	});

	it("transcript header counts cells (tools + thinking messages)", async () => {
		const { ToolTranscriptOverlayComponent } = await import(
			"@gajae-code/coding-agent/modes/components/tool-transcript-overlay"
		);
		const overlay = new ToolTranscriptOverlayComponent([new AssistantMessageComponent(buildMessage())], {
			close: () => {},
			requestRender: () => {},
		});
		expect(Bun.stripANSI(overlay.render(120).join("\n"))).toContain("1 cells");
	});
});
