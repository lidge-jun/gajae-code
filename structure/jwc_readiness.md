# jwc 데일리 드라이버 준비 상태 (기준선)

> **정본**: [99.00.01_audit_jwc_readiness.md](../devlog/_plan/260612_jawcode_fork/phase1/99.00.01_audit_jwc_readiness.md) (READ-ONLY 감사, 260612).  
> **마스터플랜**: [99.00.00_moc_stabilization.md](../devlog/_plan/260612_jawcode_fork/phase1/99.00.00_moc_stabilization.md).  
> worktree @ `81bcea96` (감사 시점).
> **결정·패키지 맵**: [m1_closeout.md](./m1_closeout.md).

## 한줄 평결

**99 전부를 끝내야만 쓸 수 있는 건 아님.** 지금도 일반 코딩·세션·goal·수동 ralplan/interview는 동작. **데일리 드라이버 실질 임계점**은 **99.02 + 99.03** (pabcd discovery·CI green).

## MLB 등급 (20–80 스케일)

| 단계 | 점수 | 범위 |
|---|---:|---|
| **지금** (260613 갱신) | **62** | 데일리 코딩 ⭕ · pabcd 반자율화 ✅(99.03) · `jwc memory` CLI ✅(99.01) · orchestrate reset/interview cancel ✅(99.07 U1/U2) · settings 크래시/휠/배너/fast 픽스 ✅(99.20) |
| 99.02 + 99.03 후 | **62** | pabcd 반자율화 + CI green — **드라이버 임계점** |
| 99.01~99.07 마감 후 | **68** | memory CLI · HUD · 슬래시 패리티 |

## 지금 쓸 수 있는 것

- `jwc` 기동, 모델/쿼ota/effort, 파일·도구, 세션 `-c`/`-r`, `/compact`, `/export`
- `jwc interview`, `jwc ralplan`, `/skill:jaw-interview`, `jwc goal *`, `/orchestrate` 단계 전이 (자율 포함, 99.03 이후)
- `jwc memory search/read/save/context`, `jwc chat search` (99.01 완료)
- `jwc orchestrate reset` (99.07-U1), `jwc interview cancel` (99.07-U2)

## CRITICAL 블로커 3 (99 밴드)

| # | 갭 | 패키지 | 상태 (260612 저녁) |
|---|---|---|---|
| 1 | pabcd discovery M1/M2/M3 | **99.03** | ✅ 완료 (`45cba4e2`·`8a7ea342`·`90ef5223`) — 시스템 프롬프트 등재 + 매 턴 헤더 + 자가 전이 |
| 2 | `jwc memory search/read/save/context` | **99.01** | ✅ 구현 완료 (`ada449b2`·`693c5ee0`·`56fcf0de`) — memory-runtime/local-query/memory-fts·CLI·Task Snapshot 주입 전 착지 |
| 3 | `check:schemas` stale + biome 7건 | **99.02** | 코드 ✅ / **마감** ⬜ (런타임 무관, PR 게이트) |

## 인프라 확인 (감사)

- **스플릿브레인 없음**: Phase β `.jwc` 스윕 완료; jwc는 `~/.jwc/`만 사용. `~/.jwc/`는 upstream gajae-code 계열 바이너리와 격리.
- **테스트**: `ask.test`, `state-read-markdown` 등 wip 이후 **통과** (99.02 잔여는 스키마·biome·docs).
- **β goal** `3f6989ac` (struct_har/Node): 99와 **별도** — [99.00.00 §제외](../devlog/_plan/260612_jawcode_fork/phase1/99.00.00_moc_stabilization.md).

## 착수 순서 (사용자 확정)

`99.01` → `99.02` → `99.03` → `99.04` → `99.05` → `99.06` → `99.07`

## M2 (100~) — 100밴드 구현 완료 (260613)

- **100** Node 포팅: ✅ **완료** — `dist-node/` esbuild 번들 + `src/shims/`(Bun→Node 셰임), Node 22 SDK import·createAgentSession·스트리밍 green, 적대 감사 라운드 1-4 통과(보안: archive long-name tar path traversal·archive mtime·serve TLS/disconnect 포함, `0debe38b`). [packages_overview.md](./packages_overview.md) M2 행·[100_moc_node_porting.md](../devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md) · 커밋 `2e9efc59`…`fba5cd56`, closeout `fdb8d41d`
- **111** 런타임 부착 설계: [111_design_runtime_attach.md](../devlog/_plan/260612_jawcode_fork/111_design_runtime_attach.md) — 100→110→120→130 체인; **100 밴드 실측 보강** 진행 중(260612)

## struct_har

- 99 밴드 스냅샷: [struct_har/jwc_patched/099_stabilization/](../struct_har/jwc_patched/099_stabilization/)
- 갭·upstream/omp 참조: [struct_har/chase/](../struct_har/chase/README.md)

*갱신: 레디니스·MOC 변경 시 본 문서 요약 + 99.00.01 정본을 함께 맞춘다.*