# struct_har/ — gjc_origin ↔ jwc_patched 계층 대조

> **스냅샷 (2026-06-13)**: 전수 재생성 + 로직 보강 + **99 레디니스** (`structure/jwc_readiness.md`, [99.03.01](../devlog/_plan/260612_jawcode_fork/99.03.01_impl_workflow_surface.md) PASS v2).

> **목적**: 업스트림 gajae-code(`gjc_origin`)과 jawcode 포크(`jwc_patched`)의 **현재 형태**를 devlog MOC 밴드별로 병렬 기록한다.  
> `structure/`가 patched 단일 SoT라면, `struct_har/`는 **양쪽 스냅샷 대조용**이다.

## 기준선

| 쪽 | 코드 소스 | HEAD (기록 시점) |
|---|---|---|
| **gjc_origin** | [`devlog/_upstream_gjc/`](../devlog/_upstream_gjc/) — Yeachan-Heo/gajae-code 클론 (gitignored) | `67427c6` |
| **jwc_patched** | jawcode worktree (포크 패치 반영) | `81bcea96` |

| **omp_origin** | [`devlog/_upstream_omp/`](../devlog/_upstream_omp/) | `e13ad3805` |
- 업스트림 remote: `https://github.com/Yeachan-Heo/gajae-code`
- **gjc_origin 문서의 code facts는 `devlog/_upstream_gjc/` 아래 파일을 정본으로 cite** (절대경로 `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/…`).
- jwc_patched는 repo root `packages/`·`structure/`를 정본으로 cite.

## 폴더 규약

```text
struct_har/
  README.md
  INDEX.md
  gjc_origin/
    <band>/
      01_overview · 02_code_facts · 02_logic_changes · 03_devlog_refs
  jwc_patched/
    <band>/
      (동일)
    099_stabilization/
  omp_origin/
    <band>/          ← gjc/jwc 동형 id (13)
      (동일)
    architecture/
  gjc_origin/architecture/ · jwc_patched/architecture/
  chase/             ← 갭·gjc/omp 참조 방안 (수동 갱신)
    bands/
```

- **밴드 폴더명** = devlog `NNN_moc_*` 접두와 정렬 (`010_shell` … `100_node`, `architecture`).
- **파일명** = `01_overview` → `02_code_facts` → **`02_logic_changes`** → `03_devlog_refs`
- **갱신 규칙**: 포크 밴드 완료 시 `jwc_patched` 먼저; upstream fetch 후 `gjc_origin`은 `devlog/_upstream_gjc` HEAD·경로 인벤토리 갱신.
- **로직 정본**: [structure/fork_logic_changelog.md](../structure/fork_logic_changelog.md)
- **재생성**: `struct-har-regenerate.ts` · `struct-har-regenerate-logic.ts` · `struct-har-regenerate-architecture.ts` · `struct-har-regenerate-overviews.ts` · **`struct-har-regenerate-omp.ts`**

## upstream 클론 사용법

```bash
# 클론 (최초 1회 — devlog/.gitignore 대상)
git clone https://github.com/Yeachan-Heo/gajae-code devlog/_upstream_gjc

# 갱신
git -C devlog/_upstream_gjc fetch origin
git -C devlog/_upstream_gjc log -1 --oneline

# gjc_origin 대조 시 diff 예
diff -u devlog/_upstream_gjc/packages/coding-agent/src/cli.ts packages/coding-agent/src/cli.ts
```

## 읽기 순서

1. [INDEX.md](./INDEX.md) — 전체 트리
2. `architecture/` — 양쪽 공통 토폴로지
3. M1 밴드 순: `010` → `040` → `050` → …
4. TUI 서브밴드: `081_cursor` / `082_input` / `083_output`

## 관련 문서

