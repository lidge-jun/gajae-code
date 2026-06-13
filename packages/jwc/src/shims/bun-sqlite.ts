/**
 * `bun:sqlite` Node adapter over better-sqlite3 (100.05 / inventory D).
 *
 * esbuild aliases the `bun:sqlite` specifier to this module in the Node
 * bundle; the Bun runtime keeps the native module. Surface implemented from
 * the upstream usage census (260613): Database{prepare,run,exec,transaction,
 * close,query} + Statement{get,all,run,values,iterate,finalize} + positional
 * `?` and named bindings (Bun passes `$key`-prefixed object keys —
 * better-sqlite3 wants them bare, so strip the sigil).
 */
import BetterSqlite3 from "better-sqlite3";

export type SQLQueryBindings = string | number | bigint | boolean | null | Uint8Array;

type BindArgs = ReadonlyArray<SQLQueryBindings | Record<string, SQLQueryBindings>>;

function normalizeBindings(args: BindArgs): unknown[] {
	return args.map(arg => {
		if (arg && typeof arg === "object" && !(arg instanceof Uint8Array)) {
			const bare: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(arg)) {
				bare[key.replace(/^[$@:]/, "")] = typeof value === "boolean" ? (value ? 1 : 0) : value;
			}
			return bare;
		}
		return typeof arg === "boolean" ? (arg ? 1 : 0) : arg;
	});
}

export class Statement<T = unknown> {
	#stmt: BetterSqlite3.Statement;

	constructor(stmt: BetterSqlite3.Statement) {
		this.#stmt = stmt;
	}

	get(...args: BindArgs[number][]): T | null {
		return (this.#stmt.get(...normalizeBindings(args)) as T | undefined) ?? null;
	}

	all(...args: BindArgs[number][]): T[] {
		return this.#stmt.all(...normalizeBindings(args)) as T[];
	}

	run(...args: BindArgs[number][]): { changes: number; lastInsertRowid: number | bigint } {
		const info = this.#stmt.run(...normalizeBindings(args));
		return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
	}

	values(...args: BindArgs[number][]): unknown[][] {
		return this.#stmt.raw(true).all(...normalizeBindings(args)) as unknown[][];
	}

	*iterate(...args: BindArgs[number][]): IterableIterator<T> {
		yield* this.#stmt.iterate(...normalizeBindings(args)) as IterableIterator<T>;
	}

	finalize(): void {
		// better-sqlite3 statements are GC-managed; nothing to do.
	}
}

export interface DatabaseOptions {
	readonly?: boolean;
	readwrite?: boolean;
	create?: boolean;
	strict?: boolean;
}

export class Database {
	#db: BetterSqlite3.Database;
	#queryCache = new Map<string, Statement>();

	constructor(filename: string = ":memory:", options: DatabaseOptions | number = {}) {
		const opts = typeof options === "number" ? {} : options;
		// Bun's `create: false` throws SQLITE_CANTOPEN when the file is absent
		// (write.ts/read.ts rely on this as a "DB not found" guard); the
		// better-sqlite3 equivalent is fileMustExist. `strict` has no
		// better-sqlite3 analogue and is silently dropped (audit W-2).
		this.#db = new BetterSqlite3(filename, {
			readonly: opts.readonly === true,
			fileMustExist: opts.create === false,
		});
	}

	prepare<T = unknown>(sql: string): Statement<T> {
		return new Statement<T>(this.#db.prepare(sql));
	}

	/** Bun's cached-prepare variant. */
	query<T = unknown>(sql: string): Statement<T> {
		let cached = this.#queryCache.get(sql);
		if (!cached) {
			cached = this.prepare(sql);
			this.#queryCache.set(sql, cached);
		}
		return cached as Statement<T>;
	}

	run(sql: string, ...args: BindArgs[number][]): { changes: number; lastInsertRowid: number | bigint } {
		if (args.length === 0) {
			this.#db.exec(sql);
			return { changes: 0, lastInsertRowid: 0 };
		}
		return this.prepare(sql).run(...args);
	}

	exec(sql: string): void {
		this.#db.exec(sql);
	}

	transaction<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult): (...args: TArgs) => TResult {
		return this.#db.transaction(fn) as unknown as (...args: TArgs) => TResult;
	}

	close(): void {
		this.#db.close();
	}

	get filename(): string {
		return this.#db.name;
	}
}

export default Database;
