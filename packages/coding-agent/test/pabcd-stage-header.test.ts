import { describe, expect, it } from "bun:test";
import type { NativePabcdEnvelopeParsed } from "../src/gjc-runtime/orchestrate-state";
import { buildPabcdStageContent } from "../src/session/pabcd-stage-header";

function envelope(overrides: Partial<NativePabcdEnvelopeParsed>): NativePabcdEnvelopeParsed {
	return { active: true, current_phase: "b", ...overrides } as NativePabcdEnvelopeParsed;
}

describe("pabcd stage header (99.03 M2)", () => {
	it("returns null when envelope is inactive", () => {
		expect(buildPabcdStageContent(envelope({ active: false }))).toBeNull();
	});

	it("returns null when the stage is complete or unknown", () => {
		expect(buildPabcdStageContent(envelope({ current_phase: "complete" }))).toBeNull();
		expect(buildPabcdStageContent(envelope({ current_phase: "" }))).toBeNull();
		expect(buildPabcdStageContent(envelope({ current_phase: "zz" }))).toBeNull();
	});

	it("returns the stage header for active stage B", () => {
		const content = buildPabcdStageContent(envelope({ current_phase: "b" }));
		expect(content).toContain("[PABCD — B: BUILD");
		expect(content).toContain("jwc orchestrate c");
	});

	it("includes audit gate chip while pending in stage A", () => {
		const content = buildPabcdStageContent(envelope({ current_phase: "a", ctx: { audit_status: "pending" } }));
		expect(content).toContain("audit=pending");
	});

	it("includes verification chip for needs_fix in stage B", () => {
		const content = buildPabcdStageContent(
			envelope({ current_phase: "b", ctx: { verification_status: "needs_fix" } }),
		);
		expect(content).toContain("verification=needs_fix");
	});

	it("omits the gate chip when the a→b gate is satisfied", () => {
		const content = buildPabcdStageContent(envelope({ current_phase: "a", ctx: { audit_status: "pass" } }));
		expect(content).toContain("[PABCD — A: PLAN AUDIT]");
		expect(content).not.toContain("audit=");
	});

	it("defaults missing ctx to pending gates", () => {
		const content = buildPabcdStageContent(envelope({ current_phase: "a" }));
		expect(content).toContain("audit=pending");
	});

	it("uppercases stage letters from the lenient envelope", () => {
		const content = buildPabcdStageContent(envelope({ current_phase: "i" }));
		expect(content).toContain("[PABCD — I: INTERVIEW]");
	});
});
