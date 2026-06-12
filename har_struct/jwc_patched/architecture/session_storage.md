# session_storage.md — jwc_patched

> **정본**: `structure/session_storage.md` · side `jwc_patched`

## 1. structure/ 정본 전문

# Session / Storage

> 현재 jwc/GJC storage는 `~/.gjc/agent` 중심이다. D6에 따라 TUI와 cli-jaw Web 세션은 공유하지 않고, 공유 대상은 스킬과 OAuth다.

## 경로 소스

| 함수/상수 | 경로 | 의미 | 근거 |
|---|---|---|---|
| `CONFIG_DIR_NAME` | `.gjc` | config root 기본 이름. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:22` |
| `getConfigDirName()` | `GJC_CONFIG_DIR` 또는 `PI_CONFIG_DIR` 또는 `.gjc` | env override 가능. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:92` |
| `getAgentDir()` | `~/.gjc/agent` | agent config dir. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:216` |
| `getProjectAgentDir(cwd)` | `<cwd>/.gjc` | project-local runtime/config root. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:221` |
| `getAgentDbPath(agentDir?)` | `~/.gjc/agent/agent.db` | settings/auth/model usage SQLite. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:380` |
| `getHistoryDbPath(agentDir?)` | `~/.gjc/agent/history.db` | prompt history SQLite. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:385` |
| `getSessionsDir(agentDir?)` | `~/.gjc/agent/sessions` | session files root. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:395` |
| `getMemoriesDir(agentDir?)` | `~/.gjc/agent/memories` state dir | memory artifacts root. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:430` |

## `agent-storage.ts` (`agent.db`)

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| DB engine | `bun:sqlite` `Database` 사용. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:1` |
| schema version | `SCHEMA_VERSION = 5`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:25` |
| 저장 범위 | settings, model usage, auth credentials 통합 SQLite storage. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:32` |
| auth delegation | `SqliteAuthCredentialStore`가 같은 DB를 사용한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:64` |
| pragmas | WAL, synchronous=NORMAL, busy_timeout=5000. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:80` |
| tables | `model_usage`, `schema_version`, `settings`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:86`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:91`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:100` |

## `auth-storage.ts`

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| 구현 위치 | credential storage types와 `AuthStorage`는 `@gajae-code/ai`에서 재수출된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/auth-storage.ts:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/auth-storage.ts:17` |
| SDK discovery | broker config가 있으면 `RemoteAuthCredentialStore`, 아니면 local SQLite `AuthStorage.create(dbPath)`를 사용한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:409`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:415`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:425` |
| D7 연결 | 기존 로컬 로그인 토큰을 jwc AuthStorage에 시딩하는 결정. | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:16` |

## `history-storage.ts` (`history.db`)

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| DB engine | `bun:sqlite` 사용. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:1` |
| table | `history(id, prompt, created_at, cwd)`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:90` |
| FTS | `history_fts` FTS5 virtual table, `content='history'`, `content_rowid='id'`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:98` |
| insert trigger | `history_ai` trigger가 insert 시 FTS row를 추가한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:100` |
| search query | FTS table join 후 `created_at DESC, id DESC` 정렬. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:120` |
| migration | legacy `unixepoch()` schema면 history/FTS를 재작성하고 rebuild. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:232`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:239`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/history-storage.ts:257` |

## Memories Runtime

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| memory root | `getMemoryRoot(agentDir, cwd) = getMemoriesDir(agentDir) + encoded cwd`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:1111` |
| enable flag | `memory.backend === "local"` 또는 `memories.enabled === true`일 때 enabled. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:1089` |
| stage1 defaults | concurrency 8, lease 120s, retry delay 120s. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:57`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:64` |
| phase2 defaults | lease 180s, retry delay 180s, heartbeat 30s. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:67` |
| startup order | `runMemoryStartup()`은 `runPhase1()` → `runPhase2()` → `refreshBaseSystemPrompt()` 순서. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:202` |
| phase1 | session threads 수집, stage1 jobs claim, model call, `stage1_outputs` 저장. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:214`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:229`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:250`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:311` |
| phase2 | cwd별 global job claim, stage1 outputs sync, consolidation model, artifacts apply. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:346`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:361`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:373`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:430` |

## Memory DB Schema

| Table | 컬럼/역할 | 근거 |
|---|---|---|
| `threads` | thread id, updated_at, rollout_path, cwd, source_kind. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:54` |
| `stage1_outputs` | thread별 raw_memory, rollout_summary, rollout_slug. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:62` |
| `jobs` | kind/job_key/status/worker/lease/retry/watermark. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:71` |
| global job key | phase2는 `global:${cwd}`로 cwd별 격리된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:39` |
| stage1 success | output이 있으면 `stage1_outputs` upsert 후 global watermark enqueue. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:327`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:339` |
| phase2 filter | consolidation input은 `t.cwd = ?`로 현재 cwd에 제한된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:489`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/storage.ts:495` |

## cli-jaw 연동 판단

| 결정 | 현재 코드 상태 | M2 판단 |
|---|---|---|
| TUI/Web 세션 비공유 | GJC has own sessions/history under `~/.gjc/agent`; D6은 cli-jaw Web 세션 정본을 jaw.db로 둔다. | session adapter는 search federation만 후순위로 붙인다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:15`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:18` |
| OAuth 공유 | `AuthStorage` 주입이 SDK에 있다. | local token seeding bridge는 `discoverAuthStorage()` 또는 host-created `AuthStorage`로 들어간다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:225`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:409` |
| memory 통합 | current memory root는 `~/.gjc/agent/memories/<encoded-cwd>`. | 070 밴드에서 jwc memory 폴더 규약을 확정한다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:1111`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:19` |

## 2. har_struct delta (origin vs patched)

| key | gjc_origin | jwc_patched |
|---|---|---|
| CLI | gjc | jwc + gjc |
| interview | deep-interview | jaw-interview |
| global skills | ~/.gjc/agent/skills | ~/.cli-jaw/skills |
| orchestrate | — | 050 WIP |


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 12

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `architecture`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
