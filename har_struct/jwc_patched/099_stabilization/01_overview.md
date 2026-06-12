# 099_stabilization — 01 overview (99 밴드 안정화 감사, 260612)

> 99 밴드(잔여 작업 통합) 착수 전 병렬 조사 8기의 스냅샷 요약. 본 밴드는 README의 STALE 기준선 이후
> 추가분이라 β 재생성 시에도 유지·갱신 대상. 정본: `devlog/_plan/260612_jawcode_fork/99.00.00_moc_stabilization.md`
> + `structure/prompt_flow.md` §주입 레일 + `structure/memory_pipeline.md`.

## 조사 대상과 결론 (8기)

| # | 대상 | 핵심 결론 |
|---|------|----------|
| 1 | jwc 시스템 프롬프트 합성 | 세션 시작 1회 조립·캐시. 매 턴 주입 레일 7종 존재 (memory 훅·plan/goal custom message·스킬 통주입·TTSR×2·plan 리마인더) — `structure/prompt_flow.md` §주입 레일 |
| 2 | cli-jaw PABCD 주입 (원본) | 4층 push: orchestration.md 상주 + 모델 자가 전이(Bash) + `getPrefix()` 매 턴 헤더 + A/B/C plan 재주입(DB, 컴팩션 면역). 스킬 본문·A/B/C/D 스테이지 프롬프트는 pull |
| 3 | jwc memories 엔진 | startup 단일 트리거 stage1→phase2; 읽기 주입은 memory_summary.md 1파일; **검색 함수 전무** — 99.01이 local-query.ts 신설. `structure/memory_pipeline.md` |
| 4 | cli-jaw memory (원본) | structured md + FTS5(unicode61+trigram) + BM25 + RRF + synonyms + kind/recency 랭킹; 매 턴 Profile/Soul/Task Snapshot(4건 2800c) 주입. degradation 10건 채록 |
| 5 | 상태줄 세그먼트 인프라 | 085 문서 앵커 대부분 유효. 단 전 085 문서 `.gjc/` 경로는 실코드 `.jwc/`와 불일치(이관 시 정정), verify-gjc-ui-redesign.ts의 "세그먼트 allowlist 게이트"는 실존하지 않음(신설 필요). 권장 피드: dir-watch + 1s TTL 폴 |
| 6 | 시스템 프롬프트 가드 지도 | `"exactly four"` 핀 테스트 **0건** — 산문 개정 블래스트 0. 카운트 가드 3종은 번들 스킬 디렉토리 수만 검사(orchestrate native 표면 비대상). 불변 문장 2개(decomposition/runtime-state). fork-delta HARD-EDIT 동행 갱신 의무 |
| 7 | 워크플로 명칭 규격 | hard rename(ralplan→pabcd-p)은 14+ 파일 + `.jwc/plans/ralplan/` 디스크 경로 연쇄 → **re-facing**(시스템 프롬프트 라벨에 IPABCD 우산) 제안, D050-13/14·R14 호환 |
| 8 | cli-jaw↔jwc 슬래시 패리티 | `/goal` 의미 분기(ledger CRUD vs 모드 토글), `/plan`·`/interview`·`/team` 슬래시 부재, memory CRUD CLI 부재(99.01 해소 예정), dispatch/employee 비이식 확정 — 99.07 패키지 |

## 파생 산출물

- `devlog/_plan/260612_jawcode_fork/99.02.00_plan_workflow_surface_revision.md` — discovery 브리지 설계 (M1/M2/M3)
- 070~072 → 99.01.00~02 이관 (구 위치는 리다이렉트 스텁), 085 HUD → 99.03 이관 (`.gjc/`→`.jwc/` 정정 동반)
- `structure/prompt_flow.md` 주입 레일·cli-jaw 대조 섹션, `structure/memory_pipeline.md` 신설

## cli-jaw 참조 기준선

- 소스: `/Users/jun/Developer/new/700_projects/cli-jaw` (260612 시점) — `src/prompt/builder.ts`,
  `src/orchestrator/state-machine.ts`, `src/agent/spawn.ts`, `src/memory/*`, `src/core/compact.ts`
- gjc_origin/jwc_patched 양축 외 제3 참조축이므로 code facts는 cli-jaw repo 경로로 cite한다.
