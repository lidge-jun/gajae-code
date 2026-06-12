# chase — 개요

## 한 줄

**chase** = jawcode가 **의도적으로 아직 못 따라온** 영역 + **gjc/omp/cli-jaw를 어떻게 읽을지**에 대한 참조 방안.

jawcode를 **OSS upstream**으로 운영할 때도 chase는 유효하다: gjc/omp는 **계보·벤치마크**, jwc SoT는 `structure/` + worktree.
## 플랜 번호 (`struct_har/chase/`)

- **10** — [10_gjc_chase_MOC](./10_gjc_chase_MOC.md) · `10.001_` … `10.NNN_*`
- **20** — [20_omp_chase_MOC](./20_omp_chase_MOC.md) · `20.001_` … `20.NNN_*`
- 완료 → [_legacy/10|20](./_legacy/README.md) · [05](./005_devlog_numbering.md)

devlog 스텁만: `devlog/.../10_gjc_chase_MOC.md`. 구 `10_phase1_jwc_shell` = 010 셸 ✅.
## 갭 4종

| 종류 | 설명 | chase 문서 |
|---|---|---|
| **G1 gjc drift** | gajae-code 클론이 jaw worktree보다 **앞선 커밋/기능** (버그픽스·provider·세션) | [003_reference_from_gjc.md](./003_reference_from_gjc.md) |
| **G2 omp bench** | 도구/LSP/catalog/worker 등 **omp만 두꺼운** 축 | [004_reference_from_omp.md](./004_reference_from_omp.md) |
| **G3 jwc product** | orchestrate discovery·memory CLI·HUD 등 **99/M1** | [006_jwc_own_backlog.md](./006_jwc_own_backlog.md) |
| **G4 platform** | M2 Node·cli-jaw 임베드·릴리즈 게이트 | [006_jwc_own_backlog.md](./006_jwc_own_backlog.md) §M2 |

## 우선순위 (착수)

1. **G3** — [99.02 + 99.03](../../structure/jwc_readiness.md) (드라이버 임계 MLB 62)
2. **G1 선별** — auth/cursor/ai 범용 (fork-delta ✅ 후보)
3. **G2 참고** — 밴드 착수 전 omp `02_code_facts` 스캔
4. **G4** — 99 마감 후 100/110

## struct_har와 역할 분담

| struct_har | chase |
|---|---|
| **형태** 스냅샷 (앵커·HEAD·logic 요약) | **행동** (뒤쳐짐·참조·다음에 볼 경로) |
| gjc_origin ↔ jwc_patched 대조 | 삼축 + **자체 백로그** |
| 재생성 스크립트 5종 | **수동** (fetch·diff·표 갱신) |

## 읽기 순서

1. [002_gap_inventory.md](./002_gap_inventory.md)
2. 막히는 밴드 → [bands/](./bands/) 해당 md
3. gjc 따라잡기 → [003_reference_from_gjc.md](./003_reference_from_gjc.md)
4. omp 벤치 → [004_reference_from_omp.md](./004_reference_from_omp.md)