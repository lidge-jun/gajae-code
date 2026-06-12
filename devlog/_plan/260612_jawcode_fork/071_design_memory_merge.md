# 071 — 설계: jwc memory 어댑터 (070 구체화, memories 엔진 실사 기반)

> 상위: [070_moc_memory.md](./070_moc_memory.md). 실사: Docs 직원 (260612 11:40, read-only).
> 방향 [확정]: 엔진 = gjc memories 그대로, 표면 = `jwc memory search/read/save/context` (cli-jaw 어휘, D10).
> ⚠️ 경로 정정: 070 MOC의 `utils/dirs.ts:431` → 정확히는 **`packages/utils/src/dirs.ts:434`** (`getMemoriesDir`).

## 1. 엔진 사실 — 핵심 발견

**local memories는 "검색 가능한 메모리 DB"가 아니라 "자동 요약 파이프라인"이다.**

- 활성 조건: `memory.backend === "local"` 또는 legacy `memories.enabled` (`memories/index.ts:120-129`); subagent/세션파일 없음/DB 실패 시 스킵(`:130-140`)
- **stage1**: 과거 세션 rollout jsonl → 모델 추출 `{raw_memory, rollout_summary, slug}` → `stage1_outputs` upsert (`index.ts:214-260, 576-656`; claim 조건 `storage.ts:136-245` — `source_kind cli|app`만, idle 12h+, 30일 이내, 최대 64건)
- **phase2**: cwd별 워터마크 잡(`storage.ts:389-472`) → consolidation 모델 → **`MEMORY.md` + `memory_summary.md` + `skills/` 재생성**(`index.ts:720-848`)
- **read-path**: `memory_summary.md`를 5000토큰 한도로 잘라 developer instructions로 매 프롬프트 리빌드에 주입 (`index.ts:150-175`, `sdk.ts:1570`, `memory-backend/types.ts:38-46`)
- **SQLite 스키마 3테이블뿐**: `threads` / `stage1_outputs` / `jobs` (`storage.ts:47-88`) — **FTS 없음, 임베딩 없음, 검색 인덱스 없음**
- backend 공통 인터페이스(`memory-backend/types.ts:26-78`): `start/buildDeveloperInstructions/clear/enqueue(+optional beforeAgentStartPrompt/preCompactionContext)` — **search/read/save 동사가 인터페이스에 없음**
- hindsight(원격 백엔드)에는 있음: `recall/retain/retainBatch/reflect/listMemories/getDocument…` (`hindsight/client.ts:228-389`)

## 2. 동사 → API 매핑 (gap 표)

| jwc 동사 | local 매핑 | hindsight 매핑 | 판정 |
|----------|-----------|----------------|------|
| `memory context` | `buildDeveloperInstructions()` 결과 표시 | 동일 인터페이스 | **표면만 신규** — 가장 쉬움 |
| `memory search <kw>` | **신규** `searchLocalMemories()` — `stage1_outputs.raw_memory/rollout_summary` LIKE + 생성 artifact(MEMORY.md 등) 텍스트 스캔 | `recall(q)`/`listMemories(q)` | local 신규 필요 |
| `memory read <ref>` | **신규** `readLocalMemoryArtifact()` — ref 어휘 `summary|memory|raw|stage1:<thread_id>|rollout:<slug>` (+cli-jaw 호환: 파일명이 오면 artifact basename으로 resolve) | `getDocument(id)` | **시맨틱 재설계** — gjc는 파일이 아니라 레코드/생성물 단위 |
| `memory save <file> <content>` | **신규** `saveLocalMemoryManual()` — `threads`에 `source_kind:"manual"` + `stage1_outputs`에 `thread_id: manual:<file>` upsert → `enqueueGlobalWatermark()` → phase2가 자연 통합. ⚠️ 현 스키마에 manual 계약 없음 — `claimStage1Jobs`는 manual을 건드리지 않고(`cli|app` 필터), `listStage1OutputsForGlobal`은 cwd만 보므로 **phase2 합류는 가능** | `retain(content, {documentId: file})` | local 신규 필요 |

## 3. 구현 골격 (050/061 패턴 동형)

```
packages/coding-agent/src/commands/memory.ts            # jaw 전용 thin wrapper
packages/coding-agent/src/gjc-runtime/memory-runtime.ts   # 동사 라우팅 — backend id별 분기(off/local/hindsight)
packages/coding-agent/test/gjc-runtime/memory-runtime.test.ts
```

- `cli.ts` `jawOnlyCommands`에 `{ name: "memory" }` 추가 (D050-24 게이트 재사용)
- 신규 local 함수 3종은 `memories/` 모듈에 (스키마 소유자 곁): `searchLocalMemories / readLocalMemoryArtifact / saveLocalMemoryManual`
- save 직후 가시성: local backend는 `beforeAgentStartPrompt` 미구현이라 다음 prompt rebuild까지 반영 지연 — save 성공 메시지에 명시 또는 `refreshBaseSystemPrompt()` 강제 호출(엔진이 startup 완료 시 쓰는 함수, `index.ts:202-211`)

## 4. 완료 기준 (070 MOC 이월 + 구체화)

- 세션 간 기억 e2e: 세션 A에서 `memory save` → phase2 통합 → 세션 B `memory search`/`context`로 회수
- `search/read/save/context` 4동사 단위 테스트 + manual row가 phase2에 합류하는 통합 테스트
- gjc 브랜드: `memory` 명령 미등록(diff-0), 기존 `/memory` slash 무회귀
- 메모리 규약 문서(위치 `~/.gjc/agent/memories/state`·포맷·ref 어휘·확장법)

## 5. [열린 질문]

**기존(070 MOC) 유지**: ① cli-jaw `structured/` md 호환 레이어 ② `~/.jwc/` 홈 분리 (D4상 비분리 권장)

**실사로 신규 발견**:
3. `search/read/save`를 `MemoryBackend` 공통 인터페이스로 승격 vs `memory-runtime` 전용 헬퍼 — [기본값 제안: 헬퍼 먼저, 인터페이스 승격은 hindsight 대칭 구현 시]
4. manual 저장: `stage1_outputs` 재사용(`manual:<file>` row) vs 별도 `manual_memories` 테이블 — [기본값 제안: 재사용, 스키마 무변경]
5. local search: SQL LIKE+artifact grep vs FTS5 추가 — [기본값 제안: LIKE 먼저, FTS5는 후속]
6. 기존 `/memory view|clear|enqueue|rebuild|mm` slash와 신규 동사 통합 vs CLI 전용 선행 — [기본값 제안: CLI 선행, slash 통합은 별도]
7. save 후 즉시 반영(prompt refresh 강제) 여부 — [기본값 제안: refreshBaseSystemPrompt 호출]

## 6. 착수 순서 제안

1. `memory context`(기존 API 노출만) → 2. `search`(LIKE) → 3. `read`(ref 어휘) → 4. `save`(manual row+enqueue) → 5. e2e. 각 단계가 독립 커밋 가능.
