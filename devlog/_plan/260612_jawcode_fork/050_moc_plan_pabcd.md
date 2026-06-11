# 050 MOC — 워크플로 병합 ②: Plan + PABCD 범용 커맨드

> 상태: ⬜. 결정 근거: D3 [확정] ralplan ↔ jaw P+A 동형 (코드 검증: Planner/Architect/Critic 합의 루프 = P계획+A감사의 다중 에이전트 버전).

## 병합 소재

| 출처 | 가져올 것 |
|------|----------|
| gjc ralplan | Planner→Architect→Critic 합의 N회 루프, pending-approval 아티팩트(`.gjc/plans/ralplan/<run-id>/`), receipt-only 역할 응답(컨텍스트 오염 방지), `--deliberate` 프리모템, CLI 아티팩트 라이터(`--write --stage`) |
| jaw PABCD | P/A 단계 분리 + 사용자 승인 게이트(⛔ STOP), B에서 보스 단독 구현·직원 read-only 검증, C 기계 검증, D 요약, 데케이드 devlog 기록 |

## 스코프

1. P단계 엔진 = ralplan: P 진입 시 ralplan 합의 루프가 돌고, 최종 plan이 pending-approval로 멈춤 [기본값]
2. A단계 = ralplan의 Critic 패스를 독립 단계로 분리 노출 (jaw A의 read-only 감사 계약 유지)
3. B/C/D는 jaw 계약 이식: B 구현(역할 에이전트 게이팅 — gjc role agent의 read-only 패턴 재사용), C 기계 검증, D 요약
4. **범용 진입 커맨드**: `/pabcd` 슬래시커맨드 + `jwc pabcd <I|P|A|B|C|D>` CLI — 어떤 디렉토리에서도 진입
5. 상태 영속화: [기본값] `.gjc/state/pabcd.json` (단계, ctx, plan ref) — resume 가능

## [기본값] 결정

- 단계 전환은 명시 커맨드만 (자동 전환 금지) — cli-jaw 규약 유지
- 아티팩트는 ralplan 라이터 재사용 (`.gjc/plans/` 직접 편집 금지 계약 유지)
- 게이트 기본값: P/A 종료 시 STOP, goal 모드에선 self-advance (cli-jaw 규약 이식)

## 완료 기준

- `jwc`에서 `/pabcd` → I(040 스킬)→P(합의 plan)→A(감사)→B(게이트)→C→D 풀사이클 1회 통과
- P 산출물이 pending-approval로 멈추고 명시 승인 없이 mutation 0건 검증
- receipt-only: 역할 에이전트 본문이 부모 컨텍스트에 미복제 확인

## 열린 질문

- cli-jaw orchestrate 상태머신(`src/orchestrator/state-machine.ts`)과 단계 프롬프트 텍스트를 공유할지,
  jwc 자체 사본으로 갈지 — [기본값] M1은 자체 사본, M2 130에서 단일화 검토
- team(tmux 워커) 스킬과 B단계의 관계 — [기본값] M1 범위 밖