| 문서 | 역할 |
|---|---|
| [`devlog/_upstream_gjc/`](../devlog/_upstream_gjc/) | **업스트림 코드 정본** (gjc_origin 근거) |
| [structure/](../structure/) | jawcode patched 단일 SoT |
| [structure/fork_logic_changelog.md](../structure/fork_logic_changelog.md) | fork 동작 (git) |
| [structure/jwc_readiness.md](../structure/jwc_readiness.md) | MLB 50→62→68 |
| [structure/m1_closeout.md](../structure/m1_closeout.md) | 99 결정·착수 순서 |
| [structure/beta_v0.1_closeout.md](../structure/beta_v0.1_closeout.md) | beta v0.1 문서·OSS 마감 |
| [devlog/_plan/260612_jawcode_fork/](../devlog/_plan/260612_jawcode_fork/) | MOC·플랜·이슈 원본 |
| [AGENTS.md](../AGENTS.md) | upstream 운영 계약 (수정 금지) |
| [chase/](./chase/README.md) | gjc/omp **뒤쳐짐** · 참조 방안 |

## gjc_origin vs jwc_patched (횡단 요약)

| 영역 | gjc_origin (`devlog/_upstream_gjc`) | jwc_patched (worktree) |
|---|---|---|
| CLI bin | `gjc` (+ stats) | **`jwc` only** (`packages/jwc`) |
| packages/jwc | 없음 | wrapper ✅ `jwc/sdk` |
| default interview | `deep-interview` | **`jaw-interview`** |
| config dir (runtime) | upstream `.jwc` 전환 중 | **`.jwc/`** (`dirs.ts`) |
| orchestrate IPABCD | 없음 | 런타임 ✅ / discovery ⬜ **99.03** |
| global skills | `.jwc` 2계층 | + `~/.cli-jaw/skills` (D5 목표) |
| TUI theme | upstream 기본 | jaw 테마 · HUD ⬜ **99.04** |
| omp 참조축 | — | [omp_origin/](./omp_origin/README.md) |

## evidence 규칙

- gjc_origin: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/<repo-relative-path>:<line>`
- jwc_patched: `/Users/jun/Developer/new/700_projects/jawcode/<path>:<line>` (structure/conventions.md 동형)
- devlog MOC는 스코프·결정 정본; **코드 형태는 클론/worktree가 우선**

## 밴드 ↔ upstream 경로 (요약)

| 밴드 | upstream에서 볼 핵심 경로 |
|---|---|
| 010_shell | `packages/utils/src/dirs.ts`, `scripts/rebrand-inventory.ts`, `packages/gajae-code/` |
| 020_prompt | `packages/coding-agent/src/prompts/`, `system-prompt.ts` |
| 030_skills | `extensibility/skills.ts`, `defaults/gjc-defaults.ts`, `defaults/gjc/skills/` |
| 040_interview | `defaults/gjc/skills/deep-interview/`, `commands/deep-interview.ts` |
| 050_plan | `defaults/gjc/skills/ralplan/`, `commands/ralplan.ts` |
| 060_goal | `defaults/gjc/skills/ultragoal/` |
| 070_memory | memory hooks / `.jwc` 규약 |
| 080_tui | `packages/tui/` |
| 081_cursor | `packages/ai/src/providers/cursor.ts`, `packages/coding-agent/src/cursor.ts` |
| 082_input | `packages/tui/` IME/keys |
| 083_output | TUI output / tool collapse |
| 090_auth | `packages/ai/src/auth-storage.ts` |
| 100_node | Bun-only modules (M2 포팅 대상) |

## changelog

| 날짜 | 변경 |
|---|---|
| 2026-06-13 | **전수 재생성** (26×02, 26×01/03, architecture×14, 스크립트 3종) + omp_origin |
| 2026-06-13 | **chase/** — 갭·gjc/omp 참조 + bands/13 |
| 2026-03-13 | 초기 struct_har 94 md 생성 |
| 2026-03-13 | 문서 >=100 lines 확장 |
| 2026-03-13 | gjc_origin 근거를 `devlog/_upstream_gjc` 클론으로 통일 |
