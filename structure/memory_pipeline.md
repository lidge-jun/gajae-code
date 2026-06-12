# Memory Pipeline

> jwc(gjc 엔진) 메모리 서브시스템의 쓰기/읽기 경로와, 99.01 밴드(`jwc memory` 동사 표면)가 얹힐 접합점.
> cli-jaw 원본 메모리의 대조 요약 포함. 실측: 260612 병렬 조사 (devlog [99.01.00](../devlog/_plan/260612_jawcode_fork/99.01.00_moc_memory.md) 밴드 근거).

## 쓰기 경로 (자동 — startup 트리거 단일)

```text
세션 부팅 (sdk.ts:2078 resolveMemoryBackend(settings).start)
  -> startMemoryStartupTask (memories/index.ts:120)         [게이트: enabled && taskDepth==0]
     -> Phase 1: runPhase1 (index.ts:214)
        collectThreads(세션 *.jsonl 스캔) -> upsertThreads -> claimStage1Jobs(원자 클레임)
        -> 모델 호출(stage1 추출) -> stage1_outputs upsert + enqueueGlobalWatermark
        [대상: idle ≥12h, ≤30d, source_kind cli|app, 현재 스레드 제외]
     -> Phase 2: runPhase2 (index.ts:346)                    [per-cwd "global:<cwd>" 잡, watermark dirty 시]
        listStage1OutputsForGlobal -> consolidation 모델 호출
        -> MEMORY.md / memory_summary.md / skills/ 산출 (artifacts)
     -> session.refreshBaseSystemPrompt() (index.ts:211)
```

- **트리거는 startup뿐** — 타이머/세션 종료 훅/토큰 임계 없음. `/memory enqueue`가 `forceDirtyWhenNotAdvanced`로 강제 dirty.
- 저장소: `agent.db` (settings와 동일 DB) — `threads` / `stage1_outputs` / `jobs` 3테이블. 아티팩트는
  `<agentDir>/memories/state/--<cwd-encoded>--/` (`dirs.ts:434 getMemoriesDir`).
- manual save 계약(99.01 D3): `thread_id = "manual:<file>"` 행 + `threads.source_kind="manual"` —
  `claimStage1Jobs`가 cli|app만 클레임하므로 stage1 추론을 자연 우회, phase2에는 cwd 조인으로 합류.

## 읽기 경로 (주입)

```text
sdk.ts:1570 buildDeveloperInstructions
  -> buildMemoryToolDeveloperInstructions (memories/index.ts:150)
     -> memory_summary.md 읽기 -> truncateByApproxTokens(5000) -> read-path 템플릿 렌더
  -> appendSystemPrompt (sdk.ts:1603, base system prompt 마지막 세그먼트)
```

- 리프레시 시점: 세션 부팅 풀 리빌드 + `refreshBaseSystemPrompt()` 호출처(startup 완료 후, `/memory clear`, `/memory enqueue`).
- **검색/조회**: `memories/local-query.ts` + `memory-fts.ts` (FTS5/LIKE, synonym expansion) — `jwc memory *`, per-turn Task Snapshot (`buildLocalTaskSnapshot`). 밴드 **99.01** 마감·테스트·cli-jaw BM25/RRF 후속.

## 99.01 접합점 (신규 코드 vs 재사용)

| 동사 | 신규 코드 | 재사용 배관 |
|------|----------|------------|
| `memory search` | `memories/local-query.ts` `searchLocalMemories` — LIKE + kind 가중 + recency | `openMemoryDb`, `getMemoryRoot`, `listStage1OutputsForGlobal` |
| `memory read` | ref 어휘 디스패치 (summary/memory/raw/stage1:/rollout:) | 동일 |
| `memory save` | manual stage1_outputs 직접 SQL (`markStage1SucceededWithOutput`은 잡 토큰 필요라 부적합) | `upsertThreads`, `enqueueGlobalWatermark`, `refreshBaseSystemPrompt` |
| `memory context` | 현 주입 페이로드 + rollout 역참조 | `buildMemoryToolDeveloperInstructions` |
| `chat search` | 세션 jsonl 본문 grep (기존엔 헤더 1줄만 읽음) | `getSessionsDir`, `collectThreads` 포맷 |
| 라우터/CLI | `gjc-runtime/memory-runtime.ts` + `commands/memory.ts`·`chat.ts` (state.ts 패턴) | `cli.ts` jawOnlyCommands 등록 |

## cli-jaw 원본 대조 (parity reference)

| 축 | cli-jaw | jwc 1차 결정 |
|----|---------|--------------|
| 저장 | `JAW_HOME/memory/structured/` markdown + frontmatter(kind/source/trust) | gjc SQLite 엔진 그대로 (md 호환 레이어 없음 — 070 확정 1) |
| 색인 | `index.sqlite` FTS5 2종 — `chunks_fts`(unicode61) + `chunks_trigram`(trigram, CJK 전담) + `memory_synonyms` | 1차 SQL LIKE (FTS5/RRF/CJK trigram 후속 — 070 확정 4) |
| 랭킹 | BM25 + trigram RRF 융합(k=60) + kind 우선치(profile -4.0 … episode 0) + recency 반감기(episode 7d/semantic 30d/shared 90d) + 정확일치 보너스 | kind 우선치 + recency 2요소만 |
| 주입 | 매 턴 `buildMemoryInjection` — Profile(800c) + Soul(1000c) + Task Snapshot(검색 4건/2800c, kind 다양화 캡) | summary 1파일 (Task Snapshot은 99.01 M6) |
| 쓰기 파이프라인 | flush(서브에이전트가 episodes/live에 기록, 10메시지마다) + reflect(24h 스로틀 regex 분류) | 비이식 (gjc stage1/phase2 유지 — 070 확정 7) |
| chat search | `jaw.db` messages LIKE (FTS 없음, 활성 세션 한정) | 세션 jsonl grep — 세션 횡단이라 오히려 넓음 |

**degradation 핵심 (1차 LIKE 채택 시 잃는 것)**: CJK trigram 매칭, BM25 관련도, 동의어 확장
(`pabcd ↔ plan/audit/build/check/done` 시드 포함), RRF 융합. 후속 FTS5 도입 시 trigram tokenizer는
SQLite 3.38+ 필요. recency 부스트는 파일명 `YYYY-MM-DD` 규약 의존 — jwc는 generated_at 컬럼으로 대체 가능.

## 관련 문서

- 설계/스키마: `devlog/_plan/260612_jawcode_fork/99.01.01_design_memory_merge.md`, `99.01.02_schema_cli_jaw_memory.md`
- 주입 레일 전반: [prompt_flow.md](./prompt_flow.md) §매 턴 주입 레일
