/**
 * Node 22 SDK bundle skeleton (100.01). The contract output is
 * `packages/jwc/dist-node/sdk.js` — an ESM bundle of the single SDK surface
 * (`src/sdk.ts` → `@gajae-code/coding-agent/sdk`) for cli-jaw resident
 * embedding. This skeleton prioritizes a reproducible failure surface over
 * guaranteed success: Bun runtime references are expected until the 100.02+
 * shims land.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { build, type Plugin } from "esbuild";

/**
 * Upstream embeds prompts/docs via `import x from "./y.md" with
 * { type: "text" }`. The plain loader map cannot consume the import
 * attribute, so resolve+load .md/.html ourselves (loader: "text") — the
 * attribute is treated as handled once a plugin owns the resolution.
 */
// Every extension upstream embeds with `with { type: "text" }` (100.01 실측:
// .md 137 · .txt 15 · .py 3 · .lark 2 · .html 1). `.py` files are prelude
// payloads, never modules — text loading them here is intentional.
const TEXT_EMBED_FILTER = /\.(md|html|txt|py|lark)$/;

const textImportAttributes: Plugin = {
	name: "text-import-attributes",
	setup(builder) {
		builder.onResolve({ filter: TEXT_EMBED_FILTER, namespace: "file" }, args => {
			// Only claim imports that actually carry the text attribute —
			// regular module imports (none today) must keep default resolution.
			if (args.with?.type !== "text") return undefined;
			return { path: path.resolve(args.resolveDir, args.path) };
		});
		builder.onLoad({ filter: TEXT_EMBED_FILTER }, async args => ({
			contents: await readFile(args.path, "utf8"),
			loader: "text",
		}));

		// `with { type: "json" }` makes esbuild follow the JSON-modules spec
		// (default export only), which breaks upstream's named imports
		// (`import { version } from "../package.json" with { type: "json" }`).
		// Claim those and feed them through the named-export json loader.
		builder.onResolve({ filter: /\.json$/, namespace: "file" }, args => {
			if (args.with?.type !== "json") return undefined;
			return { path: path.resolve(args.resolveDir, args.path), pluginData: { jsonAttribute: true } };
		});
		builder.onLoad({ filter: /\.json$/ }, async args => {
			if (!args.pluginData?.jsonAttribute) return undefined;
			return { contents: await readFile(args.path, "utf8"), loader: "json" };
		});
	},
};

const result = await build({
	entryPoints: ["src/sdk.ts"],
	outfile: "dist-node/sdk.js",
	bundle: true,
	platform: "node",
	target: "node22",
	format: "esm",
	// Installs globalThis.Bun (Node only) before any upstream module body runs.
	inject: ["src/shims/index.ts"],
	alias: {
		// 100.05: bun:sqlite resolves to the better-sqlite3 adapter in the Node
		// bundle; the Bun runtime keeps the native module.
		"bun:sqlite": "./src/shims/bun-sqlite.ts",
	},
	plugins: [textImportAttributes],
	define: {
		"Bun.env": "process.env",
	},
	external: [
		"better-sqlite3",
		"node-tar",
		"strip-ansi",
		"json5",
		"xxhash-wasm",
		"@gajae-code/natives",
		"markit-ai",
		// Left unresolved on purpose until their shim aliases land —
		// importing these from Node will fail at runtime, not at build time.
		"bun",
		"bun:ffi",
	],
	logLevel: "info",
}).catch(error => {
	console.error("[build:node] failed:", error?.message ?? error);
	process.exit(1);
});

if (result.warnings.length > 0) {
	console.warn(`[build:node] ${result.warnings.length} warnings`);
}
console.log("[build:node] wrote dist-node/sdk.js");
