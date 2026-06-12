/**
 * Query/save surface over the local memories pipeline (99.01 M2).
 *
 * The engine (`memories/index.ts` + `storage.ts`) is an automatic
 * summarisation pipeline with no search verbs; this module adds the
 * cli-jaw-shaped read side without touching the schema. Ranking is the
 * 1st-iteration contract from 99.01.01 §2: SQL LIKE + kind weight +
 * recency — FTS5/RRF are follow-ups.
 *
 * Manual saves write straight into `stage1_outputs` (the
 * `markStage1SucceededWithOutput` path requires a running job's
 * ownership token, which manual rows never hold) and join phase2
 * consolidation through the normal watermark queue.
 */

import type { Database } from "bun:sqlite";
import * as fs from "node:fs";
import * as path from "node:path";
import { getAgentDbPath } from "@gajae-code/utils";
import { getMemoryRoot } from "./index";
import { closeMemoryDb, enqueueGlobalWatermark, openMemoryDb, upsertThreads } from "./storage";

export type LocalMemoryKind = "profile" | "shared" | "episode";

export interface LocalMemoryHit {
	/** Stable reference usable with `readLocalMemoryArtifact` (e.g. "memory", "summary", "stage1:<id>"). */
	ref: string;
	kind: LocalMemoryKind;
	line?: number;
	snippet: string;
	/** Lower is better (cli-jaw score semantics). */
	score: number;
	generatedAt?: number;
}

const SNIPPET_LIMIT = 700;
const DEFAULT_SEARCH_LIMIT = 8;
/** Kind weights mirror cli-jaw ranking priors (lower = stronger). */
const KIND_WEIGHT: Record<LocalMemoryKind, number> = { profile: -4, shared: -3, episode: 0 };
/** Single hard-coded synonym group (99.01.01 §6(a)) — FTS5 synonyms are a follow-up. */
const SYNONYM_GROUPS: ReadonlyArray<ReadonlyArray<string>> = [["pabcd", "plan", "audit", "build", "check", "done"]];

const MANUAL_THREAD_PREFIX = "manual:";
const MANUAL_SOURCE_KIND = "manual";

function withDb<T>(agentDir: string, fn: (db: Database) => T): T {
	const dbPath = getAgentDbPath(agentDir);
	fs.mkdirSync(path.dirname(dbPath), { recursive: true });
	const db = openMemoryDb(dbPath);
	try {
		return fn(db);
	} finally {
		closeMemoryDb(db);
	}
}

function unixNow(): number {
	return Math.floor(Date.now() / 1000);
}

/** Expand query terms with the seeded synonym groups (both directions). */
export function expandQueryTerms(query: string): string[] {
	const base = query
		.toLowerCase()
		.split(/[^\p{L}\p{N}_-]+/u)
		.filter(t => t.length >= 2);
	const terms = new Set(base);
	for (const group of SYNONYM_GROUPS) {
		if (base.some(t => group.includes(t))) for (const g of group) terms.add(g);
	}
	return [...terms];
}

/** Recency boost: hits from the last week float up; lower is better. */
function recencyBoost(generatedAt: number | undefined, nowSec: number): number {
	if (!generatedAt) return 0;
	const daysAgo = Math.max(0, (nowSec - generatedAt) / 86_400);
	return -Math.max(0, 2 - daysAgo / 7);
}

function clip(text: string, limit = SNIPPET_LIMIT): string {
	const collapsed = text.replace(/\s+/g, " ").trim();
	return collapsed.length > limit ? `${collapsed.slice(0, limit - 1)}…` : collapsed;
}

interface Stage1QueryRow {
	thread_id: string;
	raw_memory: string;
	rollout_summary: string;
	rollout_slug: string | null;
	generated_at: number;
}

function searchStage1Rows(db: Database, cwd: string, terms: string[], limit: number): LocalMemoryHit[] {
	if (terms.length === 0) return [];
	const likes = terms.map(() => "(o.raw_memory LIKE ? OR o.rollout_summary LIKE ?)").join(" OR ");
	const params: string[] = [];
	for (const t of terms) {
		const p = `%${t}%`;
		params.push(p, p);
	}
	const rows = db
		.prepare(
			`SELECT o.thread_id, o.raw_memory, o.rollout_summary, o.rollout_slug, o.generated_at
FROM stage1_outputs o
LEFT JOIN threads t ON t.id = o.thread_id
WHERE t.cwd = ? AND (${likes})
ORDER BY o.generated_at DESC
LIMIT ?`,
		)
		.all(cwd, ...params, limit * 4) as Stage1QueryRow[];
	const nowSec = unixNow();
	return rows.map(row => ({
		ref: `stage1:${row.thread_id}`,
		kind: "episode" as const,
		snippet: clip(row.raw_memory || row.rollout_summary),
		score: KIND_WEIGHT.episode + recencyBoost(row.generated_at, nowSec),
		generatedAt: row.generated_at,
	}));
}

