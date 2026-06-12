# 062 — 스키마: cli-jaw goal 시스템 전수 (061 어댑터의 원본 계약)

> 상위: [060_moc_goal_merge.md](./060_moc_goal_merge.md). 조사: CLI 서브에이전트 (260612 13:05, cli-jaw 소스 `/Users/jun/Developer/new/700_projects/cli-jaw` 기준 경로).
> 061이 gjc ultragoal **엔진** 실사였다면 062는 cli-jaw **goal 워크플로우** 전수 — D10(표면 동형)의 "동형"이 정확히 무엇인지 필드 단위로 고정.

## 1. GoalState 전체 스키마 (`src/goal/types.ts:24-43`)

```typescript
interface GoalState {
  id: string;                    // UUID.slice(0,12)
  objective: string;             // ≤10,000자 (MAX_GOAL_OBJECTIVE_CHARS)
  status: 'active'|'paused'|'blocked'|'complete'|'cancelled';
  goalMode?: 'direct'|'plan';    // plan = AI가 목표를 스스로 정련하는 모드
  planHint?: string;             // plan 모드 전용, refine 시 삭제
  createdAt; updatedAt;          // ISO
  repoRoot?; worklogPath?; currentPhase?;   // PABCD 연동 필드
  budget?: { maxTurns?; maxMinutes?; maxDispatches? };
  lastCheckpoint?: GoalCheckpoint;          // checkpoints 마지막과 동일 참조
  checkpoints: GoalCheckpoint[];
  pauseReason?; pauseAudit?: {actor:'agent'|'human', evidence, timestamp};
  cancelReason?; completionNote?;
  agentPauseCount?: number;      // 2-tap 게이트 카운터
}
interface GoalCheckpoint { summary; nextAction; evidencePaths: string[]; timestamp }
```

- 저장: `JAW_HOME/goal/active.json` + `history.json`(최대 50, FIFO) — tmp+rename 원자 쓰기 (`src/goal/store.ts:17-22,185-190`)
- plan 모드 흐름: `goal plan [hint]` → objective=`GOAL_PLAN_PENDING_OBJECTIVE` 상수 → continuation이 정련 지시 → `goal refine` 시 `goalMode='direct'`+planHint 삭제 (`store.ts:77-88`). **refine 전에는 checkpoint 차단** (409, `routes/goal.ts:73-76`)

### 061 대비 신규 발견 (어댑터 스키마 보강)

| 필드 | 061 현황 | 보강 |
|------|----------|------|
| `nextAction` | checkpoint에 없음 | ultragoal checkpoint payload에 대응 없음 — jwc `goal update --next "<...>"` 플래그로 수용 후 ledger payload 확장 [기본값 제안] |
| `goalMode: plan` + `refine` | 061 매핑에 refine은 있으나 plan 모드 생략 | `jwc goal plan [hint]` 추가 여부 — [열린 질문 7 신규] (061 열린 질문 2의 budget과 별개) |
| `budget{maxTurns,maxMinutes,maxDispatches}` | 미채록 | goal-run 모드(아래 §5)와 세트 — jwc는 dispatch 없음이므로 maxDispatches 제외 2종만 의미 |
| `blocked` status | 미채록 | ultragoal status에 `blocked`/`review_blocked` 기존재 — 매핑 가능 |
| history 50 cap | 미채록 | ledger는 무한 append — jwc `goal history` 기본 limit만 맞추면 됨 (조회 10, 최대 50) |

## 2. Evidence 계약 — "동형"의 핵심

- 수집: `--evidence "a,b,c"` → 콤마 분리 배열 (`bin/commands/goal.ts:143-149`); HTTP는 string|string[] 허용 (`routes/goal.ts:70-72`)
- **완료 게이트 술어** (`store.ts:215-217`): `lastCheckpoint.evidencePaths`에 trim 후 비어있지 않은 항목 ≥1 — 공백만 있는 배열은 거부. `done --force`는 human 수동 override 전용
- **evidence 번들 3종** (continuation 프롬프트 규정, `src/goal/heartbeat.ts:76`): Documentation(devlog/structure 경로) + Implementation(변경 소스/테스트 경로 또는 no-code 사유) + Verification(신선한 명령/테스트 출력) — **개발 goal의 모든 phase 게이트·최종 완료에 의무**
- 검증 티어 (`heartbeat.ts:79-82`): LIGHT(<5파일·<100줄: sub-agent 검증) / STANDARD(기본: 직원 검증+빌드) / THOROUGH(>20파일 또는 보안·아키텍처: 전체 리뷰+전체 테스트)

**ultragoal 대비**: gjc `goal_checkpointed.evidence`는 단일 문자열 — jwc 어댑터는 cli-jaw 배열을 join하거나 ledger payload를 `evidence: string[]`로 확장 [열린 질문 8 신규]. 번들 3종·검증 티어는 ultragoal에 없음 → goal-continuation 프롬프트 포팅(§4)으로만 이식.

## 3. 2-tap pause 게이트 정밀 (061 §3.2의 원본)

`routes/goal.ts:112-145` + `store.ts:135-152`:

