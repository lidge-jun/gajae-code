# chase — jwc 자체 백로그 (타 제품 drift 아님)

> gjc/omp가 아니라 **jawcode가 스스로 아직 안 닫은 것**. 정본: 99 MOC · [jwc_readiness](../../structure/jwc_readiness.md).

## MLB

| 단계 | 점수 | 닫는 패키지 |
|---|:---:|---|
| 지금 | **50** | — |
| 드라이버 임계 | **62** | **99.02 + 99.03** |
| 99 전체 | **68** | 99.01–07 |

## CRITICAL (참조: 구현은 devlog)

| # | 갭 | GG | 참조 문서 |
|---|---|---|---|
| 1 | pabcd discovery M1/M2/M3 | 99.03 | [99.03.01](../../devlog/_plan/260612_jawcode_fork/phase1/99.03.01_impl_workflow_surface.md) PASS v2 |
| 2 | `jwc memory` CLI 마감 | 99.01 | [99.01.00_moc_memory](../../devlog/_plan/260612_jawcode_fork/phase1/99.01.00_moc_memory.md) |
| 3 | check:schemas + biome | 99.02 | [99.02.00](../../devlog/_plan/260612_jawcode_fork/phase1/99.02.00_plan_parallel_landing.md) · [m1_closeout](../../structure/m1_closeout.md) |

## 99 패키지 맵

| GG | 내용 | chase 밴드 |
|---|---|---|
| 99.01 | memory CLI + chat search | 070 |
| 99.02 | schemas·biome·병렬 랜딩 | 횡단 |
| 99.03 | workflow surface / pabcd discovery | 020, 050, 099 |
| 99.04 | HUD + TUI /goal 별칭 | 080, 060 |
| 99.05 | auth 릴리즈 게이트 | 090 |
| 99.06 | 문서 stale 스윕 | structure |
| 99.07 | 슬래시 패리티 | 030, 040, 050 |

착수 순서: `99.01 → 99.02 → 99.03 → 99.04 → 99.05 → 99.06 → 99.07` ([99.00.00](../../devlog/_plan/260612_jawcode_fork/phase1/99.00.00_moc_stabilization.md) · [beta_v0.1_closeout](../../structure/beta_v0.1_closeout.md)).

## M2 / OSS (99 밖)

| 항목 | MOC | chase |
|---|---|---|
| Node 포팅 | [100_moc_node_porting](../../devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md) | [bands/100_node.md](./bands/100_node.md) |
| 런타임 부착 | [111_design_runtime_attach](../../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md) | 110+ |
| β struct_har/Node | goal `3f6989ac` | **99 제외** |
| OSS v0.1 | LICENSE·릴리즈·CONTRIBUTING | [beta_v0.1_closeout](../../structure/beta_v0.1_closeout.md) |

## jwc만 **앞선** 것 (chase에서 추적 불필요·문서만)

- orchestrate native + `prompts/jaw/`
- `jaw-interview` + mutation-guard jwc
- `goal` CLI + goal-runtime
- Phase β `.jwc` 경로
- cli-jaw skill substitution (031)

→ [fork_logic_changelog](../../structure/fork_logic_changelog.md) · [jwc_patched/050_plan/02_logic_changes](../jwc_patched/050_plan/02_logic_changes.md)