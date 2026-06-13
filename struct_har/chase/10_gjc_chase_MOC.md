# 10 — gjc_chase_MOC

> 상태: 🟡 운영 중 (2026-06-13)
> **정본 디렉터리**: `struct_har/chase/10_*` · `10.NNN_*`
> **의미**: `devlog/_upstream_gjc` 대비 jwc **뒤쳐짐(G1)** — **1갭 = 문서 1개** (`10.NNN`, `001`~)

## 번호

| **10** | 본 MOC (`10_gjc_chase_MOC.md`) |
| **10.NNN** | 플랜 (`10.001_…` 파일명) |

규약 · `_legacy`: [005_devlog_numbering.md](./005_devlog_numbering.md)

## 링크

| | |
|---|---|
| 갭 | [002_gap_inventory.md](./002_gap_inventory.md) |
| 참조 | [003_reference_from_gjc.md](./003_reference_from_gjc.md) |
| bands | [bands/](./bands/) |
| 델타 | [structure/40_fork-delta.md](../../structure/40_fork-delta.md) |

## Reviewed through

| gjc | jwc |
|---|---|
| `75d103f45145` (`75d103f` receipt spool exporter) | `dc4f22672581` (dirty local edits respected) |

> OMP head is intentionally not repeated here; see [20_omp_chase_MOC.md](./20_omp_chase_MOC.md).

## Recent GJC dev deltas

| NNN | upstream fact | jwc 처리 |
|---|---|---|
| 004 | pre-send `#checkEstimatedContextBeforePrompt()` before message packing; pruning/compaction at sanctioned maintenance boundary (`devlog/_upstream_gjc/packages/coding-agent/src/session/agent-session.ts:4747-4756,6517-6533,6537-6558`) | HARD-EDIT session merge; priority raised to P1 |
| 007 | `GJC_TMUX_LAUNCHED_ENV`-guarded `@gjc-profile` retag only for genuinely launched leaders (`team-runtime.ts:1646-1683`; changelog `:17-18`) | ownership invariant; rebrand-safe team gap |
| 008 | RPC frame-by-frame malformed JSONL recovery, EOF `ensureOnDisk`, pending bridge cleanup, and include-gated `get_state` payload (`rpc-mode.ts:234-250,526-580`; changelog `:10,:14`) | headless/workflow-gate reliability gap |
| 009 | char-index → byte-index conversion before slicing in pi-shell bash fixups; multibyte commands no longer panic (`crates/pi-shell/src/fixup.rs:130-144,169-177` post-`2b4d407`, #551) | ✅ **landed 260613** — clean cherry-pick (99.11.01, 188 tests) |
| 010 | `submitUnavailableReason()` gate chain + `Observation.readyForSubmit` for harness RPC submit (`harness-control-plane/state-machine.ts:11,46-57`, `types.ts:213-216`, `f814413`, #549/#544) | ✅ **landed 260613** — sm/types/owner hunks + `#submit` selective port (99.11.02, 175 tests) |
| 011 | NEW `receipt-spool.ts` JSONL exporter — `--receipt-spool-dir`/`GJC_RECEIPT_SPOOL_DIR`, cursor-stamped append on `writeReceiptImmutable`, RPC input propagation (`75d103f`, #554/#545) | owner/storage hunks **apply clean** (실측); `harness.ts` 배관만 선별 — 10.008과 묶음 권장 |
| — | model-profiles group preset selection UX (`model-selector.ts` +346, `a12a751`, #553/#532) | **사용자 직접 패치 중 (260613)** — 카드 미발급, reviewed-through에 포함 |

## 활성 (`10.NNN`)

| NNN | 문서 | 스코프 | P | 상태 |
|---|---|---|---|---|
| 001 | [10.001_gjc_chase_cycle.md](./10.001_gjc_chase_cycle.md) | fetch·CHANGELOG | P0 | 🟡 |
| 002 | [10.002_gjc_chase_ai_auth.md](./10.002_gjc_chase_ai_auth.md) | ai·090 | **P1** | ⬜ |
| 003 | [10.003_gjc_chase_cursor.md](./10.003_gjc_chase_cursor.md) | 081 | **P1** | ⬜ |
| 004 | [10.004_gjc_chase_session_compaction.md](./10.004_gjc_chase_session_compaction.md) | session·compaction | **P1** | ⬜ |
| 005 | [10.005_gjc_chase_task_subagent.md](./10.005_gjc_chase_task_subagent.md) | task | P2 | ⬜ |
| 006 | [10.006_gjc_chase_tui_core.md](./10.006_gjc_chase_tui_core.md) | tui | P3 | ⬜ |
| 007 | [10.007_gjc_chase_team_profile_self_heal.md](./10.007_gjc_chase_team_profile_self_heal.md) | team·leader profile | **P1** | ⬜ |
| 008 | [10.008_gjc_chase_rpc_lifecycle.md](./10.008_gjc_chase_rpc_lifecycle.md) | RPC lifecycle·get_state | P2 | ⬜ |
| 011 | [10.011_gjc_chase_receipt_spool.md](./10.011_gjc_chase_receipt_spool.md) | receipt spool exporter | **P1** | ⬜ |
| 012+ | _(미할당)_ | G1 1갭 1문서 | | ⬜ |

## 완료

→ [_legacy/10/](./_legacy/10/README.md) · [INDEX](./_legacy/INDEX.md)

| NNN | 문서 | 완료일 | 구현 |
|---|---|---|---|
| 009 | [10.009 pi-shell UTF-8 panic](./_legacy/10/10.009_gjc_chase_pishell_utf8_fixup.md) | 260613 | [99.11.01](../../devlog/_plan/260612_jawcode_fork/phase1/99.11.01_plan_upstream_pishell_utf8_fixup.md) — 188 tests green |
| 010 | [10.010 harness submit gate](./_legacy/10/10.010_gjc_chase_harness_submit_readiness.md) | 260613 | [99.11.02](../../devlog/_plan/260612_jawcode_fork/phase1/99.11.02_plan_upstream_harness_submit_gate.md) — 175 tests green |

## 불변

orchestrate · jaw-interview · `.jwc` · `packages/jwc` only bin · `@gajae-code/*`

## omp

[20_omp_chase_MOC.md](./20_omp_chase_MOC.md)

`10_phase1_jwc_shell`(devlog) = 010 셸 ✅, 본 MOC 무관.