# 120 MOC — 세션 jaw.db 영속화 (resume/steer 재발명)

> 상태: ⬜. 결정 근거: D6 [확정] — 임베디드 런타임 세션 정본 = jaw.db. 구 02 §세션 승계.

## 현재 문제 (대체 대상)

- cli-jaw resume = 벤더 CLI 세션 ID 역추적 (`src/agent/resume-classifier.ts`, `session-persistence.ts`,
  `spawn/resume.ts`) — 깨지기 쉬움 (AGY resume 버그 이력: stale continuation, trace 누출)
- steer = kill-respawn (`steerAgent`)

## 목표 모델

- 메시지 배열이 in-process 소유물:
  - **resume** = jaw.db에서 메시지 로드 → 세션 재구성 (역추적 소멸)
  - **steer** = 살아있는 루프에 메시지 push (kill-respawn 소멸)

## 스코프

1. 메시지 영속화 어댑터: gjc 세션 메시지 ↔ jaw.db `messages` 테이블 양방향 매핑
   (도구 호출/결과 블록의 tool_log 직렬화 포함)
2. resume: 서버 재시작 후 세션 풀 재구성 — [기본값] lazy(첫 메시지 시 로드), eager 옵션
3. steer: cli-jaw `/steer` → JawRuntime 진행 중 루프에 주입 (gjc 루프의 메시지 큐 지점 실사)
4. 컴팩션 연계: gjc 자체 컴팩션과 cli-jaw compact 핸드오프 중복 방지 — [기본값] gjc 컴팩션 사용,
   cli-jaw 쪽 compact 트리거는 위임 호출로
5. resume-classifier 우회: cli='jwc'일 때 기존 resume 계층 전체 스킵

## [기본값] 결정

- gjc agent db(세션/히스토리)는 내부 캐시로 유지하되 **정본은 jaw.db** — 충돌 시 jaw.db 승
- 트랜잭션 경계: 메시지 단위 커밋 (스트리밍 중간은 메모리만, 완료 시 1회 기록 — AGY 진행문 저장 버그 교훈)

## 완료 기준

- 서버 재시작 → 이어서 대화 e2e (내용 연속성 검증)
- 실행 중 steer 주입 → kill 없이 반영 e2e
- 이전 대화 raw/tracker 누출 0건 (AGY 회귀 케이스를 테스트로 승계)

## 열린 질문

- jaw.db 스키마 확장 필요 항목 (gjc 메시지 구조 대비 부족 컬럼) — 착수 시 매핑 표로 확정
- 히스토리 길이 한계와 로드 페이징
