/**
 * Package-specifier SDK smoke.
 *
 * This verifies the contract cli-jaw will consume after publication:
 * `import("jawcode/sdk")`. The package is linked into a temporary
 * node_modules folder so Node uses the package export map instead of a direct
 * relative dist-node path.
 */
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const packageRoot = path.resolve(import.meta.dirname, "..");
const distNodeSdk = path.join(packageRoot, "dist-node", "sdk.js");
assert.ok(existsSync(distNodeSdk), "missing dist-node/sdk.js; run `bun run build:node` first");

const tempRoot = mkdtempSync(path.join(tmpdir(), "jawcode-packed-sdk-"));
const nodeModules = path.join(tempRoot, "node_modules");
const packageLink = path.join(nodeModules, "jawcode");

try {
	mkdirSync(nodeModules, { recursive: true });
	symlinkSync(packageRoot, packageLink, "dir");

	const importer = path.join(tempRoot, "importer.mjs");
	writeFileSync(
		importer,
		[
			'import assert from "node:assert/strict";',
			'const sdk = await import("jawcode/sdk");',
			'assert.equal(typeof sdk.createAgentSession, "function");',
			'console.log(`[smoke 120] jawcode/sdk import OK — ${Object.keys(sdk).length} exports`);',
		].join("\n"),
	);

	await import(pathToFileURL(importer).href);
} finally {
	rmSync(tempRoot, { recursive: true, force: true });
}
