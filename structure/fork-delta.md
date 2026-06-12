# fork-delta — @bitkyc08/jawcode 포크 델타 인덱스 (체리픽 정본)

> upstream: `Yeachan-Heo/gajae-code` · fork: `bitkyc08/jawcode`. 본 문서는 포크가 업스트림에서 이탈한 파일의 **단일 카노니컬 인덱스**다 — 리베이스/체리픽 전 충돌 예상 분석의 첫 진입점. 설계 정본: `devlog/_plan/260612_jawcode_fork/067.1_plan_structure_fork_delta.md`.
> 갱신 규칙: HARD-EDIT·INVERTED-GUARD·REMOVED·NEW 파일이 포함된 커밋은 본 문서를 **동행 갱신**한다 (SOFT-EDIT는 밴드 일괄 허용). 커밋 트레일러 `Fork-Delta: <종류> <경로>` 규약은 `structure/conventions.md` 참조.

## 종류 정의

| 종류 | 의미 | 리베이스/체리픽 처리 |
|---|---|---|
| `NEW` | upstream에 없는 포크 신규 파일 | 자동 보존 / 통째 적용 |
| `HARD-EDIT` | upstream 파일의 산문·식별자 직접 수정 | **충돌 고확률** — 보존 경계 열 참조 |
| `REMOVED` | upstream 존재, 포크에서 삭제 | upstream 재추가 시 re-delete |
| `INVERTED-GUARD` | 가드/허용리스트 논리 반전(gjc→jwc), 테스트 동반 | 충돌 시 포크 논리 우선 |
| `SOFT-EDIT` | `${APP_NAME}` 동적화·픽스처 갱신 등 | 저위험 |

## 보존 경계 (BOUNDARY: gjc-internal-identifiers — 065.1 확정)

- `packages/coding-agent/src/gjc-runtime/`, `src/extensibility/gjc-plugins/` → **경로 rename 금지** (업스트림 체리픽 경계)
- `CANONICAL_GJC_WORKFLOW_SKILLS`·`GJC_SKILL_KEYWORD_DEFINITIONS`·`GjcTeam*` 등 심볼 → 변경 금지
- receipt.owner `"gjc-runtime"`/`"gjc-state-cli"`/`"gjc-hook"` → **절대 변경 금지** (퍼시스트 계약)
- `ENGINE_NAME = "gjc"`(`packages/utils/src/dirs.ts:20`) → 보존 (065.1-H; XDG 경로는 061.1 Q2)
- `@gajae-code/*` 내부 import 스코프 → 보존 (063.1 전략 B)
- `.gjc/` 상태 경로 → **`.jwc` 전환 완료 (260612 Phase β 본 적용, 0b603b05+d34097b8)** — legacy는 migrate-config-dir 원타임 rename + sentinel. 예외: migrate-config-dir.*·beta-jwc-sweep.ts는 ".gjc" 리터럴 의도 보존

## 델타 인덱스 (260612 C1~C13 기준)

### prompts/ — HARD-EDIT

| 경로 | 종류 | 밴드 | devlog | merge 지침 | 보존 경계 |
|---|---|---|---|---|---|
| `packages/coding-agent/src/prompts/system/system-prompt.md` | HARD-EDIT | 085.5-M2 + 99.03-M1 | 085.5_plan_prompt_rebrand.md · 99.03.01_impl_workflow_surface.md | CONFLICT-EXPECTED | `.jwc/`·`defaults/gjc` 리터럴 + native-workflow orchestrate 블록 |
| `packages/coding-agent/src/prompts/tools/{bash,skill,recall,reflect,retain}.md` | HARD-EDIT | 085.5-M2 | 동일 | CONFLICT-EXPECTED | — |
| `packages/coding-agent/src/prompts/agents/{planner,architect,critic}.md` | HARD-EDIT+INVERTED-GUARD | 085.5-M1·M3 | 동일 | CONFLICT-EXPECTED | frontmatter는 jwc 접두 |
| `packages/coding-agent/src/prompts/goals/goal-{continuation,mode-active}.md` | HARD-EDIT | 060-061 | 061_design_goal_merge.md | CONFLICT-EXPECTED | — |
| `packages/coding-agent/src/prompts/jaw/` (orchestrate-* 6종 + audit 2종) | NEW | 054/057 | 054_plan_orchestrate_impl.md | N/A | — |

