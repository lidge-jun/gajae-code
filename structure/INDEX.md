# Jawcode Structure Index

> jawcode(gajae-code 0.4.4 fork)의 코드 지도 **단일 허브**. jwc M1 개발·cli-jaw M2 임베딩 때 근거
> 파일을 빠르게 찾는 진입점. 여기서 시작하세요.
> worktree HEAD `81bcea96` · upstream 클론 `devlog/_upstream_gjc` @ `67427c6` (갱신 시 cite).

## 삼축 정본 (어디가 정본인가)

| 축 | 경로 | 역할 |
|---|---|---|
| **Patched SoT** | `structure/` (본 트리) | jawcode **현재** 계약·아키텍처·포크 규칙 |
| **양축 대조** | [struct_har/](../struct_har/README.md) | `gjc_origin` ↔ `jwc_patched` 밴드별 code facts |
| **OMP 참조** | [struct_har/omp_origin/](../struct_har/omp_origin/README.md) | oh-my-pi(상류) 13 밴드 — fork diff 아님 |

업스트림 클론(gitignored): `devlog/_upstream_gjc/` @ `67427c6` (gajae-code) · `devlog/_upstream_omp/` @ `e13ad3805` (oh-my-pi).
cite 규칙: gjc_origin=`devlog/_upstream_gjc/<path>:<line>` · jwc_patched=`700_projects/jawcode/<path>:<line>` · omp_origin=`devlog/_upstream_omp/<path>:<line>`.

## 읽기 순서 (티어)

| Tier | 문서 | 핵심 |
|:--:|---|---|
| **1 — 기반** | [architecture.md](./architecture.md) · [packages_overview.md](./packages_overview.md) · [conventions.md](./conventions.md) | 모노레포 형태·cli-jaw 시임 / `packages/*`·`crates/*` 지도 / 포크·리베이스·MOC 규약 |
| **2 — 코어 흐름** | [prompt_flow.md](./prompt_flow.md) · [sdk_surface.md](./sdk_surface.md) · [workflows.md](./workflows.md) · [session_storage.md](./session_storage.md) | 시스템 프롬프트 조립 / `jwc/sdk`·`createAgentSession` / 번들 스킬 4종 / SQLite·auth·memory store |
| **3 — 서브시스템** | [codex_transport.md](./codex_transport.md) · [model_patches.md](./model_patches.md) · [search.md](./search.md) · [memory_pipeline.md](./memory_pipeline.md) · [todo_pipeline.md](./todo_pipeline.md) · [extensibility.md](./extensibility.md) · [scroll.md](./scroll.md) | Codex 전송·진단 / 모델 패치 4층 / 검색 프로바이더 / 메모리 / todo UX / 확장 표면 / TUI 스크롤·렌더 |
| **4 — 포크 추적** | [fork-delta.md](./fork-delta.md) · [fork_logic_changelog.md](./fork_logic_changelog.md) · [gitstructure.md](./gitstructure.md) | 이탈 파일 인덱스(체리픽) / 동작·런타임 변경+계보 / fork 운영·리베이스 가드 |
| **5 — 상태** | [status.md](./status.md) | M1/M2 마감 · 99 밴드 · readiness(MLB) · 착수 순서 (구 beta/m1/readiness 통합) |

## 문서별 키워드

| 문서 | 키워드 |
|---|---|
| [architecture.md](./architecture.md) | 모노레포, cli-jaw 임베딩 시임 |
| [packages_overview.md](./packages_overview.md) | packages, crates, 의존 방향 |
| [sdk_surface.md](./sdk_surface.md) | jwc/sdk, createAgentSession, buildSystemPrompt |
| [prompt_flow.md](./prompt_flow.md) | system-prompt.md, append, skills 조립 |
| [workflows.md](./workflows.md) | jaw-interview, ralplan, ultragoal, team |
| [session_storage.md](./session_storage.md) | agent.db, history_fts, memories, auth |
| [extensibility.md](./extensibility.md) | skills, slash, custom-tools, hooks, plugins |
| [scroll.md](./scroll.md) | viewport, commit-fold, commit-lane, compaction |
| [memory_pipeline.md](./memory_pipeline.md) | memory, local-query, BM25 |
| [todo_pipeline.md](./todo_pipeline.md) | todo_write, phases, composer 패널 (99.30) |
| [model_patches.md](./model_patches.md) | composer, compat, discipline, 호스트 방어 |
| [search.md](./search.md) | searchengine, provider, oauth, auto, xAI |
| [codex_transport.md](./codex_transport.md) | websocket, prewarm, watchdog, rate-limit, fast 진단 |
| [fork-delta.md](./fork-delta.md) | HARD-EDIT/NEW/REMOVED, 체리픽 |
| [fork_logic_changelog.md](./fork_logic_changelog.md) | logic, commits, 계보(omp→gjc→jwc) |
| [gitstructure.md](./gitstructure.md) | upstream remote, `.jwc/` 경로, 리베이스 |
| [status.md](./status.md) | MLB readiness, 99 밴드, 100 Node, 착수 순서 |