1. **agent 1차** (`agentPauseCount<1`): 카운터→1, **409 거부** "First agent pause attempt recorded (1/2). Pause NOT executed." + 다음 continuation에 감사 체크리스트 주입
2. **agent 2차** (`--audit` 필수): pause 실행 + `pauseAudit{actor,evidence,timestamp}` 기록. audit 없으면 무조건 409
3. human pause: 게이트 없음. 단 **non-TTY에서 plain pause는 CLI가 거부** (`bin/commands/goal.ts:133-136`) — AI가 human 경로로 우회 못 함
4. 카운터 리셋: 턴 경계가 아니라 goal 수명 주기 (set/done/cancel 시 `clearGoalTimers`+초기화)

감사 체크리스트 (continuation 주입분, `heartbeat.ts:132-152`): 요구사항별 PROVEN/UNPROVEN/CONTRADICTED 판정 + dev 게이트(신선 검증·import 안전·정적분석·500줄·원자 커밋) + 문서 증거 + **독립 리뷰어 파견 의무**. 061 §3.2의 jwc 게이트 설계는 이 체크리스트 본문을 그대로 이식 [기본값].

## 4. goal-continuation 프롬프트 구조 (jwc `prompts/goals/` 포팅 명세)

`src/goal/heartbeat.ts:18-173` `buildGoalContinuation()` — 사전조건 4종(활성 goal / updatedAt<3일 `STALE_GOAL_MS` / worker 비활성 / pending replay 없음) 통과 시 생성. 섹션 구성:

| 섹션 | 조건 | 내용 요지 |
|------|------|----------|
| 헤더 | 항상 | objective·last checkpoint·next action·goal ID·project root·PABCD state |
| 핵심 규칙 | 항상 | 매 마일스톤 `goal update --evidence` / 호스트 런타임 goal 기능 사용 금지 |
| Autonomy Override | 항상 | FULL AUTHORITY(파괴적 git 제외) / 허락 질문 금지 / DRIVE TO COMPLETION |
| Evidence 번들+티어 | 항상 | §2 참조 |
| Plan-Mode 블록 | goalMode=plan | 출처 3종(대화·메모리·repo) 분석→refine→orchestrate P, "Do NOT ask. YOU decide." |
| PABCD Override | PABCD 활성 | goal이 최상위 — ⛔ STOP 무시, 전이 명령 실행 의무, 전 phase 한 턴 관통 |
| Pause 게이트 체크리스트 | pauseCount≥1 | §3 참조 |
| Stop/Pause Audit | 항상 | 완료를 UNPROVEN으로 간주, 독립 리뷰어 의무, done은 유저 명시 요청 전용 |

- 크기 예산(테스트 고정): 기본 <5,500자, PABCD-B 포함 <6,800자 (`tests/unit/goal-prompt-single-owner.test.ts:49-68`)
- **출력 감지**: AI 출력에서 `goal done/cancel/pause` regex 매치 시 서버가 실행 — done은 evidence 게이트 통과 시만 (`src/agent/lifecycle-handler.ts:834-860`). jwc는 in-process라 regex 감지 불필요 — 도구 호출로 직결.

**gjc 대응물**: `prompts/goals/goal-continuation.md`+`goal-mode-active.md`(061 §1) — 구조 비교 후 누락 섹션(번들·티어·2-tap 체크리스트·Stop Audit)을 jaw 브랜드 분기로 추가하는 것이 061 §3의 구현 본체. gjc 브랜드 diff-0 원칙(085.5 L1과 동일 메커니즘).

## 5. goal-run 모드 (061 열린 질문 2의 실체)

`src/goal-run/types.ts:1-37`, `controller.ts:39-46`: `GoalRunMode = 'dry-run'|'assist'|'bounded'|'supervised'`, 기본 budget `{maxTurns:10, maxMinutes:60, maxDispatches:5}`, `GoalRunState{status: preflight|running|paused|stopped|completed|failed, gates: GoalRunSafetyGate[]}`. 연속 시도 상한 `GOAL_CONT_MAX_ATTEMPTS=20` (`lifecycle-handler.ts`).

**jwc 판정 [기본값 제안]**: M1 제외 (dispatches 개념 부재 + jwc는 대화형 단일 세션 — bounded run의 가치가 낮음). budget 필드만 GoalState에 보존해 forward-compat.

## 6. 어휘 매핑 보강분 (061 §2 표에 병합할 행)

| jwc 표면 | cli-jaw 원본 | 엔진 매핑 |
|----------|-------------|-----------|
| `goal plan [hint]` | `set`+goalMode=plan | [열린 질문 7] — 수용 시 ultragoal brief를 pending 상수로 |
| `goal update --next "<a>"` | checkpoint.nextAction | ledger payload 확장 [열린 질문 8] |
| `goal status` 표시 | active 1 + budget + lastCheckpoint.nextAction | 061 [기본값] 유지 + nextAction 표시 추가 |
| `goal history [limit]` | history.json 최근순, 기본 10 최대 50 | ledger 조회 limit 정합 |
| (없음 — jwc 미수용) | `goal clear`/`reset` | reset은 파괴적 — human 전용으로도 미노출 [기본값] |

## 7. [열린 질문] (061 §6에 7·8 추가)

7. `goal plan` 모드(AI 자가 목표 정련) jwc 수용 여부 — 수용 시 plan-mode 블록 포팅 포함
8. evidence 단수(gjc ledger)↔복수(cli-jaw) — join vs payload 배열 확장
