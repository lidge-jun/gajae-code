# Beta v0.1 — 문서·구조 마감 (260612)

> **범위**: OSS **문서/지도** 마감. M1 코드 게이트(99.01–99.12) 완료 선언은 [99.12](./m1_closeout.md) · [99.00.00 MOC](../devlog/_plan/260612_jawcode_fork/99.00.00_moc_stabilization.md)가 소유한다.

## 한줄

**jawcode(jwc)** 를 upstream gjc 포크로 설명하는 **삼축 문서**(structure · struct_har · chase)와 **레디니스 기준선**을 한 세트로 고정했다. 실행 진입은 [README.jwc.md](../README.jwc.md) · [doc_map.md](./doc_map.md).

## 이번 마감에 닫은 것

| 항목 | 정본 |
|------|------|
| Patched SoT 허브 | [structure/README.md](./README.md) · [INDEX.md](./INDEX.md) |
| 문서 삼축 지도 | [doc_map.md](./doc_map.md) |
| M1 레디니스 MLB 50→62→68 | [jwc_readiness.md](./jwc_readiness.md) |
| 99 결정·패키지·착수 순서 | [m1_closeout.md](./m1_closeout.md) ← [99.00.00](../devlog/_plan/260612_jawcode_fork/99.00.00_moc_stabilization.md) |
| 양축 code facts | [struct_har/README.md](../struct_har/README.md) · [INDEX.md](../struct_har/INDEX.md) |
| omp 참조축 (13 밴드) | [struct_har/omp_origin/](../struct_har/omp_origin/README.md) |
| 갭·chase 플랜 (`10_*` / `20_*`) | [struct_har/chase/](../struct_har/chase/README.md) |
| 포크 파일 vs 동작 | [fork-delta.md](./fork-delta.md) · [fork_logic_changelog.md](./fork_logic_changelog.md) |
| 메모리 (설계 + jwc 표면) | [memory_pipeline.md](./memory_pipeline.md) · [docs/memory.md](../docs/memory.md) |
| 업스트림 클론 절차 | [conventions.md §2](./conventions.md) · [gitstructure.md](./gitstructure.md) |
| jwc 기여 안내 (beta) | [CONTRIBUTING.jwc.md](../CONTRIBUTING.jwc.md) |

## 아직 열린 것 (beta v0.1 밖)

| 항목 | 추적 |
|------|------|
| pabcd discovery M1/M2/M3 | **99.03** — 구현 대기 |
| `jwc memory` / `jwc chat` 마감·증거 | **99.01** — 어댑터·CLI 존재, 밴드 마감 ⬜ |
| `check:schemas` + biome + docs 슬라이스 | **99.02** — 마감 ⬜ |
| HUD · auth 게이트 · 슬래시 패리티 | **99.04–99.07** |
| M2 Node · cli-jaw attach | **100~** |
| jaw 릴리즈 노트 (jwc) | 미작성 — gjc `CHANGELOG` 상속 |

## OSS 표면 (현재)

| 자산 | 상태 |
|------|------|
| [LICENSE](../LICENSE) | MIT (gjc 상속) |
| [README.md](../README.md) | 업스트림 **gjc** 제품 설명 (수정 최소) |
| [README.jwc.md](../README.jwc.md) | **jwc** 포크·로드맵·문서 링크 |
| [NOTICE.md](../NOTICE.md) | 계보·속성 |
| `.github/workflows` | CI (gjc 모노레포) |
| jaw 전용 CONTRIBUTING | [CONTRIBUTING.jwc.md](../CONTRIBUTING.jwc.md) (beta 스텁) · 상세는 AGENTS.md + structure/conventions |

공개 **바이너리/패키지명**은 여전히 `@gajae-code/*` · `.jwc/` 런타임 경로([D4](./gitstructure.md)). 표면 명령·스킬은 jaw 어휘(`jwc`, `jaw-interview`, …).

## 착수 순서 (단일 정본)

**99.00.00** · **jwc_readiness** · **m1_closeout** · **chase/04_jwc_own_backlog** 는 아래 한 줄만 쓴다:

```text
99.01 → 99.02 → 99.03 → 99.04 → 99.05 → 99.06 → 99.07
```

드라이버 **MLB 62** 임계: **99.02 + 99.03** (CI green + pabcd discovery).

## 문서 정합 체크 (재스캔)

```bash
rg '99\.02 M1|99\.04 CI only|99\.04 \+ 99\.02|검색 API 없음|99\.04→99\.01' structure struct_har README.jwc.md docs --glob '*.md'
```

기대: **0건** (구현 상태는 🟡/마감·99.03/99.02/99.04 패키지 번호만).

## 갱신 규칙

- 99 MOC·레디니스 변경 → `jwc_readiness.md`, `m1_closeout.md`, `struct_har/jwc_patched/099_stabilization/`
- upstream fetch → `struct_har/gjc_origin/**`, HEAD 행 in README/INDEX/gitstructure
- chase 갭 → `struct_har/chase/02_gap_inventory.md` + 해당 `bands/`

*마감 기록: 2026-06-12 (beta v0.1 문서 세트). worktree HEAD는 갱신 시 conventions에 따라 cite.*