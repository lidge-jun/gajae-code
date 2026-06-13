# M1 마감 — 99 밴드·결정 정본 (structure)

> **질문별 진입**: [jwc_readiness.md](./jwc_readiness.md) (지금 쓸 수 있나) · 본 문서 (무엇을 언제 고쳤나/고칠 예정인가) · [99.00.00 MOC](../devlog/_plan/260612_jawcode_fork/phase1/99.00.00_moc_stabilization.md) (패키지 상세).

## 로드맵 축 (확정 260612)

| 구간 | 의미 | 정본 |
|---|---|---|
| **000–099** | jwc 만들기 (M1) | [000_roadmap.md](../devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md) |
| **100~** | cli-jaw 런타임 이식 (M2) | [100_moc](../devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md) · [111_design_runtime_attach](../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md) |

M1 done = 090–099 release gate. **실질 드라이버 임계점**은 99 전체가 아니라 **99.02 + 99.03** (레디니스 62).

---

## 인터뷰·플랜 결정 (99와 연결)

| ID | 결정 | structure 반영 | 구현 상태 |
|---|---|---|---|
| **D10** | 사용자 표면 명령은 cli-jaw 어휘 (`jwc orchestrate`, `jwc goal`, `jwc memory` …) | [workflows.md](./workflows.md), [051_design_command_port](../devlog/_plan/260612_jawcode_fork/phase1/051_design_command_port.md) | orchestrate/goal **런타임 ✅** · memory CLI ✅ **99.01 완료** (`ada449b2`) |
| **99.03-M1** | 시스템 프롬프트에 **native IPABCD orchestration** discovery | [prompt_flow.md](./prompt_flow.md) §99.03 | ✅ 완료 (`45cba4e2`) |
| **99.03-M2** | [확정] 매 턴 `pabcd-stage-context` (cli-jaw `getPrefix()` 동형) | `agent-session.ts` | ✅ 완료 (`8a7ea342`) |
| **99.03-M3** | 스테이지 프롬프트 말미 자가 전이 (`jwc orchestrate <next>`) | `prompts/jaw/orchestrate-*.md` | ✅ 완료 (`90ef5223`) |
| **99.03 jwc surface** | [확정] hard rename ❌ — 스킬 **속성·경로 무변경**, 산문에 IPABCD 우산만 | `system-prompt.md` | ⬜ (ralplan slug·`.jwc/plans/ralplan/` 유지) |
| **99.01** | `jwc memory search/read/save/context` + `jwc chat search` | [memory_pipeline.md](./memory_pipeline.md) | ✅ 구현 완료 (`ada449b2`·`693c5ee0`·`56fcf0de`) |
| **99.04** | HUD — 문서 legacy `.gjc/` → `.jwc/` 정정 + 세그먼트 | struct_har 085 이관 | 설계 ✅ / 구현 ⬜ |
| **99.02** | CI: `config.schema.json` + biome + docs 마감 | — | 코드 ✅ / 마감 ⬜ |
| **99.07** | 슬래시 패리티 + `orchestrate reset`(U1)·`interview cancel`(U2) | [workflows.md](./workflows.md) | ✅ U1(`2cf37f35`)·U2(`c0ca9a53`) 완료; 슬래시 패리티 잔여 조사 중 |

**제외**: Phase β goal `3f6989ac` (struct_har/Node) — 99에 흡수 안 함.

---

## 런타임 vs 모델 인지 (핵심 갭)

| 층 | 050 밴드 구현 | 모델 discovery (260612) |
|---|---|---|
| CLI / slash | `jwc orchestrate`, `/orchestrate i\|p\|a\|b\|c\|d` ✅ | — |
| state machine | `orchestrate-state.ts`, `pabcd-state.json` ✅ | — |
| stage prompts | `orchestrate-runtime.ts`, `prompts/jaw/orchestrate-*.md` ✅ | pull only (사용자/모델이 CLI 실행 시) |
| system prompt | 4 bundled skills + routing | ✅ **orchestrate/IPABCD 등재** (99.03 M1, `45cba4e2`) |
| 매 턴 헤더 | plan/goal 레일만 | ✅ **pabcd 헤더 주입** (99.03 M2, `8a7ea342`) |
| dev-pabcd 스킬 | — | jaw 브랜드에서 **차단** (`skills.ts`) — native 표면으로 대체(99.03) |

