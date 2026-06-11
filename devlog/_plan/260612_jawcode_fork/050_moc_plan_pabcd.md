# 050 MOC — 워크플로 병합 ②: Plan + PABCD 범용 커맨드

> 📐 상세 설계: [051_design_command_port.md](./051_design_command_port.md) — D10 표면 3종(orchestrate/goal/memory)의
> 명령 아키텍처(CLI Command 클래스 + 슬래시 2계층, jaw 브랜드 게이트), cli-jaw 이식 자산 표(state-machine
> getPrefix/getStatePrompt/canTransition/parseWorkerVerdict), 단계 엔진 매핑.

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
4. **명령 표면 [확정 D10 — cli-jaw 통일]**: `jwc orchestrate I|P|A|B|C|D` (+alias `jwc pabcd`) +
   `/pabcd`·`/orchestrate` 슬래시커맨드 — **cli-jaw orchestrate와 동일 어휘·전이 규칙·게이트 시맨틱**.
   PABCD는 jwc 일상 사용의 핵심 워크플로 (사용자 확정, R14)
5. 상태 영속화: [기본값] `.gjc/state/pabcd.json` (단계, ctx, plan ref) — resume 가능

## [기본값] 결정

- ⚠️ [기본값 가드] 번들 스킬 정확히-4종 기계 강제 (`rebrand-inventory.ts:32`) — pabcd를 번들 스킬로 넣으면
  expected 목록 확장 필요. 슬래시커맨드/CLI 진입(번들 스킬 아님)으로 가면 가드 비저촉 (010 MOC §리포 가드 참조)
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
