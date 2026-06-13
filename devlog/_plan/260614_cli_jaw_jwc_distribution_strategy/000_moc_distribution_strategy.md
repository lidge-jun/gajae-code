# 000 MOC — cli-jaw × jwc distribution strategy

> 상태: 계획 정본. 기존 `jawcode_fork`, `github_deploy`, `packaging`, bridge 문서는 `_legacy/`로 보존한다.
> 목적: 120 이후 구현 전에 배포/패키징/플립 순서를 하나의 실행 선으로 재정렬한다.

## 왜 새 폴더인가

기존 세 밴드는 같은 문제를 다른 이름으로 다루고 있었다.

| Legacy band | 실제 질문 | 새 위치 |
|---|---|---|
| `260612_jawcode_fork` | jwc를 cli-jaw의 네이티브 런타임으로 승격할 수 있는가 | 020, 100-160 |
| `260613_github_deploy` | 공개 repo/CI/release가 어떤 상태를 보증해야 하는가 | 060, 140, 180 |
| `260613_packaging` | 사용자가 설치할 수 있는 jwc 패키지를 어떻게 만들 것인가 | 040, 130, 140 |
| `260614_deploy_fork_packaging_bridge` | 세 밴드가 서로 막는 지점을 어디서 풀 것인가 | 이 MOC로 흡수 |

## 최종 제품 모양

1. **jawcode repo**는 jwc 엔진과 standalone CLI의 원천이다.
2. **jwc standalone 배포**는 독립적으로 설치/실행된다. 사용자는 cli-jaw 없이도 `jwc`를 쓸 수 있다.
3. **cli-jaw 통합 배포**는 별도 `jwc` 글로벌 설치 없이 jwc 기능을 포함한다. cli-jaw 내부에서 `jwc/sdk` 또는 그 빌드 산출물을 통해 같은 엔진을 로드한다.
4. **gjc flip**은 한 번의 전수 rename이 아니라 visible contract부터 순서대로 닫는다. 내부 `@gajae-code/*` 계보는 독립 배포가 안정화될 때까지 보존 가능하다.

## Decade map

| Range | 문서 | 목적 |
|---|---|---|
| 000 | 이 문서 | 통합 MOC |
| 010 | `010_current_state.md` | 현재 진행 상태와 legacy 위치 |
| 020 | `020_architecture_concept.md` | 별도 repo + cli-jaw 내장 개념 정리 |
| 030 | `030_product_surfaces.md` | standalone jwc / embedded cli-jaw / dev mode 표면 |
| 040 | `040_packaging_matrix.md` | 패키징 방식과 금지된 결합 |
| 050 | `050_gjc_flip_timing.md` | gjc→jwc flip 시점 |
| 060 | `060_ci_release_tracks.md` | CI와 release track |
| 070 | `070_decision_register.md` | 결정/열린 질문 |
| 100 | `100_pre120_gap.md` | 110까지의 완료와 120 전 gap |
| 110 | `110_cli_jaw_merge_preconditions.md` | cli-jaw merge 전제 |
| 120 | `120_embedding_slice.md` | cli-jaw 내장 slice |
| 130 | `130_packaging_slice.md` | jwc packaging slice |
| 140 | `140_independent_deploy_slice.md` | 독립 배포/CI 등록 |
| 150 | `150_gjc_flip_slice.md` | 양쪽 flip 실행 |
| 160 | `160_cli_jaw_release_slice.md` | cli-jaw 통합 release |
| 180 | `180_validation_matrix.md` | 검증 행렬 |
| 190 | `190_risks.md` | 리스크/중단 조건 |
| 200 | `200_execution_order.md` | 실제 실행 순서 |

## 이번 문서의 비범위

- 실제 cli-jaw/JWC 코드 구현은 하지 않는다.
- package name, npm org, branch protection 변경은 이 계획에서 후보와 게이트만 정한다.
- `_legacy/` 내부 문서는 보존 기록이다. 새 실행 판단은 이 폴더의 000-200 문서를 우선한다.
