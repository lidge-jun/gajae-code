# 051 — 설계: cli-jaw 명령 체계의 jwc 이식 (D10 표면 — orchestrate/goal/memory)

> 050/060/070 밴드 공통 기반 설계 (260612 05:20). **050 정본 = Orchestrate IPABCD** (본 문서 §3).
> 착수 시 각 밴드 P에서 diff 레벨로 구체화.
> 원칙: **표면(동사·전이·게이트) = cli-jaw, 엔진 = gjc 네이티브 재사용** (D10). gjc 브랜드 diff-0 유지.

## 1. 명령 아키텍처 — gjc의 기존 2계층 재사용

| 계층 | gjc 메커니즘 | jwc 이식 방식 |
|------|-------------|---------------|
| CLI 서브커맨드 | `commands/*.ts`의 `Command` 클래스 | NEW `commands/orchestrate.ts` (+alias `pabcd`), `commands/interview.ts` (040, I 단독), `commands/goal.ts`, `commands/memory.ts` — **jaw 브랜드에서만 등록** (isJawBrand, 030 패턴) |
| TUI 슬래시커맨드 | `slash-commands/builtin-registry.ts` | `/orchestrate`, `/pabcd`, `/interview`, `/goal`, `/memory` — handle()이 위 CLI 코어 함수 호출 |

**orchestrate 서브커맨드 형태 (cli-jaw 동형):**

```text
jwc orchestrate i [hint]     # IPABCD 1단계 — 040 jaw-interview 엔진
jwc orchestrate p [hint]     # spec/plan 입력으로 P (ralplan)
jwc orchestrate a
jwc orchestrate b
jwc orchestrate c
jwc orchestrate d
jwc pabcd                    # alias — 현재 단계에서 다음 적절 단계 안내 또는 풀사이클 진입
```

- 설명 문자열: 010 패턴(`${APP_NAME...}`) 브랜드 안전
- rebrand-inventory: 번들 4종 무변경 — **IPABCD는 스킬이 아니라 네이티브 명령+상태머신+프롬프트** (R14)

## 2. 이식할 cli-jaw 자산 (정본 소스)

| cli-jaw 소스 | 내용 | jwc 대응 |
|--------------|------|----------|
| `src/orchestrator/state-machine.ts:240 getPrefix` / `:542 getStatePrompt` | I/P/A/B/C/D 단계별 주입 프롬프트 | `prompts/jaw/orchestrate-{i,p,a,b,c,d}.md` — I는 040 jaw-interview 산출물과 결합 |
| `:563 canTransition` | 전이 (forward-only, I 복귀, 게이트) | 상태 모듈 + `.gjc/state/pabcd.json` (state-runtime 선례) |
| `:607 parseWorkerVerdict` | A PASS/FAIL | ralplan Critic 수신부 |
| `cli-jaw orchestrate i\|p\|a\|…` | 단계 진입 커맨드 | `jwc orchestrate <stage>` 1:1 |
| `cli-jaw goal …` | goal 동사 셋 | 060 밴드 — ultragoal 어댑터 |
| `cli-jaw memory …` | memory 동사 셋 | 070 밴드 — memories 어댑터 |

## 3. IPABCD 단계 엔진 매핑 (050 정본 — D3 구현 형태)

| 단계 | cli-jaw 진입 | jwc 진입 | 엔진 (gjc 네이티브) | 게이팅 |
|------|--------------|----------|---------------------|--------|
| **I** | `orchestrate i` | `jwc orchestrate i` / `jwc interview`(단독) | **040** `jaw-interview` (rename 후 deep-interview 대체) | read-only, spec handoff |
| **P** | `orchestrate p` | `jwc orchestrate p` | ralplan Planner(+Architect) → pending-approval | mutation 금지 |
| **A** | `orchestrate a` | `jwc orchestrate a` | ralplan Critic + `parseWorkerVerdict` | read-only 역할 |
| **B** | `orchestrate b` | `jwc orchestrate b` | 메인 세션 (executor) | 승인 후 쓰기 |
| **C** | `orchestrate c` | `jwc orchestrate c` | check/테스트 | 기계 검증 |
| **D** | `orchestrate d` | `jwc orchestrate d` | 요약 + 상태 클리어 | — |

**040 → 050 연결 (I handoff):**

1. `orchestrate i` 또는 `interview` 완료 → `.gjc/specs/jaw-interview-{slug}.md`
2. `pabcd.json`에 `spec_ref`, `current_stage: "i"|"p"` 기록
3. `orchestrate p` 진입 시 spec을 ralplan 입력으로 전달 (`--deliberate` 옵션은 040→ralplan 브리지와 동일)

**goal 모드** (IPABCD와 별 축): ultragoal + goal-continuation, 게이트 self-advance — 060 밴드.

## 4. 결정 필요 (각 밴드 인터뷰/P)

- 040: 라운드당 질문 수 — [041 확정] 1–3개; 050은 엔진 호출만, 재결정 불필요
- 050: `interview` 단독 vs `orchestrate i` UX 차이 (상태머신 자동 등록 여부)
- 050: I 완료 후 P 자동 제안 vs 사용자가 `orchestrate p` 명시 호출만 — [기본값] 명시 호출 (cli-jaw)
- 060: 멀티골 vs active 단일 뷰 — [기본값] 멀티골+active 뷰
- 070: local vs hindsight — [실사 후]
- /goal gjc 슬래시와 충돌 동사 (pause/resume/drop)

## 5. 검증 골격 (각 밴드 공통)

- gjc 브랜드: 신규 커맨드 미등록, diff-0
- jwc 브랜드:
  - `jwc orchestrate i` → spec → `orchestrate p` → … → `d` 풀사이클
  - spec 보유 시 `orchestrate p` 단독 진입
  - `jwc goal` / `jwc memory` 사이클 (060/070)
- 전이 규칙 단위 테스트 (`canTransition` 이식분)
