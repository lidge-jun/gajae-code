import { beforeAll, describe, expect, it } from "bun:test";
import { resetSettingsForTest, Settings } from "@gajae-code/coding-agent/config/settings";
import { ToolExecutionComponent } from "@gajae-code/coding-agent/modes/components/tool-execution";
import * as themeModule from "@gajae-code/coding-agent/modes/theme/theme";
import type { TUI } from "@gajae-code/tui";

beforeAll(async () => {
	resetSettingsForTest();
	await Settings.init({ inMemory: true, cwd: process.cwd() });
	await themeModule.initTheme(false, undefined, undefined, "red-claw", "blue-crab");
});

const uiStub = { requestRender() {} } as unknown as TUI;

function makeTool(command: string, output: string, isError = false): ToolExecutionComponent {
	const component = new ToolExecutionComponent("bash", { command }, {}, undefined, uiStub);
	component.updateResult({ content: [{ type: "text", text: output }], isError }, false);
	return component;
}

function strip(lines: string[]): string[] {
	return lines.map(line => Bun.stripANSI(line));
}

// 083.1: completed tools collapse to a one-line summary when a newer tool
// starts; expansion (individual or global ctrl+o) overrides minimization.
describe("ToolExecutionComponent minimize", () => {
	it("renders a one-line summary with hidden-line hint when minimized", () => {
		const tool = makeTool("ls -la", "a\nb\nc\nd");
		const fullHeight = tool.render(80).length;
		tool.setMinimized(true);
		const lines = strip(tool.render(80));
		expect(lines.length).toBe(2);
		expect(lines[0]).toBe("");
		expect(lines[1]).toContain("bash");
		expect(lines[1]).toContain("ls -la");
		expect(lines[1]).toContain(`+${fullHeight - 2} lines`);
	});

	it("expansion overrides minimization and is reversible", () => {
		const tool = makeTool("git status", "clean");
		const fullLines = strip(tool.render(80));
		tool.setMinimized(true);
		expect(tool.render(80).length).toBe(2);
		tool.setExpanded(true);
		expect(strip(tool.render(80)).length).toBeGreaterThanOrEqual(fullLines.length);
		tool.setExpanded(false);
		expect(tool.render(80).length).toBe(2);
	});

	it("keeps the error icon and first error line when minimized", () => {
		const tool = makeTool("false", "command failed: exit 1\ndetails follow", true);
		tool.setMinimized(true);
		const lines = strip(tool.render(80));
		expect(lines.length).toBe(2);
		expect(lines[1]).toContain("command failed: exit 1");
		expect(lines[1]).not.toContain("details follow");
	});
});
