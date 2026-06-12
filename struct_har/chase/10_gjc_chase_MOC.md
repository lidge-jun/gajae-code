# 10 — gjc_chase_MOC

> 상태: 🟡 운영 중 (2026-06-13)  
> **정본 디렉터리**: `struct_har/chase/10_*` · `10.NNN_*`  
> **의미**: `devlog/_upstream_gjc` 대비 jwc **뒤쳐짐(G1)** — **1갭 = 문서 1개** (`10.NNN`, `001`~)

## 번호

| **10** | 본 MOC (`10_gjc_chase_MOC.md`) |
| **10.NNN** | 플랜 (`10.001_…` 파일명) |

규약 · `_legacy`: [05_devlog_numbering.md](./05_devlog_numbering.md)

## 링크

| | |
|---|---|
| 갭 | [02_gap_inventory.md](./02_gap_inventory.md) |
| 참조 | [03_reference_from_gjc.md](./03_reference_from_gjc.md) |
| bands | [bands/](./bands/) |
| 델타 | [structure/fork-delta.md](../../structure/fork-delta.md) |

## HEAD

| gjc | jwc |
|---|---|
| `67427c6` | `81bcea96` |

## 활성 (`10.NNN`)

| NNN | 문서 | 스코프 | P | 상태 |
|---|---|---|---|---|
| 001 | [10.001_gjc_chase_cycle.md](./10.001_gjc_chase_cycle.md) | fetch·CHANGELOG | P0 | 🟡 |
| 002 | [10.002_gjc_chase_ai_auth.md](./10.002_gjc_chase_ai_auth.md) | ai·090 | **P1** | ⬜ |
| 003 | [10.003_gjc_chase_cursor.md](./10.003_gjc_chase_cursor.md) | 081 | **P1** | ⬜ |
| 004 | [10.004_gjc_chase_session_compaction.md](./10.004_gjc_chase_session_compaction.md) | session | P2 | ⬜ |
| 005 | [10.005_gjc_chase_task_subagent.md](./10.005_gjc_chase_task_subagent.md) | task | P2 | ⬜ |
| 006 | [10.006_gjc_chase_tui_core.md](./10.006_gjc_chase_tui_core.md) | tui | P3 | ⬜ |
| 007+ | _(미할당)_ | G1 1갭 1문서 | | ⬜ |

## 완료

→ [_legacy/10/](./_legacy/10/README.md) · [INDEX](./_legacy/INDEX.md)

## 불변

orchestrate · jaw-interview · `.jwc` · `packages/jwc` only bin · `@gajae-code/*`

## omp

[20_omp_chase_MOC.md](./20_omp_chase_MOC.md)

`10_phase1_jwc_shell`(devlog) = 010 셸 ✅, 본 MOC 무관.