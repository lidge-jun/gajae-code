# jwc 데일리 드라이버 준비 상태 (기준선)

> **정본**: [99.00.01_audit_jwc_readiness.md](../devlog/_plan/260612_jawcode_fork/99.00.01_audit_jwc_readiness.md) (READ-ONLY 감사, 260612).  
> **마스터플랜**: [99.00.00_moc_stabilization.md](../devlog/_plan/260612_jawcode_fork/99.00.00_moc_stabilization.md).  
> worktree @ `81bcea96` (감사 시점).
> **결정·패키지 맵**: [m1_closeout.md](./m1_closeout.md).

## 한줄 평결

**99 전부를 끝내야만 쓸 수 있는 건 아님.** 지금도 일반 코딩·세션·goal·수동 ralplan/interview는 동작. **데일리 드라이버 실질 임계점**은 **99.02 + 99.03** (pabcd discovery·CI green).

## MLB 등급 (20–80 스케일)

| 단계 | 점수 | 범위 |
|---|---:|---|
| **지금** | **50** | 데일리 코딩 ⭕ · pabcd 자율 ❌ · `jwc memory` CLI ❌ |
| 99.02 + 99.03 후 | **62** | pabcd 반자율화 + CI green — **드라이버 임계점** |
| 99.01~99.07 마감 후 | **68** | memory CLI · HUD · 슬래시 패리티 |

## 지금 쓸 수 있는 것

- `jwc` 기동, 모델/쿼ota/effort, 파일·도구, 세션 `-c`/`-r`, `/compact`, `/export`
- `jwc interview`, `jwc ralplan`, `/skill:jaw-interview`, `jwc goal *`, `/orchestrate` **수동** 단계 전이
- **한계**: "pabcd 진행해" → 모델이 `/orchestrate`를 **스스로** 쓰지 않음 (시스템 프롬프트에 orchestrate **0언급**)

## CRITICAL 블로커 3 (99 밴드)

| # | 갭 | 패키지 | 상태 (260612 저녁) |
|---|---|---|---|
| 1 | pabcd discovery M1/M2/M3 | **99.03** | 설계 확정 + [99.03.01](../devlog/_plan/260612_jawcode_fork/99.03.01_impl_workflow_surface.md) **독립 감사 PASS v2** — 구현 대기 |
| 2 | `jwc memory search/read/save/context` | **99.01** | 🟡 `memory-runtime.ts`·CLI 존재 — [99.01.03](../devlog/_plan/260612_jawcode_fork/99.01.03_impl_memory_merge.md) 밴드 마감 중 |
| 3 | `check:schemas` stale + biome 7건 | **99.02** | 코드 ✅ / **마감** ⬜ (런타임 무관, PR 게이트) |

## 인프라 확인 (감사)

- **스플릿브레인 없음**: Phase β `.jwc` 스윕 완료; jwc는 `~/.jwc/`만 사용. `~/.jwc/`는 upstream gjc 바이너리 격리.
- **테스트**: `ask.test`, `state-read-markdown` 등 wip 이후 **통과** (99.02 잔여는 스키마·biome·docs).
- **β goal** `3f6989ac` (struct_har/Node): 99와 **별도** — [99.00.00 §제외](../devlog/_plan/260612_jawcode_fork/99.00.00_moc_stabilization.md).

## 착수 순서 (사용자 확정)

`99.01` → `99.02` → `99.03` → `99.04` → `99.05` → `99.06` → `99.07`

## M2 (100~) — 문서만

- **100** Node 포팅: M1 범위 밖, ⬜ — [100_moc_node_porting.md](../devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md)
- **111** 런타임 부착 설계: [111_design_runtime_attach.md](../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md) — 100→110→120→130 체인; **100 밴드 실측 보강** 진행 중(260612)

## struct_har

- 99 밴드 스냅샷: [struct_har/jwc_patched/099_stabilization/](../struct_har/jwc_patched/099_stabilization/)
- 갭·gjc/omp 참조: [struct_har/chase/](../struct_har/chase/README.md)

*갱신: 레디니스·MOC 변경 시 본 문서 요약 + 99.00.01 정본을 함께 맞춘다.*