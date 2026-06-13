/**
 * `Bun.Image` Node shim (audit round-5 SQ-1 build).
 *
 * Bun.Image is a native decode/transform/encode pipeline. Node has no
 * equivalent without a heavy image dependency (sharp/jimp), which is a
 * user-approval decision (project rule: no deps without approval). So this
 * shim does what it can WITHOUT decoding:
 *  - metadata(): parse width/height/format from the file header (PNG/JPEG/GIF/
 *    WebP/BMP) — no pixel decode needed. This lets image-resize.ts take its
 *    fast path (already-within-budget images pass through untouched).
 *  - resize()/encode()/bytes(): no pure-JS encoder is bundled, so the terminal
 *    rejects with a clear, catchable error. image-resize.ts already catches it
 *    and returns the original buffer (graceful degradation) — only the
 *    WebP-source + excludeWebP config surfaces it as an explicit error, which
 *    is the honest outcome when the image genuinely cannot be re-encoded.
 */

interface ImageMetadata {
	width: number;
	height: number;
	format: string;
}

function readUInt16BE(b: Uint8Array, o: number): number {
	return ((b[o] ?? 0) << 8) | (b[o + 1] ?? 0);
}
function readUInt32BE(b: Uint8Array, o: number): number {
	return ((b[o] ?? 0) * 0x1000000 + ((b[o + 1] ?? 0) << 16) + ((b[o + 2] ?? 0) << 8) + (b[o + 3] ?? 0)) >>> 0;
}
function readUInt32LE(b: Uint8Array, o: number): number {
	return ((b[o] ?? 0) + ((b[o + 1] ?? 0) << 8) + ((b[o + 2] ?? 0) << 16) + (b[o + 3] ?? 0) * 0x1000000) >>> 0;
}

function parseImageHeader(b: Uint8Array): ImageMetadata {
	// PNG: 89 50 4E 47 0D 0A 1A 0A, IHDR width/height at offset 16/20 (BE).
	if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
		return { format: "png", width: readUInt32BE(b, 16), height: readUInt32BE(b, 20) };
	}
	// GIF: "GIF87a"/"GIF89a", width/height at 6/8 (LE 16-bit).
	if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
		return { format: "gif", width: readUInt16BE(b, 7) | (b[6] ?? 0), height: ((b[9] ?? 0) << 8) | (b[8] ?? 0) };
	}
	// BMP: "BM", width/height at 18/22 (LE 32-bit).
	if (b[0] === 0x42 && b[1] === 0x4d) {
		return { format: "bmp", width: readUInt32LE(b, 18), height: readUInt32LE(b, 22) };
	}
	// WebP: "RIFF"...."WEBP". VP8/VP8L/VP8X variants carry dims differently.
	if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) {
		const fourcc = String.fromCharCode(b[12] ?? 0, b[13] ?? 0, b[14] ?? 0, b[15] ?? 0);
		if (fourcc === "VP8X") {
			return {
				format: "webp",
				width: 1 + (readUInt32LE(b, 24) & 0xffffff),
				height: 1 + ((readUInt32LE(b, 27) >>> 0) & 0xffffff),
			};
		}
		if (fourcc === "VP8L") {
			const bits = readUInt32LE(b, 21);
			return { format: "webp", width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
		}
		// Lossy VP8: dims at offset 26/28 (14-bit LE).
		return { format: "webp", width: readUInt16BE(b, 27) & 0x3fff, height: readUInt16BE(b, 29) & 0x3fff };
	}
	// JPEG: scan SOF markers for height/width.
	if (b[0] === 0xff && b[1] === 0xd8) {
		let offset = 2;
		while (offset + 9 < b.length) {
			if (b[offset] !== 0xff) {
				offset++;
				continue;
			}
			const marker = b[offset + 1] ?? 0;
			// SOF0..SOF15 (excluding DHT/JPG/DAC at C4/C8/CC) carry frame dims.
			if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
				return { format: "jpeg", height: readUInt16BE(b, offset + 5), width: readUInt16BE(b, offset + 7) };
			}
			offset += 2 + readUInt16BE(b, offset + 2);
		}
	}
	throw new Error("Bun.Image shim: unrecognized image header (Node build cannot decode this format)");
}

function transformUnsupported(): never {
	throw new Error(
		"Bun.Image transform/encode is unavailable in the jwc Node build (no bundled image encoder); image left unmodified",
	);
}

class NodeBunImage {
	#bytes: Uint8Array;

	constructor(input: Uint8Array | ArrayBuffer | Buffer) {
		this.#bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
	}

	async metadata(): Promise<ImageMetadata> {
		return parseImageHeader(this.#bytes);
	}

	// Chainable transform surface — every terminal rejects cleanly so callers
	// fall back to the original buffer instead of crashing on a missing method.
	resize(): this {
		return this;
	}
	encode(): this {
		return this;
	}
	rotate(): this {
		return this;
	}
	flip(): this {
		return this;
	}
	async bytes(): Promise<Uint8Array> {
		return transformUnsupported();
	}
	async arrayBuffer(): Promise<ArrayBuffer> {
		return transformUnsupported();
	}
}

export const BunImage = NodeBunImage;
