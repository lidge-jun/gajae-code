/**
 * `Bun.spawn` / `Bun.spawnSync` Node 22 adapter (100.04 / inventory C).
 *
 * Minimal-compat surface: command array (or {cmd}) + pipe/inherit/ignore
 * stdio mapping, web-stream stdout/stderr, FileSink-ish stdin, `exited`
 * promise, kill/exitCode/signalCode. Out of scope (deferred per plan): pty
 * fidelity and the STT recorder path.
 */
import { type ChildProcess, spawn as nodeSpawn, spawnSync as nodeSpawnSync } from "node:child_process";
import { Readable } from "node:stream";

type StdioOption = "pipe" | "inherit" | "ignore" | null | undefined | number;

export interface BunSpawnOptions {
	cmd?: string[];
	cwd?: string;
	env?: Record<string, string | undefined>;
	stdin?: StdioOption;
	stdout?: StdioOption;
	stderr?: StdioOption;
	signal?: AbortSignal;
	onExit?: (proc: unknown, exitCode: number | null, signalCode: string | null, error?: Error) => void;
}

function mapStdio(
	option: StdioOption,
	fallback: "pipe" | "inherit" | "ignore",
): "pipe" | "inherit" | "ignore" | number {
	if (option === null || option === undefined) return fallback;
	if (typeof option === "number") return option;
	return option;
}

class NodeBunSubprocess {
	readonly #child: ChildProcess;
	readonly exited: Promise<number>;
	exitCode: number | null = null;
	signalCode: string | null = null;

	constructor(child: ChildProcess, onExit?: BunSpawnOptions["onExit"]) {
		this.#child = child;
		this.exited = new Promise<number>(resolve => {
			child.once("exit", (code, signal) => {
				this.exitCode = code;
				this.signalCode = signal;
				onExit?.(this, code, signal ?? null);
				resolve(code ?? (signal ? 128 + 1 : 0));
			});
			child.once("error", error => {
				onExit?.(this, null, null, error);
				resolve(1);
			});
		});
	}

	get pid(): number | undefined {
		return this.#child.pid;
	}

	get stdout(): ReadableStream<Uint8Array> | null {
		return this.#child.stdout ? (Readable.toWeb(this.#child.stdout) as ReadableStream<Uint8Array>) : null;
	}

	get stderr(): ReadableStream<Uint8Array> | null {
		return this.#child.stderr ? (Readable.toWeb(this.#child.stderr) as ReadableStream<Uint8Array>) : null;
	}

	get stdin(): { write(chunk: string | Uint8Array): void; flush(): void; end(): void } | null {
		const stream = this.#child.stdin;
		if (!stream) return null;
		return {
			write: (chunk: string | Uint8Array) => void stream.write(chunk),
			flush: () => {},
			end: () => void stream.end(),
		};
	}

	get killed(): boolean {
		return this.#child.killed;
	}

	kill(signal?: NodeJS.Signals | number): void {
		this.#child.kill(signal as NodeJS.Signals);
	}

	ref(): void {
		this.#child.ref();
	}

	unref(): void {
		this.#child.unref();
	}
}

function normalizeArgs(
	cmdOrOptions: string[] | BunSpawnOptions,
	maybeOptions?: BunSpawnOptions,
): { cmd: string[]; options: BunSpawnOptions } {
	if (Array.isArray(cmdOrOptions)) {
		return { cmd: cmdOrOptions, options: maybeOptions ?? {} };
	}
	if (!cmdOrOptions.cmd || cmdOrOptions.cmd.length === 0) {
		throw new Error("Bun.spawn shim: missing cmd");
	}
	return { cmd: cmdOrOptions.cmd, options: cmdOrOptions };
}

export function bunSpawn(cmdOrOptions: string[] | BunSpawnOptions, maybeOptions?: BunSpawnOptions) {
	const { cmd, options } = normalizeArgs(cmdOrOptions, maybeOptions);
	const [command, ...args] = cmd;
	if (!command) throw new Error("Bun.spawn shim: empty command");
	const child = nodeSpawn(command, args, {
		cwd: options.cwd,
		env: (options.env as NodeJS.ProcessEnv) ?? process.env,
		signal: options.signal,
		// Bun defaults: stdin ignore, stdout pipe, stderr inherit.
		stdio: [mapStdio(options.stdin, "ignore"), mapStdio(options.stdout, "pipe"), mapStdio(options.stderr, "inherit")],
	});
	return new NodeBunSubprocess(child, options.onExit);
}

export function bunSpawnSync(cmdOrOptions: string[] | BunSpawnOptions, maybeOptions?: BunSpawnOptions) {
	const { cmd, options } = normalizeArgs(cmdOrOptions, maybeOptions);
	const [command, ...args] = cmd;
	if (!command) throw new Error("Bun.spawnSync shim: empty command");
	const result = nodeSpawnSync(command, args, {
		cwd: options.cwd,
		env: (options.env as NodeJS.ProcessEnv) ?? process.env,
		signal: options.signal,
		// Honor stdio so interactive/inherited-TTY spawns (tmux attach) work
		// instead of silently capturing to pipes (audit SQ-3 proc).
		stdio: [mapStdio(options.stdin, "ignore"), mapStdio(options.stdout, "pipe"), mapStdio(options.stderr, "inherit")],
	});
	return {
		pid: result.pid,
		exitCode: result.status,
		signalCode: result.signal,
		success: result.status === 0,
		stdout: result.stdout ? new Uint8Array(result.stdout) : null,
		stderr: result.stderr ? new Uint8Array(result.stderr) : null,
	};
}
