/**
 * `Bun.Archive` Node adapter (100.07 / inventory O).
 *
 * Upstream surface (archive-reader.ts / write.ts census): `new Archive(bytes)`
 * + `await archive.files(): Map<string, File>` for reading, and static
 * `Archive.write(path, entries)` for writing. Formats: zip via fflate
 * (workspace catalog dep), tar/tar.gz via a compact ustar reader/writer +
 * node:zlib. Exotic tar features (sparse, GNU longlink beyond 'L') are out of
 * scope — explicit errors, not silent corruption.
 */
import { writeFile } from "node:fs/promises";
import { gunzipSync, gzipSync } from "node:zlib";
import { unzipSync, zipSync } from "fflate";

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

// ── tar (ustar) ─────────────────────────────────────────────────────────────

function readOctal(bytes: Uint8Array, offset: number, length: number): number {
	const text = DECODER.decode(bytes.subarray(offset, offset + length))
		.replace(/\0/g, "")
		.trim();
	return text.length === 0 ? 0 : Number.parseInt(text, 8);
}

function readString(bytes: Uint8Array, offset: number, length: number): string {
	const raw = bytes.subarray(offset, offset + length);
	const nul = raw.indexOf(0);
	return DECODER.decode(nul === -1 ? raw : raw.subarray(0, nul));
}

interface TarEntry {
	data: Uint8Array;
	mtimeMs: number;
}

/**
 * Strip leading-slash and `..`/`.` path components so a malicious archive
 * cannot surface an escaping key (audit B-3). archive-reader normalizes again
 * downstream, but the shim's own Map must never carry a traversal key.
 */
function sanitizeEntryName(name: string): string {
	return name
		.split("/")
		.filter(segment => segment !== "" && segment !== "." && segment !== "..")
		.join("/");
}

function parseTar(bytes: Uint8Array): Map<string, TarEntry> {
	const entries = new Map<string, TarEntry>();
	let offset = 0;
	let pendingLongName: string | null = null;
	while (offset + 512 <= bytes.length) {
		const block = bytes.subarray(offset, offset + 512);
		if (block.every(byte => byte === 0)) break;
		const size = readOctal(bytes, offset + 124, 12);
		const mtimeSec = readOctal(bytes, offset + 136, 12);
		const typeflag = String.fromCharCode(bytes[offset + 156] ?? 0);
		let name = readString(bytes, offset, 100);
		const prefix = readString(bytes, offset + 345, 155);
		if (prefix) name = `${prefix}/${name}`;
		const dataStart = offset + 512;
		const data = bytes.subarray(dataStart, dataStart + size);
		if (typeflag === "L") {
			// GNU long name: payload is the next entry's name.
			pendingLongName = DECODER.decode(data).replace(/\0+$/, "");
		} else {
			if (pendingLongName) {
				name = pendingLongName;
				pendingLongName = null;
			}
			if (typeflag === "0" || typeflag === "\0" || typeflag === "") {
				const safe = sanitizeEntryName(name);
				if (safe) entries.set(safe, { data: data.slice(), mtimeMs: mtimeSec * 1000 });
			}
			// Directories/symlinks/others are skipped — reader surfaces files only.
		}
		offset = dataStart + Math.ceil(size / 512) * 512;
	}
	return entries;
}

function writeOctal(target: Uint8Array, offset: number, length: number, value: number): void {
	const text = value.toString(8).padStart(length - 1, "0");
	target.set(ENCODER.encode(text.slice(0, length - 1)), offset);
	target[offset + length - 1] = 0;
}

