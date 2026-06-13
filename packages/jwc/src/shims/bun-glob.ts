/**
 * Bun `Glob` Node implementation (100.07, used by the "bun" module alias).
 * Pattern subset: `**`, `*`, `?`, `[...]` classes, `{a,b}` alternation —
 * everything packages/utils/src/glob.ts and the find tool feed it.
 */
import * as fs from "node:fs";
import path from "node:path";

function globToRegExpSource(pattern: string): string {
	let out = "";
	let i = 0;
	while (i < pattern.length) {
		const ch = pattern[i] as string;
		if (ch === "*") {
			if (pattern[i + 1] === "*") {
				// `**` (optionally followed by /) — any depth, including none.
				if (pattern[i + 2] === "/") {
					out += "(?:[^/]+/)*";
					i += 3;
				} else {
					out += ".*";
					i += 2;
				}
			} else {
				out += "[^/]*";
				i += 1;
			}
			continue;
		}
		if (ch === "?") {
			out += "[^/]";
			i += 1;
			continue;
		}
		if (ch === "[") {
			const end = pattern.indexOf("]", i + 1);
			if (end === -1) {
				out += "\\[";
				i += 1;
				continue;
			}
			let cls = pattern.slice(i + 1, end);
			if (cls.startsWith("!")) cls = `^${cls.slice(1)}`;
			out += `[${cls}]`;
			i = end + 1;
			continue;
		}
		if (ch === "{") {
			const end = pattern.indexOf("}", i + 1);
			if (end === -1) {
				out += "\\{";
				i += 1;
				continue;
			}
			const alternatives = pattern
				.slice(i + 1, end)
				.split(",")
				.map(globToRegExpSource);
			out += `(?:${alternatives.join("|")})`;
			i = end + 1;
			continue;
		}
		out += ch.replace(/[.+^$()|\\\]]/g, "\\$&");
		i += 1;
	}
	return out;
}

export interface GlobScanOptions {
	cwd?: string;
	dot?: boolean;
	onlyFiles?: boolean;
	absolute?: boolean;
	followSymlinks?: boolean;
}

export class BunGlob {
	readonly #pattern: string;
	readonly #regex: RegExp;

	constructor(pattern: string) {
		this.#pattern = pattern;
		this.#regex = new RegExp(`^${globToRegExpSource(pattern)}$`);
	}

	match(input: string): boolean {
		return this.#regex.test(input);
	}

	async *scan(optionsOrCwd: GlobScanOptions | string = {}): AsyncIterableIterator<string> {
		yield* this.#scanIterate(typeof optionsOrCwd === "string" ? { cwd: optionsOrCwd } : optionsOrCwd);
	}

	scanSync(optionsOrCwd: GlobScanOptions | string = {}): string[] {
		const options = typeof optionsOrCwd === "string" ? { cwd: optionsOrCwd } : optionsOrCwd;
		return [...this.#walkSync(options)];
	}

	async *#scanIterate(options: GlobScanOptions): AsyncIterableIterator<string> {
		// fs walking is sync underneath; the async surface matches Bun's.
		yield* this.#walkSync(options);
	}

	*#walkSync(options: GlobScanOptions): IterableIterator<string> {
		const cwd = options.cwd ?? process.cwd();
		const onlyFiles = options.onlyFiles !== false;
		const includeDot = options.dot === true;
		const stack: string[] = [""];
		while (stack.length > 0) {
			const relDir = stack.pop() as string;
			let dirents: fs.Dirent[];
			try {
				dirents = fs.readdirSync(path.join(cwd, relDir), { withFileTypes: true });
			} catch {
				continue;
			}
			for (const dirent of dirents) {
				if (!includeDot && dirent.name.startsWith(".")) continue;
				const rel = relDir ? `${relDir}/${dirent.name}` : dirent.name;
				const isDir = dirent.isDirectory();
				if (isDir) stack.push(rel);
				if (isDir && onlyFiles) continue;
				if (this.match(rel)) {
					yield options.absolute ? path.join(cwd, rel) : rel;
				}
			}
		}
	}

	toString(): string {
		return this.#pattern;
	}
}