## 최신 결정 연결

| 결정 | 요약 | 반영 |
|---|---|---|
| D1 | jwc 런타임 코어 분리 → cli-jaw 직접 임베딩 | [sdk_surface.md](./sdk_surface.md), [packages_overview.md](./packages_overview.md) |
| D4 | 공개 표면 `jwc`/`.jwc/`; 내부 `@gajae-code/*` 보존 | [gitstructure.md](./gitstructure.md) |
| D5 | 스킬 정본 `~/.cli-jaw/skills` 우선 | [extensibility.md](./extensibility.md) |
| D6 | TUI/Web 세션 비공유, 스킬+OAuth 공유 | [session_storage.md](./session_storage.md) |
| D8 | M2 = Node 포팅 상주 | [packages_overview.md](./packages_overview.md) |
| 99.03 | pabcd discovery + re-facing M1/M2/M3 | [status.md](./status.md), [prompt_flow.md](./prompt_flow.md) |
| 99 착수 | 99.01→…→99.07 (62 임계 = 99.02+99.03) | [status.md](./status.md) |

**포크 델타 인덱스**: [fork-delta.md](./fork-delta.md) — 이탈 파일 전수·체리픽(커밋 동행 갱신 필수).

## 동기화 규칙

| 변경 | 같이 갱신 |
|---|---|
| 포크 델타 파일(HARD-EDIT/NEW/REMOVED/INVERTED-GUARD) | `fork-delta.md` |
| 패키지/`package.json` bin·export | `INDEX.md`, `packages_overview.md`, `gitstructure.md` |
| `coding-agent/src/sdk.ts` 공개 API | `sdk_surface.md`, `prompt_flow.md`, `session_storage.md` |
| 시스템 프롬프트/스킬 렌더 | `prompt_flow.md`, `workflows.md`, `extensibility.md` |
| storage schema | `session_storage.md`, `sdk_surface.md` |
| `_upstream_gjc` fetch/rebase | `struct_har/gjc_origin/**`, `struct_har/README.md`, `gitstructure.md` |
| `_upstream_omp` fetch | `struct_har/omp_origin/**`, `fork_logic_changelog.md`(계보 절) |
| 포크 밴드 완료 | `structure/*`, `struct_har/jwc_patched/**` |
| 99 밴드·readiness·MOC | `status.md`, `struct_har/jwc_patched/099_stabilization/**`, `workflows.md`, `prompt_flow.md` |
| 99.30 todo UX | `todo_pipeline.md`, `struct_har/jwc_patched/080_tui/` |
| TUI 스크롤·렌더 경로 | `scroll.md` |
| Codex 전송·fast 진단 | `codex_transport.md` (devlog: `_fin/000000_reformation`) |

## struct_har 재생성

upstream/worktree HEAD 갱신 후:

```bash
bun struct_har/_scripts/struct-har-regenerate.ts
bun struct_har/_scripts/struct-har-regenerate-logic.ts
bun struct_har/_scripts/struct-har-regenerate-architecture.ts
bun struct_har/_scripts/struct-har-regenerate-overviews.ts
bun struct_har/_scripts/struct-har-regenerate-omp.ts
```

그다음 `struct_har/README.md`·`INDEX.md`·`structure/gitstructure.md`에 HEAD 기록.

*마지막 갱신: 2026-06-13. 구 `README.md`(허브)·`doc_map.md`(삼축)·`upstream_lineage.md`(계보)·
`beta_v0.1_closeout.md`·`m1_closeout.md`·`jwc_readiness.md`(→`status.md`)를 본 INDEX·`status.md`·
`fork_logic_changelog.md`로 통합. cli-jaw structure 모델(티어 허브) 정렬.*