### defaults/gjc/skills — HARD-EDIT

| 경로 | 종류 | 밴드 | merge 지침 | 보존 경계 |
|---|---|---|---|---|
| `…/defaults/gjc/skills/{jaw-interview,ralplan,team,ultragoal}/SKILL.md` | HARD-EDIT(+INVERTED-GUARD) | 085.5-M4, C13 | CONFLICT-EXPECTED | `GJC_TEAM_*` env·`.jwc/` 경로. jaw-interview는 설정 키 `jwc.interview.*` (c7c748ec) |
| 부속 md (auto-answer-uncertain 등) | HARD-EDIT | 042/085.5 | MANUAL-REVIEW | — |

### 신규 런타임 (gjc-runtime/ 내 포크 전용) — NEW

| 경로 | 밴드 | devlog |
|---|---|---|
| `…/gjc-runtime/agent-identity.ts` | 085.6 | 085.6_plan_identity_leak_zero.md |
| `…/gjc-runtime/cli-jaw-vocab.ts` | 057 | 057_plan_skill_compat_patch.md |
| `…/gjc-runtime/stage-skill-map.ts` | 057 P10 | 동일 |
| `…/gjc-runtime/goal-runtime.ts` | 060-061 | 061_design_goal_merge.md |
| (기존재 NEW 군) jaw-interview/ralplan/orchestrate/ultragoal/team/state 런타임 일체 | 030~085 | 각 밴드 MOC |

### commands/ · cli

| 경로 | 종류 | 밴드 | merge 지침 |
|---|---|---|---|
| `…/commands/goal.ts` | NEW | 060-061 | N/A |
| `…/commands/{harness,setup,team,worktree,ralplan,state,ultragoal}.ts` | SOFT-EDIT (`${APP_NAME}` 예시) | 085.5-M6 | AUTO |
| `…/src/cli.ts` (jawOnlyCommands: interview/orchestrate/goal) | HARD-EDIT | 050/060 | MANUAL-REVIEW |

### 가드 — INVERTED-GUARD

| 경로 | 밴드 | merge 지침 |
|---|---|---|
| `…/tools/bash-allowed-prefixes.ts` (jwc 접두) | 085.5-M1 | CONFLICT-EXPECTED |
| `…/skill-state/jaw-interview-mutation-guard.ts` (:254 jwc) | 085.5-M1 | CONFLICT-EXPECTED |
| `…/hooks/skill-keywords.ts` | 085.5-M4 | CONFLICT-EXPECTED |
| `packages/coding-agent/test/default-gjc-definitions.test.ts` (jwc 필수·gjc 어휘 금지 반전) | 085.5-M5 | CONFLICT-EXPECTED |
| `scripts/verify-g002-gates.ts`·`scripts/rebrand-inventory.ts` (gjc 셸 항목 제거) | 085.5-M7 | MANUAL-REVIEW |

### 인증/providers

| 경로 | 종류 | 밴드 | merge 지침 | upstream PR 후보 |
|---|---|---|---|---|
| `packages/ai/src/utils/oauth/local-token-detect.ts` | NEW | 094.3 | N/A | ✅ (버그픽스/범용 성격) |
| `packages/ai/src/utils/oauth/{anthropic,openai-codex,xai}.ts` | HARD-EDIT/NEW | 094.3 | MANUAL-REVIEW | ✅ |
| `packages/ai/src/providers/kiro.ts` | NEW | 091 | N/A | 검토 |
| `packages/ai/src/auth-storage.ts` | HARD-EDIT | 094.3 | MANUAL-REVIEW | ✅ |

### REMOVED