근거: [99.00.01](../devlog/_plan/260612_jawcode_fork/phase1/99.00.01_audit_jwc_readiness.md) §4–5, [99.02.00](../devlog/_plan/260612_jawcode_fork/phase1/99.03.00_plan_workflow_surface_revision.md).

---

## 착수 순서 (사용자 확정)

```
99.01 → 99.02 → 99.03 → 99.04 → 99.05 → 99.06 → 99.07
```

- 정본: [99.00.00](../devlog/_plan/260612_jawcode_fork/phase1/99.00.00_moc_stabilization.md) · [beta_v0.1_closeout](./beta_v0.1_closeout.md). 99.01(memory)와 99.02(CI)는 병렬 가능; MLB 62는 **99.02+99.03**.
- 99.03 구현은 **99.03.01** 스펙 + co-update: `fork-delta.md`, `workflow-surface-orchestrate.test.ts`, `pabcd-stage-header.test.ts`.

---

## M2 (100~)

| 밴드 | 내용 | 상태 | struct_har |
|---|---|---|---|
| 100 | Node 셰임·sqlite·stream 테스트 | ✅ **완료 (260613)** — `dist-node/`+`src/shims/`, SDK import·스트리밍 green, 감사 라운드 1-3 통과 (`2e9efc59`…`fba5cd56`) | [100_node](../struct_har/jwc_patched/100_node/), [packages_overview.md](./packages_overview.md) |
| 110–130 | JawRuntime · jaw.db · 주입 | 설계만 | [111](../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md) |
| 선행 | M1 030 brand-aware discovery (`GJC_BRAND_NAME=jwc`) | [030_skills](../struct_har/jwc_patched/030_skills/) |

---

## 문서 동기화 (99 구현 시)

| 변경 | 갱신 |
|---|---|
| `system-prompt.md` (99.03 M1) | `prompt_flow.md`, `workflows.md`, `fork-delta.md`, `struct_har/jwc_patched/020_prompt/*`, `050_plan/*`, `099_stabilization/*` |
| `agent-session` M2 | `prompt_flow.md` 레일 표, `struct_har/.../020_prompt/02_logic_changes` |
| `memory` CLI (99.01) | `memory_pipeline.md`, `extensibility.md`, `070_memory/*` |
| 레디니스·MOC 상태 | `jwc_readiness.md`, `m1_closeout.md`, `99.00.00` MOC |

---

## struct_har 밴드 매핑

| 축 | 경로 |
|---|---|
| upstream gajae-code | `struct_har/gjc_origin/<band>/` |
| jaw fork | `struct_har/jwc_patched/<band>/` |
| **omp 상류** | `struct_har/omp_origin/<band>/` (참조, fork 아님) |
| **chase** | `struct_har/chase/` — `10_*` `20_*` · [05](../struct_har/chase/005_devlog_numbering.md) |
| **chase 완료** | `struct_har/chase/_legacy/` |
| 99 GG | struct_har / structure |
|---|---|
| 99.01 | `070_memory`, `memory_pipeline.md` (+ `omp_origin/070_memory` mnemopi 참고) |
| 99.02 | (횡단 CI·schemas·biome) |
| 99.03 | `020_prompt`, `050_plan`, `099_stabilization` |
| 99.04 | `080_tui`, `099_stabilization` |
| 100+ | `100_node`, `architecture/` (삼축) |

*갱신: 99 MOC·레디니스·99.03.01 PASS 변경 시 본 문서 + `jwc_readiness.md`.*