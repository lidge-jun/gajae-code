#!/usr/bin/env bun
// jwc — Jawcode CLI entry. Published installs run the prebuilt bundle (D-3,
// 063.1 M1/M2); workspace checkouts fall back to the live engine sources.
process.env.JWC_BRAND_NAME = "jwc";
process.env.GJC_BRAND_NAME = "jwc"; // legacy alias for older read sites
try {
	await import("../dist/jwc.bundle.js");
} catch {
	await import("@gajae-code/coding-agent/cli");
}
