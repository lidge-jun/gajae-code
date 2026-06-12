# 099_stabilization — 01 overview (99 밴드)

> **역할**: M1 마감 전 **잔여 작업 통합(99 밴드)** + 레디니스 기준선. β struct_har 재생성과 별도로 유지.
> 정본 MOC: [99.00.00_moc_stabilization.md](../../../devlog/_plan/260612_jawcode_fork/phase1/99.00.00_moc_stabilization.md)

## 레디니스 (99.00.01, 260612)

| MLB | 의미 |
|---:|---|
| **50** | 지금 — 코딩 보조 ⭕, pabcd 자율 ❌, memory CLI ✅ |
| **62** | 99.02 + 99.03 후 — **데일리 드라이버 임계점** |
| **68** | 99.01~07 마감 후 |

요약 SoT: [jwc_readiness.md](../../../structure/jwc_readiness.md) · [m1_closeout.md](../../../structure/m1_closeout.md) · [beta_v0.1_closeout.md](../../../structure/beta_v0.1_closeout.md)

## 99 패키지 현황 (MOC 도장, 260612 저녁 — 260612 번호 재정렬: lexicographic=착수 순서)

| GG | 패키지 | 상태 |
|---|---|---|
| 99.01 | memory CLI | **구현 완료** ✅ |
| 99.02 | 병렬 랜딩·CI (구 99.04) | 플랜 ✅ / 마감 ⬜ — schemas+biome+docs |
| 99.03 | pabcd discovery + 표면 re-facing (구 99.02) | [99.03.01](../../../devlog/_plan/260612_jawcode_fork/phase1/99.03.01_impl_workflow_surface.md) **독립 감사 PASS v2** — **구현 착수 가능** (99.02 선행) |
| 99.04 | Workflow HUD (구 99.03) | 설계 ✅ / 구현 ⬜ (085 이관·`.jwc/` 경로 정정) |
| 99.05~07 | auth 게이트·문서 스윕·슬래시 패리티 | MOC/조사 단계 |
| 99.07 | U1/U2 orchestrate reset·interview cancel | **랜딩 완료** ✅ (커밋 e0fba53c) |
| 99.09 | 컴포저 핀·floor·압축·B2-lite·sticky gap | **랜딩 완료** ✅ §8~§12 (커밋 b4f7025c·c3b648af) |
| 99.20 | ask UX·commit-time 접기·설정 표기·/fast 영속 | **진행 중** — 99.20.01 ✅ · 99.20.03 트리거 ✅ · 99.20.04 v1 ✅ · 99.20.05 ✅ |

**착수 순서**: `99.01 → 99.02 → 99.03 → 99.04 → 99.05 → 99.06 → 99.07`

## 8기 조사 요약 (260612)

| # | 주제 | 결론 |
|---|---|---|
| 1 | 시스템 프롬프트 | 매 턴 주입 레일 7종 — [prompt_flow.md](../../../structure/prompt_flow.md) |
| 2 | cli-jaw PABCD | 4층 push vs jwc pull 스킬 |
| 3 | jwc memory | `local-query`·CLI 🟡 → **99.01** 마감·증거 |
| 4 | cli-jaw memory | FTS/BM25/RRF — 99.01 패리티 목표 |
| 5 | HUD 인프라 | 085 legacy `.gjc/` 문서 드리프트 → **99.04**에서 `.jwc/` 정정 |
| 6 | 프롬프트 가드 | orchestrate 비대상; fork-delta 동행 갱신 |
| 7 | 명칭 | hard rename 대신 **IPABCD re-facing** (**99.03**) |
| 8 | 슬래시 패리티 | `/interview`·`/plan` 등 갭 → 99.07 |

## CRITICAL (레디니스)

1. **pabcd discovery 0** — `system-prompt.md`에 orchestrate 미노출 → **99.03 M1/M2/M3** ← **CRITICAL 잔여**
2. ~~**`jwc memory *` CLI 마감** → **99.01**~~ ✅ **완료**
3. **check:schemas + biome** → **99.02** (CI only)

## M2 / 100 밴드 (참고)

- 로드맵: **000–099 = M1**, **100~ = M2** cli-jaw 상주 — [000_roadmap.md](../../../devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md)
- **111** 통합 설계: cli-jaw `jwc/sdk` 부착 — [111_design_runtime_attach.md](../../../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md)
- **100** Node 베이스라인: ⬜ — struct_har [100_node](../100_node/)

## 관련

- [02_logic_changes.md](./02_logic_changes.md)
- [02_code_facts.md](./02_code_facts.md) (있을 경우)
- 제외: β goal `3f6989ac` — 99에 흡수 안 함 (MOC §제외)