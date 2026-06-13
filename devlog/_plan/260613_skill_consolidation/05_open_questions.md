# 미결정 사항 + 확정 결정 로그

> 260613 유저 인터뷰 기반

## 확정된 결정

| # | 결정 | 출처 |
|---|---|---|
| D1 | ultragoal → goal (사용자 대면), 엔진 내부도 파일/타입 리네임 | 유저 |
| D2 | ralplan → orchestrate p (스킬 표면 제거), CLI+런타임 유지 | 유저 |
| D3 | I/P 진입은 유저가 판단. I는 유저 인터랙티브. goal은 I 안 탐 | 유저 |
| D4 | P→A: plan 문서화 + 유저에게 설명 후 유저 확인 | 유저 |
| D5 | B = self-verify (구현+자체검증), C = cross-verify (교차검증) | 유저 |
| D6 | D→IDLE: standalone PABCD는 여기서 끝 | 유저 |
| D7 | goal = PABCD를 여러 사이클 돌릴 수 있게 하는 래퍼 | 유저 |
| D8 | goal→PABCD는 프로그래밍적 디스패처 아님. 에이전트가 IDLE에서 goal 보고 P 재진입 판단 | 유저 |
| D9 | standalone PABCD = HITL, goal-wrapped = HOTL. goal이 게이트를 자동 통과 | 유저 |
| D10 | goal 모드에서 프롬프트가 "HOTL이므로 너가 알아서 pabcd 넘겨라" 지시 | 유저 |
| D11 | /interview, /goal, /goalplan 슬래시 커맨드 우선순위 | 유저 |

## 인터뷰 ask 포맷 (D12 후보)

현재 jawcode: 에이전트가 `ask` tool에 full JSON 구성 (heavy)
cli-jaw: 에이전트가 자연어 + ` ```elicitation` 펜스 (light)

유저 의견: "cli-jaw 방식이 ask 형식에 더 적합할 것 같다"
→ **jawcode interview를 elicitation fence 방식으로 전환?**

변경 시 영향:
- `ask` tool 제거 or 축소
- jaw-interview-gate.ts (gate mapping) 수정
- structured-renderer.ts 수정
- SKILL.md의 ask JSON 예시 전부 교체
- TUI selector가 elicitation fence 파싱하도록

## 미결정 질문 (유저 답변 대기)

### Q1. 인터뷰 ask 포맷
jawcode도 cli-jaw처럼 elicitation fence 방식으로 전환? 아니면 ask tool JSON 유지하면서 개선?

### Q2. goal HOTL 자동 진행 범위 — ✅ 확정
P/A/B 게이트: goal checkpoint (`goal update --evidence`)로 대체, 유저 승인 불필요.
C/D: 원래 자동.
구현: 이미 jawcode에 있음 (dev-pabcd Rule 4 + `#scheduleGoalContinuation()` + `recordGoalCheckpointForTransition()`).
→ **추가 구현 불필요. 기존 메커니즘 유지.**

### Q3. A-phase 서브에이전트
goal HOTL에서 A를 서브에이전트 병렬 audit (architect + critic 동시)로?

### Q4. C-phase 교차검증 구체적 범위
테스트 + 아키텍처 리뷰 + plan compliance 3종? 아니면 테스트만?

### Q5. goal done 판단 기준
에이전트가 "다 했다" vs "더 있다" 판단 기준? objective 대비? acceptance criteria?

### Q6. standalone → goal 전환
HITL로 시작 → 중간에 goal로 감싸기 가능?
