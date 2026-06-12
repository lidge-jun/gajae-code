# Jawcode Structure Index

> jawcode(gajae-code 0.4.4 fork)의 코드 지도. 목적은 jwc M1 개발과 cli-jaw M2 임베딩 때 빠르게 근거 파일을 찾는 것이다.

## 읽기 순서

| Tier | 문서 | 한줄 설명 | 근거 |
|---:|---|---|---|
| 1 | [README.md](./README.md) | structure/ 허브와 관련 문서 위치 | `structure/README.md:1` |
| 1 | [doc_map.md](./doc_map.md) | structure · struct_har · omp 삼축 허브 | `structure/doc_map.md:1` |
| 1 | [architecture.md](./architecture.md) | 현재 모노레포 형태와 cli-jaw 임베딩 시임 | `structure/architecture.md:1` |
| 1 | [upstream_lineage.md](./upstream_lineage.md) | omp → gajae-code → jawcode 계보 | `structure/upstream_lineage.md:1` |
| 1 | [conventions.md](./conventions.md) | 포크/리베이스/jawdev/MOC 표기 규약 | `structure/conventions.md:1` |
| 2 | [packages_overview.md](./packages_overview.md) | `packages/*`와 `crates/*` 전체 지도 | `packages/coding-agent/package.json:49` |
| 2 | [sdk_surface.md](./sdk_surface.md) | `jwc/sdk`로 볼 공개 SDK 표면 | `packages/jwc/src/sdk.ts:1`, `packages/coding-agent/src/sdk.ts:217` |
| 2 | [prompt_flow.md](./prompt_flow.md) | 시스템 프롬프트 템플릿, `SYSTEM.md`, append prompt, skills 조립 흐름 | `packages/coding-agent/src/system-prompt.ts:372` |
| 2 | [scroll.md](./scroll.md) | TUI 스크롤/뷰포트 모델 (핀·floor·압축·커밋 폴딩·viewportRepaint 정책·커밋 레인 이중-레인, 260613) | `structure/scroll.md:1` |
| 2 | [workflows.md](./workflows.md) | 기본 워크플로 스킬 4종(jaw-interview/ralplan/ultragoal/team)의 계약 | `packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| 2 | [session_storage.md](./session_storage.md) | `agent.db`, `history.db`, memories runtime, auth storage | `packages/utils/src/dirs.ts:380` |
| 2 | [extensibility.md](./extensibility.md) | skills, slash commands, custom tools, hooks, plugins 확장 표면 | `packages/coding-agent/src/extensibility/skills.ts:107` |
| 2 | [todo_pipeline.md](./todo_pipeline.md) | `todo_write` 세션 상태·리마인더·TUI `todoContainer` (99.30.01) | `packages/coding-agent/src/tools/todo-write.ts` |
| 2 | [memory_pipeline.md](./memory_pipeline.md) | memories startup·주입·검색 갭(99 밴드) | `structure/memory_pipeline.md:1` |
| 2 | [model_patches.md](./model_patches.md) | 모델별 동작 패치 4층 지도 + 신규 프로바이더 플레이북 | `packages/ai/src/providers/composer-discipline.ts:1` |
| 3 | [gitstructure.md](./gitstructure.md) | fork 원격, 표면 리네이밍, 리베이스 가드 | `devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:10` |
| 3 | [fork-delta.md](./fork-delta.md) | HARD-EDIT/NEW/REMOVED 인덱스 | `structure/fork-delta.md:1` |
| 3 | [fork_logic_changelog.md](./fork_logic_changelog.md) | git log 기반 **동작·런타임** 변경 | `structure/fork_logic_changelog.md:1` |
| 2 | [jwc_readiness.md](./jwc_readiness.md) | 99 밴드 레디니스 MLB 50→62→68 · CRITICAL 3 | `99.00.01_audit_jwc_readiness.md` |
| 2 | [m1_closeout.md](./m1_closeout.md) | 99 패키지·D10·re-facing·착수 순서 | `99.00.00_moc` |
| 2 | [beta_v0.1_closeout.md](./beta_v0.1_closeout.md) | beta v0.1 문서·OSS 마감·착수 순서 정본 | `beta_v0.1_closeout.md` |

## 문서 맵

| 문서 | 범위 | 핵심 키워드 |
|---|---|---|
| [packages_overview.md](./packages_overview.md) | Bun workspaces, npm wrapper, jwc wrapper, Rust/N-API crates | packages, crates, dependency direction |
| [sdk_surface.md](./sdk_surface.md) | `CreateAgentSessionOptions`, discovery helpers, `buildSystemPrompt`, `createAgentSession` | jwc/sdk, cli-jaw embedding |
| [prompt_flow.md](./prompt_flow.md) | `system-prompt.md`, `custom-system-prompt.md`, `SYSTEM.md`, `APPEND_SYSTEM.md`, prompt dirs | prompt injection |
| [workflows.md](./workflows.md) | bundled default skills, artifact dirs, approval gates | jaw-interview, ralplan, ultragoal, team |
| [session_storage.md](./session_storage.md) | SQLite stores, FTS, auth, memory consolidation | agent.db, history_fts, memories |
| [extensibility.md](./extensibility.md) | capability API, skills, commands, tools, hooks, plugins | extension surface |
| [scroll.md](./scroll.md) | TUI 스크롤/뷰포트 모델 — 핀·floor·sticky gap·viewportRepaint 정책·커밋 레인 이중-레인·fill=history-region·3J 금지 | scroll, viewport, commit-fold, commit-lane, compaction |
| [memory_pipeline.md](./memory_pipeline.md) | jwc memory vs cli-jaw FTS/BM25 | memory, local-query |
| [todo_pipeline.md](./todo_pipeline.md) | `todo_write`, phases, stop 리마인더, composer 패널 | 99.30, interactive-mode |
| [model_patches.md](./model_patches.md) | 카탈로그 compat·요청 변환기·discipline 주입·호스트 방어 | composer, compat, discipline |
| [fork_logic_changelog.md](./fork_logic_changelog.md) | orchestrate, interview, β migration, TUI, auth | logic, commits |
| [jwc_readiness.md](./jwc_readiness.md) | MLB 50→62→68, CRITICAL 3, pabcd discovery | readiness, M1 close |
| [m1_closeout.md](./m1_closeout.md) | 99 패키지·99.03 M1/M2/M3·착수 순서 | M1 close, 99 band |
| [beta_v0.1_closeout.md](./beta_v0.1_closeout.md) | beta v0.1 문서·OSS·CONTRIBUTING.jwc | beta closeout |
| [gitstructure.md](./gitstructure.md) | upstream remote, package namespace, `.jwc/` runtime paths | fork ops |

## 최신 결정 연결

| 결정 | 요약 | 문서 반영 위치 | 근거 |
|---|---|---|---|
| D1 | jwc 런타임 코어를 분리해 cli-jaw 서버가 직접 품음 | [sdk_surface.md](./sdk_surface.md), [packages_overview.md](./packages_overview.md) | `devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:10` |
| D4 | 공개 표면은 `jwc`/`.jwc/`; 내부 패키지 스코프 `@gajae-code/*`는 보존 | [gitstructure.md](./gitstructure.md) | `devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:13` |
| D5 | 스킬 정본 목표는 `~/.cli-jaw/skills` 우선 | [extensibility.md](./extensibility.md) | `devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:14` |
| D6 | TUI/Web 세션 비공유, 스킬+OAuth 공유 | [session_storage.md](./session_storage.md) | `devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:15` |
| D8 | M2는 Node 포팅 상주 방식 | [packages_overview.md](./packages_overview.md) | `devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:17` |
| 99.03 | pabcd discovery + re-facing M1/M2/M3 | [m1_closeout.md](./m1_closeout.md), [workflows.md](./workflows.md), [prompt_flow.md](./prompt_flow.md) | `99.03.01` PASS v2 |
| 99.02 | CI schemas·biome·docs 마감 | [m1_closeout.md](./m1_closeout.md) | `99.02.00` |
| 99 착수 | 99.01→99.02→99.03→… | [m1_closeout.md](./m1_closeout.md), [beta_v0.1_closeout.md](./beta_v0.1_closeout.md) | `99.00.00` |

**포크 델타 인덱스**: [fork-delta.md](./fork-delta.md) — 업스트림 이탈 파일 전수·체리픽 지침 (커밋 동행 갱신 필수).

## struct_har (양쪽 스냅샷)

| 경로 | 역할 |
|---|---|
| [struct_har/README.md](../struct_har/README.md) | `gjc_origin` ↔ `jwc_patched` + `omp_origin`; **전수 재생성 2026-06-13** |
| `struct_har/gjc_origin/` | upstream 클론 @ HEAD code facts |
| `struct_har/jwc_patched/` | 포크 worktree code facts |
| `struct_har/omp_origin/` | oh-my-pi 참조축 (gajae-code 상류) |

밴드 완료·upstream fetch 시 [conventions.md §2.2](./conventions.md) 동기화 표를 따른다.

## 동기화 규칙

| 변경 종류 | 같이 갱신할 문서 | 근거 |
|---|---|---|
| 포크 델타 파일 변경 (HARD-EDIT/NEW/REMOVED/INVERTED-GUARD) | `fork-delta.md` | `devlog/_plan/260612_jawcode_fork/phase1/067.1_plan_structure_fork_delta.md` |
| 패키지 추가/삭제, `package.json` bin/export 변경 | `INDEX.md`, `packages_overview.md`, `gitstructure.md` | `packages/jwc/package.json:7` |
| `packages/coding-agent/src/sdk.ts` 공개 API 변경 | `sdk_surface.md`, `prompt_flow.md`, `session_storage.md` | `packages/coding-agent/src/sdk.ts:217` |
| 시스템 프롬프트/스킬 렌더 변경 | `prompt_flow.md`, `workflows.md`, `extensibility.md` | `packages/coding-agent/src/system-prompt.ts:441` |
| default workflow skill 변경 | `workflows.md`, `gitstructure.md`, `conventions.md` | `packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| storage schema 변경 | `session_storage.md`, `sdk_surface.md` | `packages/coding-agent/src/session/agent-storage.ts:25` |
| **`devlog/_upstream_gjc` fetch/pull** | `struct_har/gjc_origin/**`, `struct_har/README.md`, `gitstructure.md` | `structure/conventions.md` §2.2 |
| **포크 밴드 완료** (patched) | `structure/*`, `struct_har/jwc_patched/**` | `struct_har/README.md` |
| **`devlog/_upstream_omp` fetch** | `struct_har/omp_origin/**`, `upstream_lineage.md` | `struct_har/omp_origin/README.md` |
| **99 밴드·레디니스·MOC 상태** | `jwc_readiness.md`, `m1_closeout.md`, `beta_v0.1_closeout.md`, `struct_har/jwc_patched/099_stabilization/**`, `workflows.md`, `prompt_flow.md` | `99.00.00_moc_stabilization.md` |
| **99.30 todo UX** | `todo_pipeline.md`, `struct_har/jwc_patched/080_tui/`, `99.30.01` | `99.30.00_moc` |
| **TUI 스크롤·렌더 경로 변경** (viewportRepaint, fullRender, commitLines, compactViewportFill 트리거) | `scroll.md` | `packages/tui/src/tui.ts`, `packages/tui/src/insert-history.ts`, `packages/coding-agent/src/modes/controllers/{event,input}-controller.ts` |

### upstream 참조 + pull 개발 (요약)

- **SoT**: `structure/` = jawcode patched 현재 형태.
- **Baseline**: `devlog/_upstream_gjc/` = gitignored upstream 클론 — fetch 후 diff·file:line cite.
- **대조**: `struct_har/` = `gjc_origin` ↔ `jwc_patched` 병렬 스냅샷.
- **worktree**: `git fetch upstream && git rebase upstream/main` — 클론 pull과 같은 창구에서 실행 ([conventions.md §2](./conventions.md)).

*마지막 갱신: 2026-06-13. worktree HEAD `81bcea96`, upstream 클론 `devlog/_upstream_gjc` @ `67427c6`, 대조 트리 `struct_har/` (구 `har_struct/` 리네임).*