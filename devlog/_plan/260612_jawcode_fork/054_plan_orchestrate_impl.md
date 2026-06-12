# 054 — `jwc orchestrate` 구현 diff 플랜 (M1)

> 2026-06-12 10:17 초안 (Boss-author). 선행: [051](./051_design_command_port.md) §1–3, [053](./053_decisions_p_boss_author.md) D050-10~21.
> 본 문서는 **D050-19~21 개정 topology 기준** — P = Boss+Critic 1-pass, A = Planner∥Architect 병렬 감사.
> 상태: **draft — A 소규모 감사 대기** (Planner-lens + Architect-lens 병렬, D050-20 도그푸딩).

## 결정 입력 (요약)

| 입력 | 내용 |
|------|------|
| D050-2 | I→P 자동 전환 금지 — spec handoff + 명시 `orchestrate p` |
| D050-13 | 산출물 이중화 — devlog plan(사람) + `ralplan --write --stage final` → pending-approval.md(게이트 정본) |
| D050-14 | `/skill:ralplan` 별도 진입점 유지 — SKILL 본문 통합 안 함 |
| D050-16~18 | D=요약+회고+receipt / C=3스테이지+repo 게이트 / `/orchestrate` 정본+`/pabcd` alias |
| D050-19 | P = Boss 초안 + **Critic 1-pass**(plan 품질) |
| D050-20 | A = **Planner∥Architect 병렬 감사**, read-only, Boss 수정→델타 재감사 ≤3라운드 |
| D050-21 | trivial → A 감사 1명(기본 Architect), `ctx.a_audit_mode: "solo"\|"dual"` |

## 구현 diff (B1–B5)

### B1 — 상태 계층 (pabcd state)

> ⚠️ **A-1라운드 판정(Architect): canonical 5종 확장은 비권장** — `CANONICAL_GJC_WORKFLOW_SKILLS` 확장 시
> `workflow-manifest.ts:144` Record 타입 즉시 컴파일 실패, `state-schema.ts:17` 중복 하드코딩,
> `verify-gjc-skill-docs.ts:88-90`(SKILL.md 필수→크래시), `skill-active-state.test.ts:382` 4종 고정,
> `sdk.ts:1004-1021`·`gjc-dogfood-template.test.ts:17` "4 workflow skills product invariant",
> `check-visible-definitions.ts:5` 등 **10+ 동기화 지점** + 051 R14("스킬 아님")와 설계 충돌.
> rebrand-inventory/G002 자체는 skill **디렉터리** 검사라 배열 추가만으론 직접 FAIL 아님(`rebrand-inventory.ts:32,257` / `verify-g002-gates.ts:15`).
> **구조 선택은 [결정 대기 → D050-22]**: ① 별도 native-state 레지스트리(감사 권장) ② canonical 5종 확장.

| 파일 | 변경 |
|------|------|
| 상태 등록 구조 | **[D050-22 결정 대기]** — ①이면 NEW `NATIVE_WORKFLOW_COMMANDS` 레지스트리 + orchestrate 전용 state 경로(4종 불변), ②면 `active-state.ts:13` + `state-schema.ts:17` + 위 10+ 지점 동시 갱신 |
| `packages/coding-agent/src/skill-state/initial-phase.ts:14-21` | `normalized === "pabcd"` → `"i"` (①이면 native 레지스트리 측 등가물) |
| `packages/coding-agent/src/gjc-runtime/workflow-manifest.ts:144` | pabcd manifest(또는 native 등가물) — states `["i","p","a","b","c","d","complete"]`, forward-only + `i` 복귀 전이(cli-jaw `canTransition:563` 이식), terminal `["complete"]`, retention/hudFields |
| state 파일 | envelope `.gjc/state/pabcd-state.json` (+ session-scoped) — **052/050 문서의 `pabcd.json`은 논리 계약명, envelope 경로는 runtime 관례 `<skill>-state.json`을 따름** [기본값]. 필드: `current_stage`, `spec_ref`, `plan_ref`, `ctx.a_audit_mode`, `a_round`(≤3), `p_round`(≤2), `p_review_passed` |
| 쓰기 경로 | `state-writer.ts:391` `writeWorkflowEnvelopeAtomic()` 경유만 — receipt(owner/command/mutation_id) 관례 유지 (②선택 시 `:399` RequiredOnWriteEnvelopeSchema 동기화 필수) |
| 재생성 | `scripts/generate-gjc-workflow-manifest.ts`(generated.json drift gate) 재실행. ~~generate-json-schemas~~ — **workflow skill 스키마 무관(과대 기술 정정)** |

