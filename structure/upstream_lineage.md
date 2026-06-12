# Upstream lineage — omp · gjc · jawcode

> **Pi** (badlogic/pi-mono) → **oh-my-pi (omp)** → **gajae-code (gjc)** → **jawcode (jwc 표면)**.  
> jawcode는 gjc 0.4.4 포크이며, 엔진 식별자(`.jwc/` 런타임 경로, `@gajae-code/*`, `GJC_*` env)는 Phase β 이후에도 대부분 유지한다.

## 한 줄 비교

| | omp | gjc (upstream) | jawcode (jwc) |
|---|---|---|---|
| CLI bin | `omp` | `gjc` | **`jwc`** (단일 진입, gjc 셸 패키지 제거) |
| npm scope | `@oh-my-pi/*` | `@gajae-code/*` | `@gajae-code/*` 유지 + `packages/jwc` |
| default interview | (워크플로 4종 없음 — omp 자체 스킬/`.omp`) | `deep-interview` | **`jaw-interview`** |
| config dir | omp 관례 | `.gjc/` → 업스트림도 `.jwc` 전환 중 | **`.jwc/`** 런타임 표준 |
| 문서 SoT | upstream README + docs/ | AGENTS.md (수정 금지 in fork) | **structure/** + devlog |

## 왜 omp 축이 필요한가

- gjc는 Yeachan-Heo/gajae-code로 **omp 계열 포크**다. 패키지 수·도구 표면·catalog 분리(omp의 `pi-catalog`)가 gjc와 다르다.
- jawcode 리베이스는 **gjc upstream**이 1차; omp는 **기능/아키텍처 선행 참고** (도구 벤치, worker host, LSP/DAP 깊이).
- 분석 스냅샷: [struct_har/omp_origin/](../struct_har/omp_origin/README.md).

## jawcode에서 보존 vs 바꾼 것 (D4 요약)

**보존 (리베이스 비용)**

- `@gajae-code/*` 워크스페이스
- `packages/coding-agent/` 코어 (HARD-EDIT는 fork-delta.md 추적)
- upstream `AGENTS.md` 파일 자체 (fork는 structure에 jaw 컨텍스트)

**표면 (jwc)**

- bin·브랜딩·번들 스킬 slug (`jaw-interview`)
- 시스템 프롬프트 Jaw 아이덴티티 (085 밴드)
- 사용자 명령 어휘 목표: cli-jaw 정렬 (`jwc orchestrate`, `jwc goal`, …)

## 동기화 작업

| 이벤트 | 갱신 |
|---|---|
| `git fetch upstream` + rebase | `structure/gitstructure.md`, `struct_har/gjc_origin/**` |
| `devlog/_upstream_omp` fetch | `struct_har/omp_origin/**` + `bun struct_har/_scripts/struct-har-regenerate-omp.ts`, 본 문서 |
| 포크 밴드 완료 | `structure/*`, `struct_har/jwc_patched/**`, `fork-delta.md` |

*마지막 갱신: 2026-06-13.*