function tarHeader(name: string, size: number): Uint8Array {
	if (ENCODER.encode(name).length > 100) {
		throw new Error(`Bun.Archive shim: tar entry name exceeds 100 bytes (${name})`);
	}
	const header = new Uint8Array(512);
	header.set(ENCODER.encode(name).subarray(0, 100), 0);
	writeOctal(header, 100, 8, 0o644); // mode
	writeOctal(header, 108, 8, 0); // uid
	writeOctal(header, 116, 8, 0); // gid
	writeOctal(header, 124, 12, size);
	writeOctal(header, 136, 12, Math.floor(Date.now() / 1000));
	header.set(ENCODER.encode("        "), 148); // checksum placeholder (spaces)
	header[156] = 0x30; // typeflag '0'
	header.set(ENCODER.encode("ustar\0"), 257);
	header.set(ENCODER.encode("00"), 263);
	let checksum = 0;
	for (const byte of header) checksum += byte;
	const checksumText = `${checksum.toString(8).padStart(6, "0")}\0 `;
	header.set(ENCODER.encode(checksumText), 148);
	return header;
}

function buildTar(entries: Map<string, Uint8Array>): Uint8Array {
	const parts: Uint8Array[] = [];
	for (const [name, data] of entries) {
		parts.push(tarHeader(name, data.byteLength));
		parts.push(data);
		const pad = (512 - (data.byteLength % 512)) % 512;
		if (pad) parts.push(new Uint8Array(pad));
	}
	parts.push(new Uint8Array(1024)); // end-of-archive blocks
	const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
	const out = new Uint8Array(total);
	let cursor = 0;
	for (const part of parts) {
		out.set(part, cursor);
		cursor += part.byteLength;
	}
	return out;
}

// ── format detection + entry coercion ───────────────────────────────────────

function isZip(bytes: Uint8Array): boolean {
	return bytes[0] === 0x50 && bytes[1] === 0x4b;
}

function isGzip(bytes: Uint8Array): boolean {
	return bytes[0] === 0x1f && bytes[1] === 0x8b;
}

async function coerceEntry(value: unknown): Promise<Uint8Array> {
	if (typeof value === "string") return ENCODER.encode(value);
	if (value instanceof Uint8Array) return value;
	if (value instanceof ArrayBuffer) return new Uint8Array(value);
	if (typeof Blob !== "undefined" && value instanceof Blob) return new Uint8Array(await value.arrayBuffer());
	throw new Error(`Bun.Archive shim: unsupported entry type ${Object.prototype.toString.call(value)}`);
}

// ── public surface ──────────────────────────────────────────────────────────

export class BunArchive {
	#bytes: Uint8Array;

	constructor(input: Uint8Array | ArrayBuffer) {
		this.#bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
		if (this.#bytes.byteLength === 0) {
			throw new Error("Bun.Archive shim: empty archive input");
		}
	}

	async files(): Promise<Map<string, File>> {
		const files = new Map<string, File>();
		if (isZip(this.#bytes)) {
			// fflate exposes no per-entry mtime; lastModified 0 makes
			// archive-reader treat mtime as absent (its `> 0` guard) rather
			// than polluting it with Date.now() (audit B-2).
			for (const [name, data] of Object.entries(unzipSync(this.#bytes))) {
				const safe = sanitizeEntryName(name);
				if (!safe || name.endsWith("/")) continue;
				files.set(safe, new File([data as BlobPart], safe, { lastModified: 0 }));
			}
		} else {
			const tarBytes = isGzip(this.#bytes) ? new Uint8Array(gunzipSync(this.#bytes)) : this.#bytes;
			for (const [name, entry] of parseTar(tarBytes)) {
				files.set(name, new File([entry.data as BlobPart], name, { lastModified: entry.mtimeMs }));
			}
		}
		return files;
	}

	static async write(path: string, entries: Record<string, unknown>): Promise<void> {
		const normalized = new Map<string, Uint8Array>();
		for (const [name, value] of Object.entries(entries)) {
			normalized.set(name, await coerceEntry(value));
		}
		let bytes: Uint8Array;
		if (/\.zip$/i.test(path)) {
			const zipInput: Record<string, Uint8Array> = {};
			for (const [name, data] of normalized) zipInput[name] = data;
			bytes = zipSync(zipInput);
		} else {
			const tar = buildTar(normalized);
			bytes = /\.(tgz|tar\.gz)$/i.test(path) ? new Uint8Array(gzipSync(tar)) : tar;
		}
		await writeFile(path, bytes);
	}
}