function searchArtifact(
	memoryRoot: string,
	file: string,
	ref: string,
	kind: LocalMemoryKind,
	terms: string[],
): LocalMemoryHit[] {
	const filePath = path.join(memoryRoot, file);
	if (!fs.existsSync(filePath)) return [];
	let content: string;
	try {
		content = fs.readFileSync(filePath, "utf8");
	} catch {
		return [];
	}
	const hits: LocalMemoryHit[] = [];
	const lines = content.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const lower = lines[i].toLowerCase();
		if (!terms.some(t => lower.includes(t))) continue;
		const context = lines.slice(Math.max(0, i - 1), i + 2).join(" ");
		hits.push({ ref, kind, line: i + 1, snippet: clip(context), score: KIND_WEIGHT[kind] });
		if (hits.length >= 3) break; // a few hits per artifact are enough — the artifact itself is one ref
	}
	return hits;
}

/**
 * LIKE search over stage1 rows + generated artifacts for one project.
 * Returns up to `limit` hits sorted by score (lower = better).
 */
export function searchLocalMemories(
	agentDir: string,
	cwd: string,
	query: string,
	limit = DEFAULT_SEARCH_LIMIT,
): LocalMemoryHit[] {
	const terms = expandQueryTerms(query);
	if (terms.length === 0) return [];
	const memoryRoot = getMemoryRoot(agentDir, cwd);
	const stageHits = withDb(agentDir, db => searchStage1Rows(db, cwd, terms, limit));
	const artifactHits = [
		...searchArtifact(memoryRoot, "MEMORY.md", "memory", "profile", terms),
		...searchArtifact(memoryRoot, "memory_summary.md", "summary", "shared", terms),
	];
	return [...artifactHits, ...stageHits].sort((a, b) => a.score - b.score).slice(0, limit);
}

export interface ReadArtifactResult {
	ref: string;
	content: string;
}

/**
 * Read a memory artifact or record by ref vocabulary:
 * `summary` | `memory` | `raw` | `stage1:<thread_id>` | `rollout:<slug>`
 * (+ artifact basename compatibility). Optional `lines` = "a-b" range.
 */
export function readLocalMemoryArtifact(
	agentDir: string,
	cwd: string,
	ref: string,
	lines?: string,
): ReadArtifactResult | null {
	const memoryRoot = getMemoryRoot(agentDir, cwd);
	const sliceLines = (content: string): string => {
		if (!lines) return content;
		const m = lines.match(/^(\d+)-(\d+)$/);
		if (!m) return content;
		const all = content.split("\n");
		return all.slice(Math.max(0, Number(m[1]) - 1), Number(m[2])).join("\n");
	};
	const readFileRef = (file: string, normalizedRef: string): ReadArtifactResult | null => {
		const p = path.join(memoryRoot, file);
		if (!fs.existsSync(p)) return null;
		return { ref: normalizedRef, content: sliceLines(fs.readFileSync(p, "utf8")) };
	};

	if (ref === "summary" || ref === "memory_summary.md") return readFileRef("memory_summary.md", "summary");
	if (ref === "memory" || ref === "MEMORY.md") return readFileRef("MEMORY.md", "memory");
	if (ref === "raw") {
		const rows = withDb(agentDir, db =>
			db
				.prepare(
					`SELECT o.thread_id, o.raw_memory, o.generated_at FROM stage1_outputs o
LEFT JOIN threads t ON t.id = o.thread_id WHERE t.cwd = ? ORDER BY o.generated_at DESC LIMIT 50`,
				)
				.all(cwd),
		) as Array<{ thread_id: string; raw_memory: string; generated_at: number }>;
		const body = rows.map(r => `## stage1:${r.thread_id}\n${r.raw_memory}`).join("\n\n");
		return { ref: "raw", content: sliceLines(body) };
	}
	if (ref.startsWith("stage1:")) {
		const id = ref.slice("stage1:".length);
		const row = withDb(agentDir, db =>
			db.prepare("SELECT raw_memory, rollout_summary FROM stage1_outputs WHERE thread_id = ?").get(id),
		) as { raw_memory: string; rollout_summary: string } | null;
		if (!row) return null;
		return { ref, content: sliceLines(`${row.raw_memory}\n\n---\n${row.rollout_summary}`) };
	}
	if (ref.startsWith("rollout:")) {
		const slug = ref.slice("rollout:".length);
		const row = withDb(agentDir, db =>
			db
				.prepare("SELECT thread_id, raw_memory, rollout_summary FROM stage1_outputs WHERE rollout_slug = ?")
				.get(slug),
		) as { thread_id: string; raw_memory: string; rollout_summary: string } | null;
		if (!row) return null;
		return { ref, content: sliceLines(`${row.raw_memory}\n\n---\n${row.rollout_summary}`) };
	}
	return null;
}

