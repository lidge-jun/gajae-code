# status — M1/M2 마감 · 99 밴드 · readiness (정본 통합)

> 통합본(260613): 구 `beta_v0.1_closeout.md` + `m1_closeout.md` + `jwc_readiness.md`를 하나로 합침.
> 질문별 진입: **§1 지금 쓸 수 있나**(readiness) · **§2 무엇을 언제 고쳤나**(99 결정) · **§3 문서 마감**.
> 패키지 상세: [99.00.00 MOC](../devlog/_plan/260612_jawcode_fork/phase1/99.00.00_moc_stabilization.md).
> worktree HEAD는 갱신 시 [conventions.md](./conventions.md)에 따라 cite.

## 로드맵 축 (확정 260612)

| 구간 | 의미 | 정본 |
|---|---|---|
| **000–099** | jwc 만들기 (M1) | [000_roadmap](../devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md) |
| **100~** | cli-jaw 런타임 이식 (M2) | [100_moc](../devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md) · [111_design](../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md) |

M1 done = 090–099 release gate. **실질 드라이버 임계점 = 99.02 + 99.03** (CI green + pabcd discovery).

## 1. 지금 쓸 수 있나 (readiness)

**99 전부를 끝내야 쓸 수 있는 건 아니다.** 일반 코딩·세션·goal·수동 ralplan/interview·pabcd 반자율화는 동작.

| 단계 | MLB(20–80) | 범위 |
|---|---:|---|
| 지금 (260613) | **62** | 데일리 코딩 ⭕ · pabcd 반자율(99.03) · `jwc memory` CLI(99.01) · orchestrate reset/interview cancel(99.07 U1/U2) · settings 픽스(99.20) |
| 99.02+99.03 후 | **62** | + CI green — 드라이버 임계점 |
| 99.01~99.07 마감 후 | **68** | memory CLI · HUD · 슬래시 패리티 |

지금 되는 것: `jwc` 기동/모델·effort/세션 `-c`·`-r`/`/compact`·`/export`, `jwc interview|ralplan|goal *`,
`/orchestrate` 단계 전이(자율), `jwc memory search/read/save/context`·`jwc chat search`,
`jwc orchestrate reset`(U1)·`jwc interview cancel`(U2).

인프라: 스플릿브레인 없음(jwc는 `~/.jwc/`만). β goal `3f6989ac`는 99와 별도.

## 2. 무엇을 언제 고쳤나 (99 결정·구현)

| ID | 결정 | 상태 |
|---|---|---|
| D10 | 사용자 명령 = cli-jaw 어휘(`jwc orchestrate/goal/memory`) | orchestrate/goal 런타임 ✅ · memory CLI ✅(`ada449b2`) |
| 99.03-M1 | 시스템 프롬프트에 native IPABCD discovery | ✅(`45cba4e2`) |
| 99.03-M2 | 매 턴 `pabcd-stage-context` 헤더 | ✅(`8a7ea342`) |
| 99.03-M3 | 스테이지 프롬프트 자가 전이 | ✅(`90ef5223`) |
| 99.01 | `jwc memory *` + `jwc chat search` | ✅(`ada449b2`·`693c5ee0`·`56fcf0de`) |
| 99.02 | CI: schemas + biome + docs | 코드 ✅ / 마감 ⬜ (PR 게이트, 런타임 무관) |
| 99.04 | HUD `.gjc/`→`.jwc/` 정정 + 세그먼트 | 설계 ✅ / 구현 ⬜ |
| 99.07 | 슬래시 패리티 + reset(U1)·cancel(U2) | U1/U2 ✅; 패리티 잔여 |

**착수 순서 (단일 정본)**: `99.01 → 99.02 → 99.03 → 99.04 → 99.05 → 99.06 → 99.07`. MLB 62 임계 = 99.02+99.03.

문서 동기화: `system-prompt.md`(99.03)→`prompt_flow.md`·`workflows.md`·`fork-delta.md`;
`memory` CLI(99.01)→`memory_pipeline.md`·`extensibility.md`; readiness/MOC 변경→본 문서 + 99.00.00.

## 3. M2 (100~) — 100 밴드 완료 (260613)

- **100 Node 포팅 ✅**: `dist-node/` esbuild 번들 + `src/shims/`(Bun→Node), Node22 SDK import·
  createAgentSession·스트리밍 green, 적대 감사 1–5 통과(path traversal·archive mtime·serve TLS·
  PK-tar 포함, `0debe38b`·`40a4a2f0`). 커밋 `2e9efc59`…`fba5cd56`, closeout `fdb8d41d`.
  [packages_overview.md](./packages_overview.md) · [100_moc](../devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md)
- 110–130 JawRuntime·jaw.db·주입: 설계만 ([111](../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md))

## 4. 문서/OSS 마감 (beta v0.1, 260612)

삼축 문서(structure · [struct_har](../struct_har/README.md) · [chase](../struct_har/chase/README.md)) +
readiness 기준선 고정. OSS 표면: [LICENSE](../LICENSE)(MIT 계보), [README.md](../README.md)/
[README.jwc.md](../README.jwc.md), [NOTICE.md](../NOTICE.md), [CONTRIBUTING.jwc.md](../CONTRIBUTING.jwc.md).

남은 것(beta 밖): pabcd discovery 잔여(99.03)·CI 마감(99.02)·HUD/auth/슬래시(99.04–07)·M2(100~).

## struct_har 밴드 매핑

| 축 | 경로 |
|---|---|
| upstream gajae-code | `struct_har/gjc_origin/<band>/` |
| jaw fork | `struct_har/jwc_patched/<band>/` |
| omp 상류(참조) | `struct_har/omp_origin/<band>/` |
| chase(갭) | `struct_har/chase/` (`10_*`·`20_*`) |

*갱신: readiness·99 MOC·100 밴드 상태 변경 시 본 문서 + 99.00.00 정본을 함께 맞춘다.*
