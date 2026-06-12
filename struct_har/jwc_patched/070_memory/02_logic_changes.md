# 070_memory — 02 logic changes (jwc_patched)

> jwc_patched: fork **실제 로직**. git `upstream/main..HEAD` + [fork_logic_changelog.md](../../../structure/fork_logic_changelog.md).
> worktree @ `81bcea96`.

## jwc 현재

- stage1→phase2; `memory_summary.md` 주입; **`local-query.ts` + `memory-fts`** (FTS5/LIKE, search/read/save/context/browse).
- `memory-runtime.ts` + `commands/memory.ts`·`chat.ts` — jaw 브랜드 CLI 표면.

## 99.01 (🟡 구현 중 — [99.01.03](../../../devlog/_plan/260612_jawcode_fork/99.01.03_impl_memory_merge.md))

`memory-runtime.ts`, `commands/memory.ts`, `local-query.ts` — search/read/save/context, `chat search`.

[memory_pipeline.md](../../../structure/memory_pipeline.md) · [99.01.00](../../../devlog/_plan/260612_jawcode_fork/99.01.00_moc_memory.md)
## 정본

- 횡단: [structure/fork_logic_changelog.md](../../../structure/fork_logic_changelog.md)
- 파일 단위: [structure/fork-delta.md](../../../structure/fork-delta.md)
- 앵커 경로: [02_code_facts.md](./02_code_facts.md)