export interface SaveManualResult {
	threadId: string;
	enqueued: boolean;
}

/**
 * Save a manual memory as a stage1 row (`manual:<file>` thread id) and bump
 * the phase2 watermark so consolidation naturally folds it in. Direct
 * INSERT...ON CONFLICT — the job-owned write path is not applicable here.
 */
export function saveLocalMemoryManual(
	agentDir: string,
	cwd: string,
	file: string,
	content: string,
	kind?: LocalMemoryKind,
): SaveManualResult {
	const threadId = `${MANUAL_THREAD_PREFIX}${file}`;
	const nowSec = unixNow();
	const body = kind ? `---\nkind: ${kind}\n---\n${content}` : content;
	const summary = clip(content, 200);
	const slug = `manual-${file
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")}`;
	withDb(agentDir, db => {
		upsertThreads(db, [
			{ id: threadId, updatedAt: nowSec, rolloutPath: threadId, cwd, sourceKind: MANUAL_SOURCE_KIND },
		]);
		db.prepare(
			`INSERT INTO stage1_outputs (thread_id, source_updated_at, raw_memory, rollout_summary, rollout_slug, generated_at)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(thread_id) DO UPDATE SET
	source_updated_at = excluded.source_updated_at,
	raw_memory = excluded.raw_memory,
	rollout_summary = excluded.rollout_summary,
	rollout_slug = excluded.rollout_slug,
	generated_at = excluded.generated_at`,
		).run(threadId, nowSec, body, summary, slug, nowSec);
		enqueueGlobalWatermark(db, nowSec, cwd, { forceDirtyWhenNotAdvanced: true });
	});
	return { threadId, enqueued: true };
}

export interface MemoryContextResult {
	ref: string;
	threadId: string;
	sourceKind: string;
	rolloutPath: string;
	updatedAt: number;
	record: string;
	/** Neighbouring rollout evidence when the source jsonl still exists. */
	rolloutExcerpt?: string;
}

/**
 * Resolve a stage1/manual ref back to its thread row and (when the rollout
 * jsonl still exists) a short excerpt of surrounding evidence.
 */
export function contextLocalMemory(agentDir: string, cwd: string, ref: string): MemoryContextResult | null {
	const threadId = ref.startsWith("stage1:")
		? ref.slice("stage1:".length)
		: ref.startsWith(MANUAL_THREAD_PREFIX)
			? ref
			: null;
	if (!threadId) return null;
	const joined = withDb(agentDir, db =>
		db
			.prepare(
				`SELECT t.id, t.source_kind, t.rollout_path, t.updated_at, o.raw_memory
FROM threads t LEFT JOIN stage1_outputs o ON o.thread_id = t.id
WHERE t.id = ? AND t.cwd = ?`,
			)
			.get(threadId, cwd),
	) as { id: string; source_kind: string; rollout_path: string; updated_at: number; raw_memory: string | null } | null;
	if (!joined) return null;
	const result: MemoryContextResult = {
		ref,
		threadId: joined.id,
		sourceKind: joined.source_kind,
		rolloutPath: joined.rollout_path,
		updatedAt: joined.updated_at,
		record: clip(joined.raw_memory ?? "", SNIPPET_LIMIT),
	};
	if (joined.source_kind !== MANUAL_SOURCE_KIND && joined.rollout_path && fs.existsSync(joined.rollout_path)) {
		try {
			const raw = fs.readFileSync(joined.rollout_path, "utf8");
			const tail = raw.split("\n").filter(Boolean).slice(-12).join("\n");
			result.rolloutExcerpt = tail.length > 2_000 ? `${tail.slice(0, 1_999)}…` : tail;
		} catch {
			// best-effort evidence — the record above is still the answer
		}
	}
	return result;
}

/**
 * Build the per-turn Task Snapshot block body (99.01 M6): top-N hits for the
 * current prompt, diversified (episodes capped at 2, one hit per ref).
 */
export function buildLocalTaskSnapshot(agentDir: string, cwd: string, promptText: string, topN = 4): string | null {
	const hits = searchLocalMemories(agentDir, cwd, promptText, topN * 3);
	if (hits.length === 0) return null;
	const picked: LocalMemoryHit[] = [];
	const seenRefs = new Set<string>();
	let episodes = 0;
	for (const hit of hits) {
		if (picked.length >= topN) break;
		if (seenRefs.has(hit.ref)) continue;
		if (hit.kind === "episode" && episodes >= 2) continue;
		seenRefs.add(hit.ref);
		if (hit.kind === "episode") episodes += 1;
		picked.push(hit);
	}
	if (picked.length === 0) return null;
	return picked.map(h => `- [${h.kind}] ${h.ref}${h.line ? `:${h.line}` : ""} — ${clip(h.snippet, 200)}`).join("\n");
}
