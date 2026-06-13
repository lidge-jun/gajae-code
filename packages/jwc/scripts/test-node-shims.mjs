/**
 * Node-runtime shim checks (100.05). better-sqlite3 cannot load under Bun
 * (oven-sh/bun#4290), so the bun:sqlite adapter surface is asserted here
 * under real Node — the same runtime the dist-node bundle targets.
 *
 * Usage: node scripts/test-node-shims.mjs   (cwd: packages/jwc)
 */
import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { build } from "esbuild";

// Bundle inside the package so the external better-sqlite3 import resolves
// against the workspace node_modules (tmpdir has no resolution root).
const outfile = path.join(process.cwd(), "dist-node", `_sqlite-shim-test-${process.pid}.mjs`);
await build({
	entryPoints: ["src/shims/bun-sqlite.ts"],
	outfile,
	bundle: true,
	platform: "node",
	format: "esm",
	external: ["better-sqlite3"],
});
const { Database } = await import(outfile);

const dbPath = path.join(tmpdir(), `jwc-sqlite-shim-${process.pid}.db`);
const db = new Database(dbPath);
try {
	db.exec("CREATE TABLE kv (k TEXT PRIMARY KEY, v TEXT)");
	db.run("INSERT INTO kv (k, v) VALUES (?, ?)", "a", "1");
	db.prepare("INSERT INTO kv (k, v) VALUES ($k, $v)").run({ $k: "b", $v: "2" });
	assert.equal(db.prepare("SELECT v FROM kv WHERE k = ?").get("a")?.v, "1");
	assert.deepEqual(db.query("SELECT v FROM kv WHERE k = ?").get("b"), { v: "2" });
	assert.deepEqual(db.prepare("SELECT k FROM kv ORDER BY k").all(), [{ k: "a" }, { k: "b" }]);
	assert.equal(db.prepare("SELECT v FROM kv WHERE k = ?").get("missing"), null);
	const insertMany = db.transaction(rows => {
		for (const [k, v] of rows) db.run("INSERT INTO kv (k, v) VALUES (?, ?)", k, v);
		return rows.length;
	});
	assert.equal(
		insertMany([
			["c", "3"],
			["d", "4"],
		]),
		2,
	);
	assert.equal(db.prepare("SELECT COUNT(*) AS n FROM kv").get()?.n, 4);
	assert.deepEqual(db.prepare("SELECT k FROM kv ORDER BY k").values(), [["a"], ["b"], ["c"], ["d"]]);
	console.log("[test-node-shims] bun:sqlite adapter surface OK");
} finally {
	db.close();
	rmSync(dbPath, { force: true });
	rmSync(outfile, { force: true });
}
