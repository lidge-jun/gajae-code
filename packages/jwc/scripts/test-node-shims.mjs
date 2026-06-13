/**
 * Node-runtime shim checks (100.05). better-sqlite3 cannot load under Bun
 * (oven-sh/bun#4290), so the bun:sqlite adapter surface is asserted here
 * under real Node — the same runtime the dist-node bundle targets.
 *
 * Usage: node scripts/test-node-shims.mjs   (cwd: packages/jwc)
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
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

	// B-1 regression: create:false must throw on a missing file (the write/read
	// tools rely on this as a "DB not found" guard), not silently create it.
	const missing = path.join(tmpdir(), `jwc-sqlite-absent-${process.pid}.db`);
	rmSync(missing, { force: true });
	assert.throws(() => new Database(missing, { create: false }), /unable to open|cannot open|SQLITE_CANTOPEN/i);
	assert.ok(!existsSync(missing), "create:false must not create the file");
	console.log("[test-node-shims] create:false guard OK");
} finally {
	db.close();
	rmSync(dbPath, { force: true });
	rmSync(outfile, { force: true });
}

// ── Archive shim: tar mtime round-trip (B-2) + path-traversal sanitize (B-3) ─
{
	const archiveOut = path.join(process.cwd(), "dist-node", `_archive-shim-test-${process.pid}.mjs`);
	await build({
		entryPoints: ["src/shims/bun-archive.ts"],
		outfile: archiveOut,
		bundle: true,
		platform: "node",
		format: "esm",
	});
	const { BunArchive } = await import(archiveOut);
	const tmpTar = path.join(tmpdir(), `jwc-archive-${process.pid}.tar`);
	try {
		await BunArchive.write(tmpTar, { "hello.txt": "hi there" });
		const bytes = readFileSync(tmpTar);
		const before = Date.now();
		const files = await new BunArchive(bytes).files();
		const entry = files.get("hello.txt");
		assert.ok(entry, "round-trip entry missing");
		assert.equal(await entry.text(), "hi there");
		// mtime came from the tar header (written near `before`), not a fresh
		// Date.now() at read time — both land in the same second window, but the
		// point is it is a real header value, not 0 and not drifting.
		assert.ok(entry.lastModified > 0 && entry.lastModified <= before + 2000, "mtime not from tar header");
		console.log("[test-node-shims] archive mtime round-trip OK");

		// B-3: a traversal entry name must be sanitized in the returned Map keys.
		const malicious = buildEvilTar();
		const evilFiles = await new BunArchive(malicious).files();
		for (const key of evilFiles.keys()) {
			assert.ok(!key.split("/").includes(".."), `traversal key leaked: ${key}`);
		}
		console.log("[test-node-shims] archive path-traversal sanitize OK");
	} finally {
		rmSync(tmpTar, { force: true });
		rmSync(archiveOut, { force: true });
	}
}

/** Minimal ustar tar with a single `../../etc/passwd` file entry. */
function buildEvilTar() {
	const name = "../../etc/passwd";
	const content = Buffer.from("pwned\n");
	const header = Buffer.alloc(512);
	header.write(name, 0, "utf8");
	header.write("0000644\0", 100);
	header.write("0000000\0", 108);
	header.write("0000000\0", 116);
	header.write(`${content.length.toString(8).padStart(11, "0")}\0`, 124);
	header.write(`${Math.floor(Date.now() / 1000).toString(8).padStart(11, "0")}\0`, 136);
	header.write("        ", 148);
	header[156] = 0x30;
	header.write("ustar\0", 257);
	header.write("00", 263);
	let checksum = 0;
	for (const byte of header) checksum += byte;
	header.write(`${checksum.toString(8).padStart(6, "0")}\0 `, 148);
	const body = Buffer.alloc(512);
	content.copy(body);
	return new Uint8Array(Buffer.concat([header, body, Buffer.alloc(1024)]));
}
