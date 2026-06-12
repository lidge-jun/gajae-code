# 060 MOC — 워크플로 병합 ③: Goal

> 📐 상세 설계: [051_design_command_port.md](./051_design_command_port.md) §2 — cli-jaw goal 동사 셋 → ultragoal goal 도구/레저 매핑.

> 상태: 🟡 설계 문서화 완료 — [061_design_goal_merge.md](./061_design_goal_merge.md) (ultragoal 실사 + 어휘 매핑 + 이식 지점, 260612 11:40). 잔여: 착수 인터뷰([열린 질문] 6건) → 구현.
> 결정 근거: D3 [확정] ultragoal ↔ jaw goal 매핑.

## 코드 사실 (조사 완료)

- gjc ultragoal: `.gjc/ultragoal/{brief.md, goals.json, ledger.jsonl}` — repo-native 멀티골,
  통합 `goal` 도구(op: get/create/drop), G001/G002 스토리 레저, 체크포인트+steering 감사 이벤트
- `prompts/goals/goal-continuation.md` + `goal-mode-active.md` — **jaw의 [goal-continuation] 매턴 주입과 동일 패턴이 이미 존재**
- jaw goal: `cli-jaw goal set/refine/update(evidence)/done(완료 감사)/pause --agent --audit`(독립 정지 감사), 체크포인트 evidence 의무

## 스코프

1. 어휘/계약 매핑 표 작성: ultragoal brief↔objective, goals.json↔checkpoint 목록, ledger↔goal history
2. jaw 강점 이식: [기본값] ① checkpoint에 evidence 의무화 ② AI 자발 정지 시 독립 감사(pause --agent --audit 상당)
   ③ done은 명시 완료 감사 후에만 — ledger 이벤트 타입으로 추가
3. gjc 강점 유지: repo-native 아티팩트(레저 감사 추적), 통합 goal 도구 1개로 조작
4. goal-continuation 프롬프트에 jaw 규칙(자율 진행/권한/증거 번들) 어휘 통일 (020 연계)

## [확정 D10] 명령 표면 — cli-jaw 통일 (R14)

- 엔진은 gjc goal 도구+레저 유지, **사용자 표면은 `jwc goal set/refine/status/update/done/pause` —
  cli-jaw goal 명령과 동일 어휘·시맨틱** (evidence 의무, pause --agent --audit 게이트 포함)

## [기본값] 결정
- 단독 jwc의 goal과 cli-jaw 인스턴스 goal은 **별개** (D6 세션 비공유와 동일 원칙) — M2에서도 통합하지 않음

## 완료 기준

- `jwc goal set → checkpoint(evidence) → done` 사이클이 jwc 단독에서 동작, ledger에 감사 이벤트 기록
- evidence 없는 checkpoint 거부 테스트
- AI 자발 정지 시 감사 요약 없으면 거부 테스트

## 열린 질문

- ultragoal의 aggregate pointer-goal 모델을 jaw 단일 goal UX로 보일지, 멀티골 그대로 노출할지 —
  [기본값] 멀티골 그대로, jaw 표면은 active 1개를 기본 뷰로
