# Jawcode Structure Index

> jawcode(gajae-code 0.4.4 fork)의 코드 지도. 목적은 jwc M1 개발과 cli-jaw M2 임베딩 때 빠르게 근거 파일을 찾는 것이다.

## 읽기 순서

| Tier | 문서 | 한줄 설명 | 근거 |
|---:|---|---|---|
| 1 | [README.md](./README.md) | structure/ 허브와 관련 문서 위치 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/README.md:1` |
| 1 | [architecture.md](./architecture.md) | 현재 모노레포 형태와 cli-jaw 임베딩 시임 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/architecture.md:1` |
| 1 | [conventions.md](./conventions.md) | 포크/리베이스/jawdev/MOC 표기 규약 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/conventions.md:1` |
| 2 | [packages_overview.md](./packages_overview.md) | `packages/*`와 `crates/*` 전체 지도 | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/package.json:49` |
| 2 | [sdk_surface.md](./sdk_surface.md) | `jwc/sdk`로 볼 공개 SDK 표면 | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217` |
| 2 | [prompt_flow.md](./prompt_flow.md) | 시스템 프롬프트 템플릿, `SYSTEM.md`, append prompt, skills 조립 흐름 | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:372` |
| 2 | [workflows.md](./workflows.md) | 기본 워크플로 스킬 4종(deep-interview/ralplan/ultragoal/team)의 계약 | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:5` |
| 2 | [session_storage.md](./session_storage.md) | `agent.db`, `history.db`, memories runtime, auth storage | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:380` |
| 2 | [extensibility.md](./extensibility.md) | skills, slash commands, custom tools, hooks, plugins 확장 표면 | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:105` |
| 3 | [gitstructure.md](./gitstructure.md) | fork 원격, 표면 리네이밍, 리베이스 가드 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:10` |

## 문서 맵

| 문서 | 범위 | 핵심 키워드 |
|---|---|---|
| [packages_overview.md](./packages_overview.md) | Bun workspaces, npm wrapper, jwc wrapper, Rust/N-API crates | packages, crates, dependency direction |
| [sdk_surface.md](./sdk_surface.md) | `CreateAgentSessionOptions`, discovery helpers, `buildSystemPrompt`, `createAgentSession` | jwc/sdk, cli-jaw embedding |
| [prompt_flow.md](./prompt_flow.md) | `system-prompt.md`, `custom-system-prompt.md`, `SYSTEM.md`, `APPEND_SYSTEM.md`, prompt dirs | prompt injection |
| [workflows.md](./workflows.md) | bundled default skills, artifact dirs, approval gates | deep-interview, ralplan, ultragoal, team |
| [session_storage.md](./session_storage.md) | SQLite stores, FTS, auth, memory consolidation | agent.db, history_fts, memories |
| [extensibility.md](./extensibility.md) | capability API, skills, commands, tools, hooks, plugins | extension surface |
| [gitstructure.md](./gitstructure.md) | upstream remote, package namespace, `.gjc/` preservation | fork ops |

## 최신 결정 연결

| 결정 | 요약 | 문서 반영 위치 | 근거 |
|---|---|---|---|
| D1 | jwc 런타임 코어를 분리해 cli-jaw 서버가 직접 품음 | [sdk_surface.md](./sdk_surface.md), [packages_overview.md](./packages_overview.md) | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:10` |
| D4 | 표면 리네이밍만: `jwc`, `.gjc/`, `@gajae-code/*` 유지 | [gitstructure.md](./gitstructure.md) | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:13` |
| D5 | 스킬 정본 목표는 `~/.cli-jaw/skills` 우선 | [extensibility.md](./extensibility.md) | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:14` |
| D6 | TUI/Web 세션 비공유, 스킬+OAuth 공유 | [session_storage.md](./session_storage.md) | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:15` |
| D8 | M2는 Node 포팅 상주 방식 | [packages_overview.md](./packages_overview.md) | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:17` |

## 동기화 규칙

| 변경 종류 | 같이 갱신할 문서 | 근거 |
|---|---|---|
| 패키지 추가/삭제, `package.json` bin/export 변경 | `INDEX.md`, `packages_overview.md`, `gitstructure.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:7` |
| `packages/coding-agent/src/sdk.ts` 공개 API 변경 | `sdk_surface.md`, `prompt_flow.md`, `session_storage.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217` |
| 시스템 프롬프트/스킬 렌더 변경 | `prompt_flow.md`, `workflows.md`, `extensibility.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:441` |
| default workflow skill 변경 | `workflows.md`, `gitstructure.md`, `conventions.md` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:5` |
| storage schema 변경 | `session_storage.md`, `sdk_surface.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/session/agent-storage.ts:25` |

*마지막 갱신: 2026-06-12. 기준 HEAD `498d86b`, upstream remote `https://github.com/Yeachan-Heo/gajae-code`.*
