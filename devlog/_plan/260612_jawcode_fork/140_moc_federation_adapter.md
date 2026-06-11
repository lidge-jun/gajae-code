# 140 MOC — Federation 검색 어댑터 (후순위)

> 상태: ⬜. 결정 근거: D9 [확정] — jwc 세션을 dashboard chat search에 노출. M2 done 이후 안정화 밴드.

## 코드 사실 (04 로그 R3 조사 승계)

- cli-jaw L2: `src/manager/memory/chat-federation.ts` `searchChatFederated()` —
  인스턴스별 jaw.db를 readonly로 열어 `messages.content` LIKE 스캔.
  `probeSchema()`가 messages 테이블 없으면 schema_mismatch로 스킵 → **jwc 세션 db는 현재 비가시**
- gjc 세션: `history` 테이블 + `history_fts` FTS (history-storage.ts:83) — 검색은 jwc 쪽이 오히려 빠름
- cli-jaw L1/L2의 LIKE 풀스캔 → FTS5 전환은 **별도 프로젝트** (jawcode 범위 밖 [확정 D9])

## 스코프

1. probeSchema 확장: gjc `history` 스키마 감지 → 전용 쿼리 경로 (가능하면 history_fts MATCH 활용)
2. 결과 매핑: history 행 → `ChatSearchHit` (instanceId는 [기본값] `jwc:<agentDir basename>` 의사 인스턴스)
3. 등록 경로: [기본값] dashboard instances 레지스트리에 jwc 세션 db 경로를 옵트인 등록
   (`cli-jaw dashboard memory instances` 표면 재사용)
4. 대량 데이터 가드: LIMIT/days 필터를 FTS 쿼리에 위임 — "존나 많은 대화" 케이스의 응답시간 측정 기록

## 완료 기준

- `cli-jaw dashboard chat search "<q>"`가 jwc 단독 세션 히트 반환 (출처 표시 포함)
- 10만+ 메시지 합성 데이터에서 검색 p95 측정·기록 (FTS 경로 검증)
- 미등록 시 기존 동작 무회귀 (옵트인)

## 열린 질문

- jwc 세션 db가 여러 프로젝트에 흩어질 때(워크트리별 `.gjc/`) 수집 범위 — [기본값] 홈 레벨만 1차
- 양방향(메모리 federation까지)은 후속 — 070 포맷 호환이 전제
