# struct_har/chase/ — 뒤쳐진 영역 · 참조 방안

> **목적**: jawcode(jwc)가 **선택적으로 따라잡거나 참고**할 gjc·omp·cli-jaw 축의 갭을 한곳에 모은다.
> **아님**: git cherry-pick 절차, fork 리베이스, upstream에 기여하는 PR 목록 — 그건 [structure/fork-delta.md](../../structure/fork-delta.md) · [conventions.md](../../structure/conventions.md).

## gjc / omp 플랜 (정본 = 이 디렉터리)

| 축 | MOC | 플랜 파일 |
|---|---|---|
| **10 gjc** | [10_gjc_chase_MOC.md](./10_gjc_chase_MOC.md) | `10.001_` … `10.010_` … (`10.NNN_*`) |
| **20 omp** | [20_omp_chase_MOC.md](./20_omp_chase_MOC.md) | `20.001_` … `20.006_` … (`20.NNN_*`) |

- 규약 · 완료 이동: [005_devlog_numbering.md](./005_devlog_numbering.md) → [`_legacy/10|20/`](./_legacy/README.md)
- devlog `10_gjc_chase_MOC` / `20_omp_chase_MOC` = **스텁** (로드맵 링크용)

## 정본 축

| 축 | 클론 / SoT | struct_har 대조 |
|---|---|---|
| **gjc** | `devlog/_upstream_gjc/` @ `75d103f45145` | [../gjc_origin/](../gjc_origin/) |
| **jwc** | worktree @ `dc4f22672581` | [../jwc_patched/](../jwc_patched/) · [structure/](../../structure/) |
| **omp** | `devlog/_upstream_omp/` @ `db421bb2ef68` | [../omp_origin/](../omp_origin/) |
| **자체 백로그** | 99·M2·OSS | [006_jwc_own_backlog.md](./006_jwc_own_backlog.md) |

## 문서 트리

| 파일 | 내용 |
|---|---|
| `10_*` · `20_*` | **chase MOC + NNN 플랜** |
| [001_overview.md](./001_overview.md) | 정의 · 읽기 순서 |
| [002_gap_inventory.md](./002_gap_inventory.md) | 횡단 갭 + **구현가치 MLB 20-80 표** |
| [003_reference_from_gjc.md](./003_reference_from_gjc.md) · [004_reference_from_omp.md](./004_reference_from_omp.md) | 참조 원칙 |
| [005_devlog_numbering.md](./005_devlog_numbering.md) | NNN · `_legacy` |
| [006_jwc_own_backlog.md](./006_jwc_own_backlog.md) | G3/G4 자체 백로그 (구 04 — 260613 충돌 해소 리네임) |
| [bands/](./bands/) | 밴드 카드 |

## 갱신

1. `10.001` / `20.001` 사이클 (fetch)
2. 새 갭 → `10.009_<slug>.md` 등 **여기**에 추가
3. 완료 → `_legacy/10/` 또는 `20/`
4. [002_gap_inventory](./002_gap_inventory.md) · INDEX HEAD · MOC `reviewed through`

## 관련

- [structure/status.md](../../structure/status.md)
- [structure/status.md](../../structure/status.md)
- [structure/status.md](../../structure/status.md)

*정본: `struct_har/chase/10_` · `20_`.*