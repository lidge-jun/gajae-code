# 061 — 설계: jwc goal 어댑터 (060 구체화, ultragoal 실사 기반)

> 상위: [060_moc_goal_merge.md](./060_moc_goal_merge.md). 실사: Backend 직원 (260612 11:40, read-only).
> 방향 [확정]: 엔진 = gjc ultragoal + goal 도구 유지, 표면 = `jwc goal set/refine/status/update/done/pause` (cli-jaw 동형, D10).

## 1. 엔진 사실 (코드 실사)

### 2계층 goal 모델

| 계층 | 저장소 | 조작면 |
|------|--------|--------|
| 세션 goal mode | 세션 transcript (`mode_change`) | `goal` 도구 — **op 5종: get/create/complete/resume/drop** (`goals/tools/goal-tool.ts:18-25`; MOC의 3종 표기는 과소 — 정정) |
| Ultragoal durable | `.gjc/ultragoal/{brief.md, goals.json, ledger.jsonl}` (`ultragoal-runtime.ts:139-146`) | `gjc ultragoal …` CLI + skill |

### goals.json 스키마 (`ultragoal-runtime.ts:21-44, 387-437`)

`UltragoalPlan{version, brief, gjcGoalMode: aggregate|per-story, gjcObjective, goals[], createdAt, updatedAt}` /
`UltragoalGoal{id: G00n, title, objective, status: pending|active|complete|failed|blocked|review_blocked|superseded, evidence?, steering?, completionVerification?}`

### ledger 이벤트 전수 (코드 기준)

| event | 위치 | 핵심 페이로드 |
|-------|------|---------------|
| `plan_created` | `:579` | goalIds |
| `goal_started` | `:632` | goalId |
| `goal_checkpointed` | `:1205-1214` | status, **evidence**, qualityGateJson?, completionVerification? |
| `steering_accepted` | `:1296-1302` | kind, evidence, rationale |
| `review_blockers_recorded` | `:1339` | blockerGoalId |
| `reconcile_failed` | `:1671` | (type 필드) error |

⚠️ `aggregate_objective_migrated`는 SKILL.md(:20)에만 있고 **코드 미구현** — [열린 질문 5].

### 프롬프트 주입

- `goal-mode-active.md`: 사용자 턴 직전, `goals/runtime.ts:407-409` → `agent-session.ts:4510-4520, 4762-4764`
- `goal-continuation.md`: (A) idle 800ms 자동 `interactive-mode.ts:692-723` (B) agent 정지 시 reminder `agent-session.ts:6684-6714`
- ultragoal→goal mode 브릿지: `commands/ultragoal.ts:27-38` → `goal-mode-request.ts:82-106, 139-171`

## 2. 어휘 매핑 (확정분)

| jwc 표면 | 엔진 매핑 |
|----------|-----------|
| `goal set <obj>` | `createUltragoalPlan({brief})` + `goal({op:"create"})` + pending request — plan 없으면 1스토리(G001) 생성 |
| `goal refine <obj>` | `goals.json` `gjcObjective`/active story objective 갱신 + 세션 replaceGoal |
| `goal status` | `getUltragoalStatus` + `goal({op:"get"})` 합성 — [기본값] active 1개 기본 뷰 |
| `goal update <summary> --evidence <…>` | `checkpointUltragoalGoal({status, evidence})` — 엔진이 evidence를 **이미 강제**(`:1142-1143`) |
| `goal done [note]` | checkpoint complete(+quality-gate) → `goal({op:"complete"})` — guard `ultragoal-guard.ts:281-290` |
| `goal pause [--agent --audit <요약>]` | `GoalRuntime.pauseGoal()`(`goals/runtime.ts:348-363`) + **신규 2-pass 게이트** (§3.2) |
| `goal resume` | `goal({op:"resume"})` 1:1 |

cli-jaw 전용 동사 처리: `cancel`→`checkpoint --status superseded` 또는 drop / `history`→ledger 조회 / `plan`·`run`(budget)→[열린 질문 2].

