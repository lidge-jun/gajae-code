# structure/ — Jawcode Source of Truth

> Jawcode(`jwc`) = gajae-code 0.4.4 fork 위에 Jaw/jwc 표면을 얹은 빌드. cli-jaw의 메인 네이티브 런타임이 되는 것이 목표다.
> 업스트림 remote: `upstream = https://github.com/Yeachan-Heo/gajae-code`. worktree HEAD: `81bcea96` (기록 시점). upstream 클론: `devlog/_upstream_gjc` @ `67427c6`.

## 시작점

| 문서 | 내용 | 근거 |
|------|------|------|
| [INDEX.md](./INDEX.md) | 전체 문서 인덱스와 읽기 순서 | `/Users/jun/Developer/new/700_projects/jawcode/structure/INDEX.md:1` |
| [doc_map.md](./doc_map.md) | structure · struct_har · omp · cli-jaw 문서 지도 | `structure/doc_map.md:1` |
| [architecture.md](./architecture.md) | 현재 시스템 형태와 cli-jaw 통합 시임 | `/Users/jun/Developer/new/700_projects/jawcode/structure/architecture.md:1` |
| [packages_overview.md](./packages_overview.md) | `packages/*`, `crates/*` 전체 지도 | `/Users/jun/Developer/new/700_projects/jawcode/structure/packages_overview.md:1` |
| [sdk_surface.md](./sdk_surface.md) | `jwc/sdk` 공개 표면과 `createAgentSession()` 계약 | `/Users/jun/Developer/new/700_projects/jawcode/structure/sdk_surface.md:1` |
| [prompt_flow.md](./prompt_flow.md) | 시스템 프롬프트 조립 흐름 | `/Users/jun/Developer/new/700_projects/jawcode/structure/prompt_flow.md:1` |
| [workflows.md](./workflows.md) | default workflow skill 4종 계약 | `/Users/jun/Developer/new/700_projects/jawcode/structure/workflows.md:1` |
| [session_storage.md](./session_storage.md) | SQLite/session/history/auth/memory storage | `/Users/jun/Developer/new/700_projects/jawcode/structure/session_storage.md:1` |
| [todo_pipeline.md](./todo_pipeline.md) | `todo_write` · 리마인더 · composer todo 패널 | `99.30.01` |
| [extensibility.md](./extensibility.md) | skills/slash/custom-tools/hooks/plugins 확장 표면 | `/Users/jun/Developer/new/700_projects/jawcode/structure/extensibility.md:1` |
| [gitstructure.md](./gitstructure.md) | fork 운영, 표면 리네이밍, 리베이스 가드 | `/Users/jun/Developer/new/700_projects/jawcode/structure/gitstructure.md:1` |
| [conventions.md](./conventions.md) | 포크 규칙, 업스트림 동기화, devlog/MOC 규약 | `/Users/jun/Developer/new/700_projects/jawcode/structure/conventions.md:1` |
| [memory_pipeline.md](./memory_pipeline.md) | jwc memories vs cli-jaw memory | `structure/memory_pipeline.md` |
| [fork-delta.md](./fork-delta.md) | 업스트림 이탈 파일 인덱스·체리픽 | `structure/fork-delta.md` |
| [jwc_readiness.md](./jwc_readiness.md) | M1 마감·99 밴드 MLB 50→62→68 | `99.00.01` |
| [m1_closeout.md](./m1_closeout.md) | M1 99 밴드·99.02 re-facing | `99.00.00` |
| [beta_v0.1_closeout.md](./beta_v0.1_closeout.md) | beta v0.1 문서·OSS 표면 마감 | `99.00.00` |

## 현재 주요 사실

| 항목 | 현재값 | 근거 |
|---|---|---|
| 제품 방향 | M1 = jwc 단독 완성, M2 = cli-jaw 런타임 이식 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md:1` |
| 공개 wrapper | `packages/jwc`가 `jwc` bin과 `jwc/sdk` export 제공 | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:7`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15` |
| 실제 SDK 구현 | `packages/coding-agent/src/sdk.ts` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217` |
| default workflows | `jaw-interview`, `ralplan`, `ultragoal`, `team` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| upstream baseline | legacy `deep-interview` 등은 `struct_har/gjc_origin/`과 `devlog/_upstream_gjc/`에서만 비교 기준으로 읽는다 | `/Users/jun/Developer/new/700_projects/jawcode/struct_har/gjc_origin/` |
| config / project state dir | 런타임 `.jwc/` (`~/.jwc`, 프로젝트 `.jwc/`) | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:219` |
| package namespace | `@gajae-code/*` 유지 | `/Users/jun/Developer/new/700_projects/jawcode/structure/conventions.md:69` |

## 개발 흐름 (upstream 참조 + pull)

jawcode는 **worktree에서 포크 패치**를 만들고, **업스트림은 별도 클론**으로 대조한다.

| 층 | 경로 | 역할 |
|---|---|---|
| patched SoT | `structure/` (본 트리) | jawcode **현재 형태**의 단일 정본 |
| upstream mirror | `devlog/_upstream_gjc/` | Yeachan-Heo/gajae-code **gitignored 클론** — diff·file:line 근거 |
| 양쪽 대조 | `struct_har/gjc_origin/` ↔ `struct_har/jwc_patched/` | MOC 밴드별 upstream vs patched 스냅샷 |

**일상 루틴** (밴드 착수·리베이스 전):

```bash
# 1) upstream 클론 갱신 (최초: git clone … devlog/_upstream_gjc)
git -C devlog/_upstream_gjc fetch origin
git -C devlog/_upstream_gjc log -1 --oneline   # HEAD 기록

# 2) worktree upstream 동기화 (변경 정리 후)
git fetch upstream && git rebase upstream/main   # 또는 merge

# 3) 대조
diff -u devlog/_upstream_gjc/packages/coding-agent/src/cli.ts packages/coding-agent/src/cli.ts
```

- `gjc_origin` 근거 cite: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/<path>:<line>`
- `jwc_patched` 근거 cite: `/Users/jun/Developer/new/700_projects/jawcode/<path>:<line>`
- upstream 클론 HEAD·밴드 diff 반영 후 `struct_har/gjc_origin/`·`structure/gitstructure.md` 갱신 (상세: [conventions.md §2](./conventions.md), [gitstructure.md](./gitstructure.md))

## 관련 문서

- 프로젝트 운영 계약: `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md`
- **업스트림 코드 클론**: `devlog/_upstream_gjc/` (gitignored — [conventions.md §2](./conventions.md))
- **양쪽 대조 스냅샷**: [struct_har/](../struct_har/README.md)
- **OMP 참조 클론**: `devlog/_upstream_omp/` → [struct_har/omp_origin/](../struct_har/omp_origin/README.md)
- 활성 플랜: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/`
- **계보**: [upstream_lineage.md](./upstream_lineage.md)
- upstream provider 계층 분석 노트(외부): `/Users/jun/Developer/new/002_proxy/003_gjc/`
- cli-jaw 본체: `/Users/jun/Developer/new/700_projects/cli-jaw/`
