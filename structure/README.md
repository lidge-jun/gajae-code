# devlog/_reference/structure/ — Jawcode Source of Truth

> Jawcode = gajae-code(gjc) 0.4.4 fork. cli-jaw의 메인 네이티브 런타임이 되는 것이 목표다.
> 업스트림 remote는 `upstream = https://github.com/Yeachan-Heo/gajae-code`이고 현재 HEAD는 `498d86b`다.

## 시작점

| 문서 | 내용 | 근거 |
|------|------|------|
| [INDEX.md](./INDEX.md) | 전체 문서 인덱스와 읽기 순서 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/INDEX.md:1` |
| [architecture.md](./architecture.md) | 현재 시스템 형태와 cli-jaw 통합 시임 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/architecture.md:1` |
| [packages_overview.md](./packages_overview.md) | `packages/*`, `crates/*` 전체 지도 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/packages_overview.md:1` |
| [sdk_surface.md](./sdk_surface.md) | `jwc/sdk` 공개 표면과 `createAgentSession()` 계약 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/sdk_surface.md:1` |
| [prompt_flow.md](./prompt_flow.md) | 시스템 프롬프트 조립 흐름 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/prompt_flow.md:1` |
| [workflows.md](./workflows.md) | default workflow skill 4종 계약 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/workflows.md:1` |
| [session_storage.md](./session_storage.md) | SQLite/session/history/auth/memory storage | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/session_storage.md:1` |
| [extensibility.md](./extensibility.md) | skills/slash/custom-tools/hooks/plugins 확장 표면 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/extensibility.md:1` |
| [gitstructure.md](./gitstructure.md) | fork 운영, 표면 리네이밍, 리베이스 가드 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/gitstructure.md:1` |
| [conventions.md](./conventions.md) | 포크 규칙, 업스트림 동기화, devlog/MOC 규약 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/conventions.md:1` |

## 현재 주요 사실

| 항목 | 현재값 | 근거 |
|---|---|---|
| 제품 방향 | M1 = jwc 단독 완성, M2 = cli-jaw 런타임 이식 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:1` |
| 공개 wrapper | `packages/jwc`가 `jwc` bin과 `jwc/sdk` export 제공 | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:7`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15` |
| 실제 SDK 구현 | `packages/coding-agent/src/sdk.ts` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217` |
| default workflows | `deep-interview`, `ralplan`, `ultragoal`, `team` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:5` |
| state path | `.gjc/` 유지 | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:25` |
| package namespace | `@gajae-code/*` 유지 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/conventions.md:21` |

## 관련 문서

- 업스트림 운영 계약: `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md` (수정 금지 — conventions.md 참조)
- 활성 플랜: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/`
- gjc 프로바이더 계층 분석 노트(외부): `/Users/jun/Developer/new/002_proxy/003_gjc/`
- cli-jaw 본체: `/Users/jun/Developer/new/700_projects/cli-jaw/`