## 3. jaw 강점 3개 — 이식 지점

### 3.1 ① checkpoint evidence 의무 — **엔진에 이미 있음**, 어댑터에서 누락 차단만

- `ultragoal-runtime.ts:1142-1143`이 빈 evidence를 throw — cli-jaw보다 이미 엄격
- 어댑터(`goal-runtime.ts` 신규)는 `--evidence` 미지정 시 즉시 exit 1 (엔진 도달 전 명확한 usage 에러)

### 3.2 ② AI 자발 정지 독립 감사 — **신규** (cli-jaw `routes/goal.ts:112-128`/`store.ts:192-204` 동형 2-pass)

| 레이어 | 변경 |
|--------|------|
| `gjc-runtime/goal-runtime.ts` (신규) | `pause --agent` 1차: `agentPauseCount` 증가 + audit checklist 주입, pause **미실행**. 2차(`--audit <요약>` 포함): pause 실행 |
| `goals/state.ts` | `GoalModeState`에 `agentPauseCount?`, `pauseAudit?: {actor, evidence, timestamp}` |
| ledger | 신규 이벤트 `goal_pause_audited{actor, evidence, reason}` |
| TUI `interactive-mode.ts:1742-1748` | agent-initiated pause 경로에 게이트 연결 (human pause는 비대상) |

### 3.3 ③ done = 완료 감사 후만 — **이중 게이트 기존재**, 어댑터가 순서 강제

```
jwc goal done
  ├─ (1) 마지막 goal_checkpointed evidence 존재 검사 (jaw parity)
  ├─ (2) checkpoint --status complete + --quality-gate-json (orchestrate c 산출물 연결 — 열린 질문 6)
  └─ (3) goal({op:"complete"}) — guard 통과 후만. --force는 human 전용 (agent는 guard가 항상 차단, goal-tool.test.ts:229-254)
```

## 4. 050 패턴 재사용 / 차이

- 재사용: `jawOnlyCommands` 게이트(`cli.ts:61-71`)에 `goal` 추가 · thin Command→runtime 위임(`commands/goal.ts`→`gjc-runtime/goal-runtime.ts`, `{stdout,stderr,status}` 계약) · 브랜드 분기 표면 테스트
- 차이: ultragoal은 **canonical workflow skill** — 050처럼 native 신설이 아니라 **기존 엔진 위 어댑터**. SKILL.md·goal 도구·guard·reconcile(`:1647-1676`)은 그대로 정본. jaw CLI는 syntax 정본을 대체하지 않음

## 5. 신규 파일

```
packages/coding-agent/src/commands/goal.ts            # jaw 전용, orchestrate.ts 미러
packages/coding-agent/src/gjc-runtime/goal-runtime.ts   # 동사→ultragoal+세션 goal 어댑터 + 2-pass pause 게이트
packages/coding-agent/test/gjc-runtime/goal-runtime.test.ts
```

완료 기준↔테스트: set→update(evidence)→done 사이클 / evidence 없는 update 거부 / `pause --agent` 무감사 거부(1차 카운트·2차 실행) / ledger에 `goal_checkpointed`·`goal_pause_audited` assert.

## 6. [열린 질문] (사용자 결정 — 착수 인터뷰에서)

1. **`/goal` slash 충돌**: 기존 TUI `/goal set|show|pause|resume|drop`(`builtin-registry.ts:287-307`)과 jaw 표면(set/refine/status/update/done/pause) — 통합 vs 병존
2. `goal plan`/`goal run`(budget) — jwc 포함 여부
3. `done --force` — human-only override 한정 확인
4. `goal update`의 중간 checkpoint status — `active` 유지 vs 신규 `progress`
5. `aggregate_objective_migrated` — 구현 포함 여부
6. quality-gate-json 공급 UX — `orchestrate c` 산출물 자동 연결 vs 명시 플래그

[기본값 확정, 결정 불요]: 멀티골 유지 + status는 active 1개 뷰 / jwc goal ↔ cli-jaw 인스턴스 goal 비공유(D6).
