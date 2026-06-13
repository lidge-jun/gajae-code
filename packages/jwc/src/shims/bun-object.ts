/**
 * Node-side `globalThis.Bun` construction (100.02 skeleton).
 *
 * Every member starts as an explicit "shim not implemented" thrower so the
 * first runtime failure names the missing API instead of crashing on
 * `Bun is undefined`. 100.03+ replaces the stubs with real Node 22
 * implementations (file/sleep → 100.03, spawn → 100.04, data core → 100.05,
 * peripherals → 100.07).
 */
import { bunFile } from "./bun-file";
import { bunSleep, bunSleepSync } from "./bun-sleep";
import { bunStderr, bunStdin, bunStdout } from "./bun-stdio";
import { bunWrite } from "./bun-write";
import type { BunShim } from "./types";

function notImplemented(api: string): never {
	throw new Error(`Bun.${api} shim not implemented (jwc dist-node, see devlog 100.02+)`);
}

function stubFn(api: string): (...args: unknown[]) => never {
	return () => notImplemented(api);
}

export function buildNodeBunShim(): BunShim {
	return {
		__jwcNodeShim: true,
		file: bunFile,
		write: bunWrite as BunShim["write"],
		sleep: bunSleep as BunShim["sleep"],
		sleepSync: bunSleepSync,
		spawn: stubFn("spawn"),
		spawnSync: stubFn("spawnSync"),
		hash: stubFn("hash") as unknown as BunShim["hash"],
		CryptoHasher: class {
			constructor() {
				notImplemented("CryptoHasher");
			}
		},
		SHA256: class {
			constructor() {
				notImplemented("SHA256");
			}
		},
		JSONL: { parseChunk: stubFn("JSONL.parseChunk") },
		JSON5: { parse: stubFn("JSON5.parse") as unknown as (text: string) => unknown },
		serve: stubFn("serve"),
		stdin: bunStdin,
		stdout: bunStdout,
		stderr: bunStderr,
		stripANSI: stubFn("stripANSI") as unknown as BunShim["stripANSI"],
		semver: {
			order: stubFn("semver.order") as unknown as BunShim["semver"]["order"],
			satisfies: stubFn("semver.satisfies") as unknown as BunShim["semver"]["satisfies"],
		},
		Archive: class {
			constructor() {
				notImplemented("Archive");
			}
		},
		gc: () => {
			// no-op on Node by design (100 MOC mapping P)
		},
		env: process.env,
		argv: process.argv,
		version: "0.0.0-jwc-node-shim",
		main: process.argv[1] ?? "",
		which: stubFn("which") as unknown as BunShim["which"],
		randomUUIDv7: stubFn("randomUUIDv7") as unknown as BunShim["randomUUIDv7"],
		nanoseconds: () => Number(process.hrtime.bigint()),
	};
}
