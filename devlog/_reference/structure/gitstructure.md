# Git Structure / Fork Operation

> fork 운영 원칙: jaw 표면은 만들되, `.gjc/` 상태 경로와 `@gajae-code/*` namespace는 유지해 업스트림 리베이스 비용을 낮춘다.

## 현재 Git 상태

| 항목 | 값 | 근거 |
|---|---|---|
| Project root | `/Users/jun/Developer/new/700_projects/jawcode` | task instruction |
| HEAD | `498d86b` | `git -C /Users/jun/Developer/new/700_projects/jawcode rev-parse --short HEAD` 실행 결과 |
| upstream fetch/push | `https://github.com/Yeachan-Heo/gajae-code` | `git -C /Users/jun/Developer/new/700_projects/jawcode remote -v` 실행 결과 |
| origin | 없음 | `git -C /Users/jun/Developer/new/700_projects/jawcode remote -v` 실행 결과에 upstream만 있음 |
| 기존 worktree 변경 | `bun.lock`, `002_proxy/`, `devlog/`, `packages/jwc/`, `devlog/_reference/structure/` | `git -C /Users/jun/Developer/new/700_projects/jawcode status --short` 실행 결과 |

## 표면 리네이밍 정책

| 정책 | 상태 | 근거 |
|---|---|---|
| bin 표면 | `packages/jwc`가 `jwc` bin을 제공한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:7` |
| 내부 실행 | 현재 `jwc` bin은 `@gajae-code/coding-agent/cli`를 import한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/bin/jwc.js:1` |
| SDK 표면 | `jwc/sdk`는 coding-agent SDK를 재수출한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1` |
| package namespace | upstream `@gajae-code/*` 유지, jawcode 신규 패키지만 별도 namespace 가능. | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/conventions.md:21` |
| state path | runtime state/plans/specs/ledgers는 `.gjc/` 유지. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:25`, `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:221` |
| D4 결정 | bin `jwc`, 브랜딩/문서/스킬명만 jaw; `.gjc/`와 `@gajae-code/*` 유지. | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:13` |

## 리베이스 가드

| Guard | 적용 | 근거 |
|---|---|---|
| upstream 파일 수정 최소화 | jaw 전용 context는 `devlog/_reference/structure/`, `devlog/`, 신규 패키지에 둔다. | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/conventions.md:5` |
| `AGENTS.md` 수정 금지 | repo-local workflow 계약이므로 fork context는 structure에 둔다. | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_reference/structure/conventions.md:8`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:1` |
| model catalog 직접 수정 금지 | `packages/ai/src/models.json`은 generator/descriptors/resolvers로 바꾸고 regenerate한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:64` |
| workflow default surface gate | default workflow skill 변경 후 required gates가 있다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:92` |
| no push/reset/clean | task context와 repo AGENTS 모두 destructive git 회피를 요구한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:88` |

## Upstream Sync 절차

| 단계 | 명령 | 주의 |
|---|---|---|
| 1 | `git -C /Users/jun/Developer/new/700_projects/jawcode fetch upstream` | 현재 remote는 upstream만 확인됨. |
| 2 | `git -C /Users/jun/Developer/new/700_projects/jawcode rebase upstream/main` | rebase 전 worktree 변경을 정리해야 한다. 현재 변경이 있으므로 바로 실행 금지. |
| 3 | conflict 확인 | `.gjc/`, `@gajae-code/*` 유지 정책과 충돌하면 D4를 우선한다. |
| 4 | gates | workflow/default surface 변경이 있으면 `bun scripts/check-visible-definitions.ts`, `bun scripts/verify-g002-gates.ts`, `bun scripts/rebrand-inventory.ts --strict`, `bun test packages/coding-agent/test/default-gjc-definitions.test.ts`. 근거: `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:92` |

## 문서 동기화

| 변경 | 갱신 문서 |
|---|---|
| `packages/jwc` public export 변경 | `packages_overview.md`, `sdk_surface.md`, `gitstructure.md` |
| `.gjc` 경로 정책 변경 | `gitstructure.md`, `session_storage.md`, `workflows.md` |
| default workflow skill 변경 | `workflows.md`, `prompt_flow.md`, `extensibility.md` |
| upstream sync 정책 변경 | `gitstructure.md`, `conventions.md` |
