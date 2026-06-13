/**
 * `Bun.file` Node 22 implementation (100.03 / inventory A).
 *
 * Lazy by design, like the original: constructing the handle never touches
 * the filesystem — only the accessor methods do. The `.write()` convenience
 * mirrors BunFile.write and shares the coercion rules of `Bun.write`
 * (bun-write.ts).
 */
import * as fs from "node:fs";
import { open, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { coerceWriteData, writeTo } from "./bun-write";
import type { BunFileShim } from "./types";

export function toFsPath(path: string | URL): string {
	return typeof path === "string" ? path : fileURLToPath(path);
}

class NodeBunFile implements BunFileShim {
	readonly #path: string;

	constructor(path: string) {
		this.#path = path;
	}

	get name(): string {
		return this.#path;
	}

	get size(): number {
		try {
			return fs.statSync(this.#path).size;
		} catch {
			return 0;
		}
	}

	async text(): Promise<string> {
		return readFile(this.#path, "utf8");
	}

	async json(): Promise<unknown> {
		return JSON.parse(await this.text());
	}

	async bytes(): Promise<Uint8Array> {
		const buffer = await readFile(this.#path);
		return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	}

	async arrayBuffer(): Promise<ArrayBuffer> {
		const bytes = await this.bytes();
		return bytes.slice().buffer;
	}

	async exists(): Promise<boolean> {
		try {
			await stat(this.#path);
			return true;
		} catch {
			return false;
		}
	}

	stat(): Promise<fs.Stats> {
		return stat(this.#path);
	}

	stream(): ReadableStream<Uint8Array> {
		const nodeStream = fs.createReadStream(this.#path);
		return ReadableStream.from(nodeStream) as ReadableStream<Uint8Array>;
	}

	writer(): { write(chunk: string | Uint8Array): void; flush(): void; end(): Promise<void> } {
		const handlePromise = open(this.#path, "w");
		let chain: Promise<unknown> = handlePromise;
		return {
			write: (chunk: string | Uint8Array) => {
				chain = chain.then(async () => (await handlePromise).write(chunk as Uint8Array));
			},
			flush: () => {},
			end: async () => {
				await chain;
				await (await handlePromise).close();
			},
		};
	}

	async write(data: unknown): Promise<number> {
		return writeTo(this.#path, await coerceWriteData(data));
	}

	async delete(): Promise<void> {
		await fs.promises.rm(this.#path, { force: true });
	}
}

export function bunFile(path: string | URL): BunFileShim {
	return new NodeBunFile(toFsPath(path));
}