### B2 — 명령 표면

| 파일 | 변경 |
|------|------|
| NEW `packages/coding-agent/src/commands/orchestrate.ts` | `commands/interview.ts:1-40` 템플릿 — `APP_NAME` 브랜드 안전 설명, positional `i\|p\|a\|b\|c\|d`, `--deliberate` 플래그(ctx 전달), 코어는 `gjc-runtime/orchestrate-runtime.ts` 위임 |
| `packages/coding-agent/src/cli.ts:50` 부근 | `{ name: "orchestrate", aliases: ["pabcd"], load: ... }` ⚠️ **F-개정: 051 §1은 "isJawBrand 게이트 등록"이라 했으나 interview 선례는 무게이트 등록**(브랜드 차이는 프롬프트/스킬 레벨) — 051 표기 개정 또는 게이트 신설 결정 필요 |
| `packages/coding-agent/src/slash-commands/builtin-registry.ts` | `/orchestrate` (+alias `/pabcd`) — subcommands `i..d`, `/goal`(275-295) 패턴, handle/handleTui |
| `packages/coding-agent/src/hooks/skill-keywords.ts:15-76` | (선택) `$orchestrate` keyword — 채택 여부 미정 |

### B3 — 단계 프롬프트

| 파일 | 변경 |
|------|------|
| NEW `packages/coding-agent/src/prompts/jaw/orchestrate-{i,p,a,b,c,d}.md` | cli-jaw `state-machine.ts:240 getPrefix`/`:542 getStatePrompt` 사본 + jwc 어휘 손질(보스/직원 → 메인 세션/subagent). 디렉터리 신설 |
| 로딩 | `task/agents.ts:9-19` 패턴 — `import ... with { type: "text" }` 임베드, stage 진입 시 주입 |
| I 프롬프트 | 040 jaw-interview 산출물과 결합 — 엔진 호출만, 질문 정책은 SKILL이 소유 |

### B4 — P/A 런타임

| 파일 | 변경 |
|------|------|
| NEW `packages/coding-agent/src/gjc-runtime/orchestrate-runtime.ts` | 단계 진입·전이·게이트 코어 |
| P 흐름 | Boss 초안(devlog plan + 요약) → **Critic 1-pass** spawn(`task/agents.ts` EMBEDDED critic.md, fresh spawn·read-only·receipt-only) → **`OKAY` 즉시 final / `ITERATE\|REJECT` 시 Boss revise 후 재검 1회만(`p_round ≤2`), 재FAIL이면 pending-approval 작성 금지 + 사용자 에스컬레이션** [기본값] → `ralplan --write --stage critic/final`(`ralplan-runtime.ts` KNOWN_STAGES:37 재사용) → pending-approval ⛔. ※ "1-pass" = 리뷰어 1명, 라운드는 위 규칙 |
| A 흐름 | **trivial 판정은 `orchestrate a` 진입 시** — plan diff 기준 predicate(단일 파일·단일 동작·AC 명시), `--deliberate`/high-risk 지정 시 dual 강제, 결과를 `ctx.a_audit_mode`에 기록 [기본값] → **Planner∥Architect 병렬 spawn**(solo → Architect 단독) → NEW `parseWorkerVerdict`(verdict 어휘 **[D050-23 결정 대기]**: 감사 권고 = A는 `PASS\|FAIL` 신규 파서 + orchestrate 전용 audit 프롬프트, P Critic은 ralplan 어휘 `OKAY\|ITERATE\|REJECT` 유지 — 단계별 소유권 분리. ※ architect.md 자체 어휘는 CLEAR/WATCH/BLOCK이라 **A 전용 프롬프트로 출력 형식 고정 필수**) → FAIL이면 Boss 플랜 수정 → 델타 재감사(라운드별 산출물 `round-N.md` + `a_round` 갱신), `a_round ≤3` 초과 시 사용자 에스컬레이션 |
| handoff | `.gjc/specs/jaw-interview-*.md`(`jaw-interview-runtime.ts:408`) → pabcd state `spec_ref` 소비; A 산출물은 `.gjc/plans/pabcd/<run-id>/` + `index.jsonl` 관례. **P 게이트 정본(pending-approval.md)은 ralplan writer 재사용이므로 `.gjc/plans/ralplan/<run-id>/` 경로 유지**(D050-13) |

