# 051 — 설계: cli-jaw 명령 체계의 jwc 이식 (D10 표면 — orchestrate/goal/memory)

> 050/060/070 밴드 공통 기반 설계 (260612 05:20, 사용자 지시). 착수 시 각 밴드 P에서 diff 레벨로 구체화.
> 원칙: **표면(동사·전이·게이트) = cli-jaw, 엔진 = gjc 네이티브 재사용** (D10). gjc 브랜드 diff-0 유지.

## 1. 명령 아키텍처 — gjc의 기존 2계층 재사용

| 계층 | gjc 메커니즘 | jwc 이식 방식 |
|------|-------------|---------------|
| CLI 서브커맨드 | `commands/*.ts`의 `Command` 클래스 (utils/cli `run()`, 예: commands/state.ts) | NEW `commands/orchestrate.ts` (+alias pabcd), `commands/goal.ts`, `commands/memory.ts` — **jaw 브랜드에서만 등록** (isJawBrand 게이트, 030 패턴) |
| TUI 슬래시커맨드 | `slash-commands/builtin-registry.ts` (020에서 /identity 선례) | `/orchestrate`·`/pabcd`·`/goal`(기존 gjc /goal과 시맨틱 통합)·`/memory` — handle()이 위 CLI와 같은 코어 함수 호출 |

- 설명 문자열은 010 패턴(`${APP_NAME...}`)으로 브랜드 안전
- rebrand-inventory: 번들 스킬/롤 4종 무변경 — **가드 비저촉 구조** (R14 Q3 해소: PABCD/Interview는 스킬이 아니라 네이티브 명령+프롬프트)

## 2. 이식할 cli-jaw 자산 (정본 소스)

| cli-jaw 소스 | 내용 | jwc 대응 |
|--------------|------|----------|
| `src/orchestrator/state-machine.ts:240 getPrefix` / `:542 getStatePrompt` | 단계별 주입 프롬프트 텍스트 (I/P/A/B/C/D) | 프롬프트 .md 모듈로 이식 (`prompts/jaw/orchestrate-*.md`) — 040 인터뷰 병합 산출물과 결합 |
| `:563 canTransition` | 전이 규칙 (forward-only, I 복귀, 게이트) | 동일 규칙의 상태 모듈 — 상태 저장은 `.gjc/state/pabcd.json` (gjc state-runtime 재사용, commands/state.ts 선례) |
| `:607 parseWorkerVerdict` | A 감사 PASS/FAIL 파싱 | ralplan Critic 수신부에 이식 |
| `cli-jaw goal set/refine/status/update(--evidence)/done/pause(--agent --audit)/resume/history` | goal 동사 셋 + evidence 의무 + 2-call pause 게이트 | ultragoal `goal` 도구(op get/create/drop) + `.gjc/ultragoal/ledger.jsonl` 위 어댑터 — 동사→op 매핑 표는 060 P에서 |
| `cli-jaw memory search/read/save` | 메모리 동사 셋 | gjc memories(stage1/phase2) + `hindsight-retain` 도구 위 어댑터 — save→retain, search→read-path 쿼리 |

## 3. 단계 엔진 매핑 (PABCD ↔ gjc 워크플로 — D3 확정의 구현 형태)

| 단계 | 엔진 | 게이팅 |
|------|------|--------|
| I | 040 병합 인터뷰 (deep-interview 엔진 + 4차원 트래커) | 읽기 전용 |
| P | ralplan Planner(+Architect) 합의 루프 → pending-approval 아티팩트 | mutation 금지 (ralplan 기존 계약) |
| A | ralplan Critic 독립 패스 → verdict 파싱 | read-only 역할 에이전트 (gjc 기존 게이팅) |
| B | 메인 세션 구현 (role executor 패턴) | 승인 후 쓰기 허용 |
| C | check 스크립트/테스트 실행 | 기계 검증 |
| D | 요약 + 상태 클리어 | — |
| goal 모드 | ultragoal 레저 + goal-continuation 프롬프트(기존재) | 게이트 self-advance (cli-jaw 규약 이식) |

## 4. 결정 필요 (각 밴드 인터뷰/P)

- 040: 라운드당 질문 수 — repo 1개 강제 vs jaw 1–3 [미결]
- 060: ultragoal 멀티골 노출 vs jaw 단일 active 뷰 [기본값: 멀티골+active 기본 뷰]
- 070: 기본 백엔드 local vs hindsight [실사 후]
- /goal 기존 gjc 슬래시커맨드와의 시맨틱 병합 상세 (충돌 동사: pause/resume/drop)

## 5. 검증 골격 (각 밴드 공통)

- gjc 브랜드: 신규 커맨드 미등록 + 기존 동작 diff-0
- jwc 브랜드: `jwc orchestrate I→…→D` 풀사이클 e2e, `jwc goal` 사이클, `jwc memory` 왕복
- 전이 규칙 단위 테스트 (canTransition 이식분)
