# Git Structure / Fork Operation

> fork 운영 원칙: jaw 표면은 만들되, `.gjc/` 상태 경로와 `@gajae-code/*` namespace는 유지해 업스트림 리베이스 비용을 낮춘다.

## 현재 Git 상태

| 항목 | 값 | 근거 |
|---|---|---|
| Project root | `/Users/jun/Developer/new/700_projects/jawcode` | task instruction |
| HEAD | `81bcea96` | `git -C /Users/jun/Developer/new/700_projects/jawcode rev-parse --short HEAD` |
| upstream fetch/push | `https://github.com/Yeachan-Heo/gajae-code` | `git -C /Users/jun/Developer/new/700_projects/jawcode remote -v` 실행 결과 |
| origin | 없음 | `git -C /Users/jun/Developer/new/700_projects/jawcode remote -v` 실행 결과에 upstream만 있음 |
| 기존 worktree 변경 | `packages/ai/*` (kiro provider WIP), `devlog/_plan/260612_jawcode_fork/*` | `git -C /Users/jun/Developer/new/700_projects/jawcode status --short` 실행 결과 |
| structure/ | modified 8 files (jaw-interview sync, HEAD/path/meta 갱신) | `git -C /Users/jun/Developer/new/700_projects/jawcode status --short structure/` 실행 결과 |

## 표면 리네이밍 정책

| 정책 | 상태 | 근거 |
|---|---|---|
| bin 표면 | `packages/jwc`가 `jwc` bin을 제공한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:7` |
| 내부 실행 | 현재 `jwc` bin은 `@gajae-code/coding-agent/cli`를 import한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/bin/jwc.js:1` |
| SDK 표면 | `jwc/sdk`는 coding-agent SDK를 재수출한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1` |
| default workflow slug | fork runtime은 `jaw-interview`; upstream `AGENTS.md`는 `deep-interview` 유지 | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:11` |
| package namespace | upstream `@gajae-code/*` 유지, jawcode 신규 패키지만 별도 namespace 가능. | `/Users/jun/Developer/new/700_projects/jawcode/structure/conventions.md:24` |
| state path | 런타임 `.jwc/` (`CONFIG_DIR_NAME`, `~/.jwc`) — repo 문서·마이그레이션은 Phase β 기준 | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:219` |
| D4 결정 | bin `jwc`, 브랜딩/문서/스킬명만 jaw; `.jwc/`와 `@gajae-code/*` 유지. | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:13` |

## 리베이스 가드

> 충돌 예상 파일 사전 점검: `grep "CONFLICT-EXPECTED" structure/fork-delta.md` ↔ `git diff upstream/main --name-only` 대조 ([fork-delta.md](./fork-delta.md) 정본).

| Guard | 적용 | 근거 |
|---|---|---|
| upstream 파일 수정 최소화 | jaw 전용 context는 `structure/`, `devlog/`, 신규 패키지에 둔다. | `/Users/jun/Developer/new/700_projects/jawcode/structure/conventions.md:7` |
| `AGENTS.md` 수정 금지 | repo-local workflow 계약이므로 fork context는 structure에 둔다. | `/Users/jun/Developer/new/700_projects/jawcode/structure/conventions.md:10`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:1` |
| model catalog 직접 수정 금지 | `packages/ai/src/models.json`은 generator/descriptors/resolvers로 바꾸고 regenerate한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:73` |
| workflow default surface gate | default workflow skill 변경 후 required gates가 있다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:128` |
| no push/reset/clean | task context와 repo AGENTS 모두 destructive git 회피를 요구한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:125` |

## Upstream Sync 절차

| 단계 | 명령 | 주의 |
|---|---|---|
| 0 | `git -C devlog/_upstream_gjc fetch origin` | **참조 클론 pull** — gjc_origin 근거·diff 전에 실행. 최초: `git clone … devlog/_upstream_gjc`. |
| 1 | `git -C /Users/jun/Developer/new/700_projects/jawcode fetch upstream` | worktree remote. |
| 2 | `git -C /Users/jun/Developer/new/700_projects/jawcode rebase upstream/main` | rebase 전 worktree 변경을 정리해야 한다. |
| 3 | conflict 확인 | `.gjc/`, `@gajae-code/*` 유지 정책과 충돌하면 D4를 우선한다. |
| 4 | gates | workflow/default surface 변경이 있으면 `bun scripts/check-visible-definitions.ts`, `bun scripts/verify-g002-gates.ts`, `bun scripts/rebrand-inventory.ts --strict`, `bun test packages/coding-agent/test/default-gjc-definitions.test.ts` (가드는 jwc 어휘 기준 — 02:04 하드 수정 개정). 근거: `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:128` |
| 5 | 문서 | 클론 HEAD·밴드 diff → `struct_har/gjc_origin/`, `struct_har/README.md`; patched → `structure/` |

## upstream 참조 클론 (`devlog/_upstream_gjc/`)

| 항목 | 값 | 근거 |
|---|---|---|
| 경로 | `devlog/_upstream_gjc/` | jawcode `.gitignore`, `devlog/.gitignore` |
| remote | `https://github.com/Yeachan-Heo/gajae-code` | upstream remote와 동일 |
| 클론 HEAD (기록 시점) | `67427c6` | `git -C devlog/_upstream_gjc rev-parse --short HEAD` |
| paired docs | `struct_har/gjc_origin/` | upstream baseline 스냅샷 |
| patched SoT | `structure/` | worktree 현재 형태 |

개발 중 upstream과의 차이 확인:

```bash
diff -qr devlog/_upstream_gjc/packages/coding-agent/src/ packages/coding-agent/src/ | head
grep -n deep-interview devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts
```

- **pull하면서 개발**: 밴드 착수·리베이스 전에 클론 fetch + worktree fetch/rebase를 한 세트로 돌린다.
- upstream-only 이슈(081 cursor 등)는 클론에서 line 확인 후 fork hotfix 또는 upstream PR.

## 문서 동기화

| 변경 | 갱신 문서 |
|---|---|
| `packages/jwc` public export 변경 | `packages_overview.md`, `sdk_surface.md`, `gitstructure.md` |
| `.jwc` 경로 정책 변경 | `gitstructure.md`, `session_storage.md`, `workflows.md` |
| default workflow skill 변경 | `workflows.md`, `prompt_flow.md`, `extensibility.md`, `INDEX.md` |
| upstream sync 정책 변경 | `gitstructure.md`, `conventions.md` |
| `devlog/_upstream_gjc` HEAD 갱신 | `struct_har/README.md`, `struct_har/gjc_origin/**`, `gitstructure.md` |
| patched 밴드 완료 | `structure/*`, `struct_har/jwc_patched/**` |
| `devlog/_upstream_omp` HEAD 갱신 | `struct_har/omp_origin/**`, `bun struct_har/_scripts/struct-har-regenerate-omp.ts`, `upstream_lineage.md` |