### B6 — B/C/D 런타임 (A-1라운드 Planner 지적 보강)

| 항목 | 변경 |
|------|------|
| `runStageB` | 메인 세션 executor **solo 기본**(D050-5), team 트리거는 Boss 재량 + 사용자 고지(D050-6) — `orchestrate-b.md` 프롬프트에 명시 |
| `runStageC` | **기계 검증→정밀 검토→평결 3스테이지**(D050-9/17) — 기계 검증 = repo 게이트(`bun run check:ts`·대상 테스트·rebrand/G002), 타 repo는 컨벤션 자동 감지 문구. 평결 FAIL → B 복귀 안내 |
| `runStageD` | 변경 파일·충족 기준 요약 + **WONDER/REFLECT 회고** 텍스트(사용자 산출물) + pabcd state에 gjc receipt 관례 종결 기록(D050-16) → 상태 클리어 |
| devlog 번호 | plan 문서 생성 시 050번대 lexicographic 연속 규칙(D050-3) — 자동 번호 충돌 검사 |

### B5 — 검증 게이트

- 단위: `test/workflow-state-command.test.ts:35-70` 패턴 — pabcd state write/receipt + `canTransition` 이식분(전이 표 전수)
- e2e: `orchestrate i→p→a→…→d` 풀사이클 1회 / spec 보유 시 `p` 단독 진입 / 승인 전 mutation 0
- 기계: `bun run check:ts`(root — biome+tsgo+schemas+`check:gjc-ui`=rebrand-inventory `--strict`), `scripts/verify-g002-gates.ts`
- gjc 브랜드 diff-0: 신규 명령이 gjc에서도 등록되는 경우(F-개정 결과에 따라) 프롬프트/동작 차이 검증 추가

### B7 — 문서 패치 diff (053 속집 2 체크리스트 구체화)

| 문서 | 변경 |
|------|------|
| `050_moc_plan_pabcd.md` §스코프 | "P=Boss+3-reviewer"·`ctx.p_review_mode` → "P=Boss+Critic 1-pass / A=Planner∥Architect / trivial=A solo(Architect) / `ctx.a_audit_mode`" |
| `051_design_command_port.md` §1·§3·§3.1·§4 | P/A행 D050-19~21 갱신, §1 등록 게이팅 표기를 D050-24 결정 결과로 교체, §4 결정 상태 표 갱신 |
| `052_decisions_ipabcd.md` | D050-11/12/15 참조처에 개정 포인터 |

## A 소규모 1라운드 결과 (260612 10:30 — Planner∥Architect 병렬, D050-20 도그푸딩)

- **두 lens 모두 FAIL** → Boss 수정 반영(본 문서 v2): B1 구조 경고·동기화 지점 보강, P/A 루프 종료 조건·trivial 판정 시점 명시, B6(B/C/D 런타임)·B7(문서 패치) 신설, Acceptance 확장
- **사용자 결정 대기로 승격**: D050-22(상태 등록 구조), D050-23(verdict 어휘), D050-24(명령 등록 브랜드 게이트 — Planner lens는 jaw 전용 등록 권고, Architect lens는 무게이트 선례 확인. 051 §5 "gjc 브랜드: 신규 커맨드 미등록"과 interview 무게이트 등록 현실이 이미 상충)
- 잔여: 결정 3건 반영 후 **델타 재감사(2라운드)** → PASS 시 B 진입 가능

## Acceptance (M1)

- [ ] B1–B7 전체 + 풀사이클 e2e 1회 (D050-7)
- [ ] spec 보유 시 `orchestrate p` 단독 진입 e2e / 승인 전 mutation 0
- [ ] subagent stage 파일 receipt-only — plan 본문 복제 금지 (D050-13)
- [ ] `/skill:ralplan` SKILL 본문 diff 없음 (D050-14)
- [ ] gjc 브랜드 diff-0(D050-24 결정 기준) / rebrand·G002·dogfood 게이트 green
- [ ] B7 문서 패치 완료 (050·051·052 + 053 속집 2 체크리스트 2건)
- [ ] devlog 번호 lexicographic 규칙 준수 (D050-3)
