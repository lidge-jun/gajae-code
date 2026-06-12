#!/usr/bin/env bun
// jwc — Jawcode CLI entry. Workspace checkouts run the live engine sources
// (the published tarball ships bin/ + dist/ only, so the workspace probe fails
// there and installs run the prebuilt bundle — D-3, 063.1 M1/M2). Bundle-first
// in a workspace would freeze the CLI at the last `bun run bundle` snapshot
// (devlog 99.02 — symlink dev installs silently ran stale code).
import { existsSync } from "node:fs";

process.env.JWC_BRAND_NAME = "jwc";
process.env.GJC_BRAND_NAME = "jwc"; // legacy alias for older read sites

const workspaceCli = new URL("../../coding-agent/src/cli.ts", import.meta.url);
if (existsSync(workspaceCli)) {
	await import("@gajae-code/coding-agent/cli");
} else {
	await import("../dist/jwc.bundle.js");
}
