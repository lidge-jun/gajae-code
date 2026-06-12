import { afterEach, describe, expect, it } from "bun:test";
import { checkForNewVersion } from "../src/main";

const ORIGINAL_JWC = process.env.JWC_BRAND_NAME;
const ORIGINAL_GJC = process.env.GJC_BRAND_NAME;

function restoreBrand(): void {
	if (ORIGINAL_JWC === undefined) delete process.env.JWC_BRAND_NAME;
	else process.env.JWC_BRAND_NAME = ORIGINAL_JWC;
	if (ORIGINAL_GJC === undefined) delete process.env.GJC_BRAND_NAME;
	else process.env.GJC_BRAND_NAME = ORIGINAL_GJC;
}

describe("checkForNewVersion brand gating (99.05-W1)", () => {
	afterEach(restoreBrand);

	it("skips the remote check entirely under the jaw brand (npm 'jwc' is squatted)", async () => {
		process.env.JWC_BRAND_NAME = "jwc";
		const originalFetch = globalThis.fetch;
		let fetched = false;
		globalThis.fetch = (async () => {
			fetched = true;
			return new Response("{}", { status: 200 });
		}) as unknown as typeof fetch;
		try {
			const result = await checkForNewVersion("0.0.1");
			expect(result).toBeUndefined();
			expect(fetched).toBe(false);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