| 경로 | 밴드 | 처리 |
|---|---|---|
| `packages/gajae-code/` (셸 패키지 4파일) | 085.5-M7 (C10) | upstream 갱신 시 **re-delete**. `packages/jwc`가 단일 진입점 |

### TUI·세션

| 경로 | 종류 | 밴드 |
|---|---|---|
| `…/modes/components/welcome.ts`·`assistant-message.ts`·`session/agent-session.ts` | HARD-EDIT | 086/085.6 |
| `…/modes/theme/defaults/abyss-bite{,-light}.json` | NEW | 086 |
| `…/discovery/cli-jaw.ts` | NEW | 031 |

### 포크 전용 디렉터리 (전체 NEW — 엔트리 불요)

`structure/`, `devlog/`, `struct_har/`, `packages/jwc/`, `prompts/jaw/`, `prompts/goals/`(HARD-EDIT 2종 제외).


### 풀 jwc 포팅 (P2~P12, 260612 16:4x~18:0x — goal 3f6989ac)

| 경로 | 종류 | 밴드 | merge 지침 | 비고 |
|---|---|---|---|---|
| `packages/utils/src/dirs.ts` | HARD-EDIT | 062.1-M2 | CONFLICT-EXPECTED | APP_NAME 기본 "jwc" + JWC_ env 체인 |
| `packages/utils/src/env.ts` | HARD-EDIT | 062.1-M1 | CONFLICT-EXPECTED | $resolveEnv + JWC→GJC 로드타임 미러 |
| `packages/coding-agent/src/discovery/helpers.ts` | HARD-EDIT | 062.1 §4 | CONFLICT-EXPECTED | isJawBrand 기본 jwc + 매니페스트 키 jwc→gjc→pi |
| `packages/coding-agent/src/gjc-runtime/goal-mode-request.ts` | HARD-EDIT | 062.1-M4 (D-4) | CONFLICT-EXPECTED | JWC_SESSION_* 양쪽 SET |
| `packages/coding-agent/src/modes/bridge/bridge-mode.ts` | HARD-EDIT | 062.1-M3 | MANUAL-REVIEW | $resolveEnv 체인 |
| `packages/coding-agent/src/internal-urls/gjc-protocol.ts` | HARD-EDIT | 065.1-D | CONFLICT-EXPECTED | scheme jwc + legacy gjc alias |
| `packages/coding-agent/src/task/gjc-command.ts` | HARD-EDIT | 065.1-E | MANUAL-REVIEW | DEFAULT_CMD jwc |
| `packages/coding-agent/src/hooks/codex-native-hooks-config.ts` | HARD-EDIT | 064.1-M2 | MANUAL-REVIEW | 관리 명령 jwc codex-native-hook |
| `packages/coding-agent/src/skill-state/jaw-interview-mutation-guard.ts` | HARD-EDIT | 064.1 S-14 | CONFLICT-EXPECTED | 에러 문구 jwc |
| `packages/coding-agent/src/config/settings.ts` | HARD-EDIT | 낙진 수리 | MANUAL-REVIEW | 테마 마이그레이션 브랜드-인식 |
| `docs/environment-variables.md` | HARD-EDIT | 062.1-M7 | AUTO | JWC_ 전수 93건 + legacy 노트 |
| `packages/jwc/package.json`·`packages/jwc/src/cli-entry.ts` | HARD-EDIT/NEW | 063.1 (P12, D-3) | MANUAL-REVIEW | 번들 퍼블리시 독립화 |
| `scripts/ci-release-publish.ts` | HARD-EDIT | 063.1 | MANUAL-REVIEW | preBuild 선행 + jwc bundle |
| `packages/coding-agent/src/migrate-config-dir.ts` | NEW | 061.1-M4 (β 키트) | N/A | .gjc→.jwc 원타임 마이그레이터 (".gjc" 리터럴 보존 — 스윕 제외 파일) |
| `scripts/beta-jwc-sweep.ts` | NEW | 069.1 P9~P11 (β 키트·본 적용 260612) | N/A | 경계 안전 스윕 + 픽스업 14건 일체형 (.py/.ps1 포함, 멱등 재실행 가능) |
| `packages/coding-agent/src/migrate-config-dir-startup.ts` | NEW | 061.1-M4 (P10 배선) | N/A | cli.ts 최우선 side-effect import — 로거 선행 생성 회피, 워크스페이스 import 금지 |
| `packages/coding-agent/src/cli.ts` | HARD-EDIT | 061.1-M4 (P10 배선) | MANUAL-REVIEW | 1번째 import = migrate-config-dir-startup (순서 불변 계약) |
| `scripts/verify-g002-gates.ts` | HARD-EDIT | 069.1 P9 (라운드-2 픽스업) | AUTO | bin 키 이행기 허용형 (jwc ?? gjc) |
| `packages/jwc/bin/jwc.js` | HARD-EDIT | 99.02.01 (260612) | MANUAL-REVIEW | 워크스페이스 프로브 우선 — dist 번들은 퍼블리시 설치 전용 (stale 번들 버그 수정) |
| `packages/coding-agent/src/main.ts` | HARD-EDIT | 99.02.01 (260612) | MANUAL-REVIEW | checkForNewVersion에 dev 체크아웃 가드 (`test/` 존재 시 스킵) |
| `packages/tui/src/components/viewport-fill.ts` | NEW | 083.7 (컴포저 하단 고정) | N/A | 센티널 스페이서 — tui 코어는 센티널 부재 시 no-op (diff-0 보존) |
| `packages/tui/src/tui.ts` | HARD-EDIT | 083.7 | MANUAL-REVIEW | `#expandViewportFill` 1메서드 + #doRender 호출 1줄 (오버레이 합성 이전 고정 계약) |
| `packages/coding-agent/src/modes/interactive-mode.ts` | HARD-EDIT | 083.7 | MANUAL-REVIEW | chatContainer 직후 ViewportFill 마운트 + 브랜드 기본(jaw=on/gjc=off)·`tui.composerPin`·`PI_NO_COMPOSER_PIN` 해석 |
| `packages/coding-agent/src/modes/interactive-mode.ts`·`modes/types.ts` | HARD-EDIT | 083.7 §11 + 99.20.04 | MANUAL-REVIEW | fill을 chat 위로(B2-lite) + liveToolContainer 신설 |
| `packages/coding-agent/src/modes/controllers/event-controller.ts`·`input-controller.ts` | HARD-EDIT | 99.20.04 + 99.20.03 | MANUAL-REVIEW | 커밋 폴딩(라이브 존 라우팅·커밋점 2곳·agent_end 잔여) + 압축 트리거(슬래시·ctrl+o/t) |
| `packages/coding-agent/src/config/settings-schema.ts` | HARD-EDIT | 083.7/99.20.04 | AUTO | `tui.composerPin`·`tool.renderMode` (브랜드 기본) |
| `packages/coding-agent/src/modes/components/settings-selector.ts`·`packages/tui/src/components/settings-list.ts` | HARD-EDIT | 99.20.04 핫픽스 (260613) | AUTO | undefined currentValue 가드 ("default" 표기) — truncateToWidth 크래시 회귀 방지 |
| `packages/coding-agent/src/modes/interactive-mode.ts` | HARD-EDIT (예정) | 99.30.01 | MANUAL-REVIEW | `#renderTodoList` 전부 `completed` 시 1줄 접힘 — [todo_pipeline.md](./todo_pipeline.md) |

## 리베이스/체리픽 절차 (요약 — 상세: 067.1 §5)

- 리베이스 전: `grep "CONFLICT-EXPECTED" structure/fork-delta.md` ↔ `git diff upstream/main --name-only` 대조
- upstream→fork 체리픽: 대상 커밋이 HARD-EDIT 경로를 건드리면 보존 경계 열 기준 수동 병합
- fork→upstream 기여: `upstream PR 후보` ✅ 항목만
