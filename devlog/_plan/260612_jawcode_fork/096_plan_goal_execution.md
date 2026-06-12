# 096 — 잔여 패치 완결 실행 플랜 (goal 1ff15596-5fd · P 산출물)

> 목표: 055~059·085번대 잔여 패치 + 프롬프팅 작업 완결 → 060번대 돌입 준비 (클린 시 060 구현 착수).
> 모듈 정본: [095](./095_plan_debt_cleanup.md)(W1-W4·확정 7건) · [085.5](./085.5_plan_prompt_rebrand.md)(M1-M7) · [085.6](./085.6_plan_identity_leak_zero.md)(M1·M3·M4) · [057](./057_plan_skill_compat_patch.md)(M1-M2·§6 P10) · [061](./061_design_goal_merge.md)(060 M1-M7, 조건부).
> 본 문서는 **커밋 단위 실행 순서**만 소유 — diff 상세는 각 모듈 문서가 정본.

## 커밋 단위 (C1~C12)

| C | 내용 | 정본 | 게이트 |
|---|------|------|--------|
| C1 | **W1 biome 그린** — 커밋된 kiro.ts 9건+format, descriptors/register-builtins/tool-transcript-overlay/event-controller/input-controller 등 미커밋-무관 lint 전수 | 095 W1 | `bun run check:ts` 단계 진행(check:tools green) |
| C2~C5 | **W2 분리 커밋 4개** — ① 094.3 로컬토큰(+`local-token-detect.ts` 추적+organizeImports) ② 094.4 quota(+format 3건) ③ 086 비주얼(+테마 JSON 2종+`brand-visual-identity.test.ts`+format) ④ 084 모델셀렉터(+테스트) | 095 W2·D1 표 | 각 커밋 후 관련 테스트 green, C5 후 `git status` clean(085.5-M6 부분 3건은 C9에 합류) |
| C6 | **085.5 M1** — `bash-allowed-prefixes.ts:122` jwc 접두 전환, `jaw-interview-mutation-guard.ts:254`, agents frontmatter `jwc ralplan --write`/`jwc state` | 085.5 M1 | `bash-allowed-prefixes`·`bash-interceptor`·`agent-fields` 테스트 갱신 green |
| C7 | **085.5 M2+M5 동행** — system-prompt.md 하드 수정("You are Jaw, the coding agent running on the jwc runtime (Jawcode)."·`<jawcode-system-prompt>`·산문/실행구문)+tools md + **가드 반전**(default-gjc-definitions·verify-g002-gates·rebrand-inventory를 jwc 어휘 기준으로) | 085.5 M2·M5 | 반전 가드 green + jwc 프롬프트 GJC 산문 비노출 + 보존 경계(`.gjc/`·`GJC_*`·`@gajae-code`) grep 무변경 |
| C8 | **085.5 M3 + 085.6 M1·M3** — 조립 코드 문자열(agent-session.ts:1076 등), `renderIdentityBlock` 이름-우선 1줄, `gjc-runtime/agent-identity.ts` 신규, TUI 헤더 `"gajae"`→resolve(assistant-message.ts:19)·상태라인 렌더 텍스트 | 085.5 M3·085.6 M1/M3 | `system-prompt-identity.test.ts` 하드 baseline 재정의 green |
| C9 | **085.5 M4+M6** — 번들 4종 SKILL.md 하드 수정(`gjc team`→`jwc team` 등)+gjc-defaults fallback+skill-keywords, commands 잔여 `${APP_NAME}` 동적(기존 미커밋 3건 합류) | 085.5 M4·M6 | 반전 가드 green |
| C10 | **085.5 M7 — gjc bin 제거** — `packages/gajae-code/bin/gjc.js`+package.json `bin` 등록 제거, gjc 스모크/`gjc-dogfood-template`/brand-visual gjc probe 정리 | 095 §2-#1 파급 | `bun packages/jwc/bin/jwc.js --version` 스모크, 빌드 무회귀 |
| C11 | **057 M1-M2 + §6 P10** — `cli-jaw-vocab.ts`(dev 어휘 맵)+`buildSkillPromptMessage` 분기, `stage-skill-map.ts`+orchestrate-runtime:345 주입+audit 서브에이전트 포인터 | 057 | `skill-brand-compat`·stage 주입 테스트 신규 green |
| C12 | **085.6 M4 + W4 문서 정합** — `agent-identity-leak.test.ts`, devlog 구플랜 "[구원칙 폐기]" 배너, README.jwc.md 관계 절, gitstructure 게이트 목록, 코드 주석 4곳(cli.ts:56 등), har_struct 재생성 | 085.6 M4·095 W4 | grep 구원칙 현행 서술 0 + **e2e: jwc "너는 누구야" → Jaw, GJC 비언급** |

이후 (조건부): **060 goal 병합 C13~** — 061 M1-M7 순서 (goal-runtime.ts → commands/goal.ts → state 필드 → TUI 별칭 → continuation 포팅 → ledger 이벤트 → 테스트). C12까지 check:ts 0·가드 green이면 착수.

## 검증 총괄 (goal 완료 기준)

1. `bun run check:ts` exit 0 (C1 이후 매 커밋 유지)
2. `git status` clean (C5 시점 + 이후 유지)
3. 반전 가드·신규 테스트 전부 green
4. jwc TUI "너는 누구야" e2e — Jaw 정체성·jwc 런타임 인지·GJC 비언급
5. 구원칙 현행 서술 0 (배너 처리 제외)

## 리스크·결정 잔여

- 비즈니스 결정 잔여 0 — 인터뷰 260612 01:36/02:04/02:17에서 전항 확정 (nextAction은 M1 보류 기본값, 060 범위)
- 리스크: C7 가드 반전 범위가 넓음(테스트 ~10파일) — C7을 "가드 반전 먼저 RED 확인 → 하드 수정으로 GREEN" 순서로 진행해 회귀 감지
- C10 gjc bin 제거 시 워크스페이스 의존(`gajae-code` 패키지 참조) 잔존 여부는 구현 시 `rg "gajae-code/bin|\"gajae-code\""` 전수 후 결정 (셸 패키지 전체 제거 vs bin만)
