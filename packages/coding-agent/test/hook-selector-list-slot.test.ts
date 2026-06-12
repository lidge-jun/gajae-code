import { beforeAll, describe, expect, it } from "bun:test";
import { HookSelectorComponent } from "@gajae-code/coding-agent/modes/components/hook-selector";
import { getThemeByName, setThemeInstance } from "@gajae-code/coding-agent/modes/theme/theme";

beforeAll(async () => {
	const theme = await getThemeByName("red-claw");
	if (theme) setThemeInstance(theme);
});

const TITLE = "Interview question";
const OPTIONS = ["1. Alpha", "2. Beta", "3. Gamma", "4. Delta"];

function renderText(component: HookSelectorComponent, width = 80): string {
	return Bun.stripANSI(component.render(width).join("\n"));
}

describe("HookSelectorComponent output panel (082.3 v2)", () => {
	it("lists only numbered options; output panel shows N. 출력창", () => {
		const component = new HookSelectorComponent(
			TITLE,
			OPTIONS,
			() => {},
			() => {},
			{
				wrapFocused: true,
				customInputListSlot: true,
				listSlotCustomInput: { onSubmit: () => {} },
			},
		);
		const rendered = renderText(component);
		expect(rendered).toContain("1. Alpha");
		expect(rendered).toContain("4. Delta");
		expect(rendered).toContain("5. 출력창");
		expect(rendered).not.toMatch(/❯\s*5\./);
	});

	it("submits trimmed text from output panel on Enter", () => {
		const submitted: string[] = [];
		const component = new HookSelectorComponent(
			TITLE,
			OPTIONS,
			() => {},
			() => {},
			{
				wrapFocused: true,
				customInputListSlot: true,
				listSlotCustomInput: { onSubmit: text => submitted.push(text) },
			},
		);
		for (let i = 0; i < 4; i++) component.handleInput("\x1b[B");
		component.handleInput("h");
		component.handleInput("i");
		component.handleInput("\r");
		expect(submitted).toEqual(["hi"]);
	});

	it("moves from output panel back to last option on Up", () => {
		const component = new HookSelectorComponent(
			TITLE,
			OPTIONS,
			() => {},
			() => {},
			{
				wrapFocused: true,
				customInputListSlot: true,
				listSlotCustomInput: { onSubmit: () => {} },
			},
		);
		for (let i = 0; i < 4; i++) component.handleInput("\x1b[B");
		component.handleInput("\x1b[A");
		const rendered = renderText(component);
		expect(rendered).toContain("❯ 4. Delta");
	});
});