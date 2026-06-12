# structure/ — Jawcode Source of Truth

> Jawcode = gajae-code(gjc) 0.4.4 fork. cli-jaw의 메인 네이티브 런타임이 되는 것이 목표다.
> 업스트림 remote는 `upstream = https://github.com/Yeachan-Heo/gajae-code`이고 현재 HEAD는 `2654e6c`다.

## 시작점

| 문서 | 내용 | 근거 |
|------|------|------|
| [INDEX.md](./INDEX.md) | 전체 문서 인덱스와 읽기 순서 | `/Users/jun/Developer/new/700_projects/jawcode/structure/INDEX.md:1` |
| [architecture.md](./architecture.md) | 현재 시스템 형태와 cli-jaw 통합 시임 | `/Users/jun/Developer/new/700_projects/jawcode/structure/architecture.md:1` |
| [packages_overview.md](./packages_overview.md) | `packages/*`, `crates/*` 전체 지도 | `/Users/jun/Developer/new/700_projects/jawcode/structure/packages_overview.md:1` |
| [sdk_surface.md](./sdk_surface.md) | `jwc/sdk` 공개 표면과 `createAgentSession()` 계약 | `/Users/jun/Developer/new/700_projects/jawcode/structure/sdk_surface.md:1` |
| [prompt_flow.md](./prompt_flow.md) | 시스템 프롬프트 조립 흐름 | `/Users/jun/Developer/new/700_projects/jawcode/structure/prompt_flow.md:1` |
| [workflows.md](./workflows.md) | default workflow skill 4종 계약 | `/Users/jun/Developer/new/700_projects/jawcode/structure/workflows.md:1` |
| [session_storage.md](./session_storage.md) | SQLite/session/history/auth/memory storage | `/Users/jun/Developer/new/700_projects/jawcode/structure/session_storage.md:1` |
| [extensibility.md](./extensibility.md) | skills/slash/custom-tools/hooks/plugins 확장 표면 | `/Users/jun/Developer/new/700_projects/jawcode/structure/extensibility.md:1` |
| [gitstructure.md](./gitstructure.md) | fork 운영, 표면 리네이밍, 리베이스 가드 | `/Users/jun/Developer/new/700_projects/jawcode/structure/gitstructure.md:1` |
| [conventions.md](./conventions.md) | 포크 규칙, 업스트림 동기화, devlog/MOC 규약 | `/Users/jun/Developer/new/700_projects/jawcode/structure/conventions.md:1` |

## 현재 주요 사실

| 항목 | 현재값 | 근거 |
|---|---|---|
| 제품 방향 | M1 = jwc 단독 완성, M2 = cli-jaw 런타임 이식 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:1` |
| 공개 wrapper | `packages/jwc`가 `jwc` bin과 `jwc/sdk` export 제공 | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:7`, `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15` |
| 실제 SDK 구현 | `packages/coding-agent/src/sdk.ts` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217` |
| default workflows | `jaw-interview`, `ralplan`, `ultragoal`, `team` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| upstream AGENTS contract | 아직 `deep-interview` 표기 (수정 금지) | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:11` |
| state path | `.gjc/` 유지 | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:25` |
| package namespace | `@gajae-code/*` 유지 | `/Users/jun/Developer/new/700_projects/jawcode/structure/conventions.md:24` |

## 개발 흐름 (upstream 참조 + pull)

jawcode는 **worktree에서 포크 패치**를 만들고, **업스트림은 별도 클론**으로 대조한다.

| 층 | 경로 | 역할 |
|---|---|---|
| patched SoT | `structure/` (본 트리) | jawcode **현재 형태**의 단일 정본 |
| upstream mirror | `devlog/_upstream_gjc/` | Yeachan-Heo/gajae-code **gitignored 클론** — diff·file:line 근거 |
| 양쪽 대조 | `har_struct/gjc_origin/` ↔ `har_struct/jwc_patched/` | MOC 밴드별 upstream vs patched 스냅샷 |

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
- upstream 클론 HEAD·밴드 diff 반영 후 `har_struct/gjc_origin/`·`structure/gitstructure.md` 갱신 (상세: [conventions.md §2](./conventions.md), [gitstructure.md](./gitstructure.md))

## 관련 문서

- 업스트림 운영 계약: `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md` (수정 금지 — conventions.md 참조)
- **업스트림 코드 클론**: `devlog/_upstream_gjc/` (gitignored — [conventions.md §2](./conventions.md))
- **양쪽 대조 스냅샷**: [har_struct/](../har_struct/README.md)
- 활성 플랜: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/`
- gjc 프로바이더 계층 분석 노트(외부): `/Users/jun/Developer/new/002_proxy/003_gjc/`
- cli-jaw 본체: `/Users/jun/Developer/new/700_projects/cli-jaw/`
