# Prompt Flow

> 현재 jwc 프롬프트는 `system-prompt.md` 템플릿 + `SYSTEM.md` customization + project context + tools + skills + memory append instructions로 조립된다.

## 전체 흐름

```text
createAgentSession()
  -> rebuildSystemPrompt(toolNames, tools)
     -> resolveMemoryBackend(...).buildDeveloperInstructions(...)
     -> buildSystemPromptInternal(...)
        -> loadSystemPromptFiles(SYSTEM.md)
        -> loadProjectContextFiles(AGENTS.md 등)
        -> buildWorkspaceTree(...)
        -> loadSkills(...)
        -> render system-prompt.md or custom-system-prompt.md
        -> optional project-prompt.md block
  -> options.systemPrompt(defaultPrompt) override/append
```

| 단계 | 설명 | 근거 |
|---|---|---|
| session-level rebuild | `createAgentSession()` 내부 `rebuildSystemPrompt`가 tool metadata, memory instructions, MCP instructions를 모은다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1551`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1567`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1570` |
| internal build | `buildSystemPromptInternal`에 cwd, skills, contextFiles, tools, rules, append prompt가 전달된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1594` |
| host override | `options.systemPrompt`가 없으면 default, array면 대체, function이면 default blocks를 변환한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1613` |

## 템플릿

| 파일 | 역할 | 핵심 슬롯 | 근거 |
|---|---|---|---|
| `packages/coding-agent/src/prompts/system/system-prompt.md` | 기본 시스템 프롬프트 템플릿. identity, runtime, workflow, tools, skills 등을 포함한다. | `{{systemPromptCustomization}}`, `{{#if toolInfo.length}}`, `{{#if skills.length}}` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:13`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:118` |
| `packages/coding-agent/src/prompts/system/custom-system-prompt.md` | `customPrompt`가 있을 때 렌더되는 대체 템플릿. customization/custom/append/context/skills만 담는다. | `{{systemPromptCustomization}}`, `{{customPrompt}}`, `{{appendPrompt}}`, `contextFiles`, `skills` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/custom-system-prompt.md:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/custom-system-prompt.md:4`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/custom-system-prompt.md:31` |
| `packages/coding-agent/src/prompts/system/project-prompt.md` | 기본 prompt에서 별도 block으로 붙는 project prompt. | `projectPromptTemplate` render 후 `systemPrompt.push()` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:15`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:573`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:575` |

## `SYSTEM.md` 로딩

| 항목 | 현재 동작 | 근거 |
|---|---|---|
| capability id | `system-prompt` capability가 `SYSTEM.md` customization을 표현한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/capability/system-prompt.ts:24` |
| provider scan | builtin provider는 user agent dir의 `SYSTEM.md`와 nearest project config dir의 `SYSTEM.md`를 읽는다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:242`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:246`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:259` |
| precedence | `loadSystemPromptFiles()`는 project-level이 있으면 project를 반환하고, 없으면 user-level을 반환한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:277`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:288`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:293` |
| render slot | 반환된 content는 `systemPromptCustomization`으로 들어간다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:441`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:548` |

## CLI `--system-prompt` / `APPEND_SYSTEM.md`

| 표면 | 현재 동작 | 근거 |
|---|---|---|
| `APPEND_SYSTEM.md` discovery | CLI append prompt가 없으면 project `APPEND_SYSTEM.md`, 없으면 global `APPEND_SYSTEM.md`를 찾는다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:547`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:549`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:553` |
| session option mapping | resolved system prompt와 append prompt에 따라 `options.systemPrompt` function을 만든다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:571`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:675`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:676` |
| custom vs append | system prompt가 있으면 default 첫 block을 대체하고, append만 있으면 default 끝에 추가한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:676`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/main.ts:681` |

## Skills / Tools / Context 렌더

| 입력 | 처리 | 근거 |
|---|---|---|
| tools | explicit `toolNames`가 우선, 없으면 tools map, 없으면 default `["read","bash","eval","edit","write"]`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:509`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:512`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:519` |
| skills | `read` tool이 있을 때만 `hide !== true` skills를 system prompt에 렌더한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:533`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:536` |
| context files | `loadProjectContextFiles` 또는 provided context files가 `contextFiles`로 렌더된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:444`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:556` |
| workspace tree | `buildWorkspaceTree`가 5초 timeout 안에 준비되며 `agentsMdFiles`는 limit 후 정렬된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:447`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:483` |
| prompt render | `customPrompt`가 있으면 `custom-system-prompt.md`, 없으면 `system-prompt.md`를 렌더한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/system-prompt.ts:573` |

## Prompt Directories

| 디렉토리/파일 | 역할 | 근거 |
|---|---|---|
| `prompts/agents/*` | role agents prompt source. `architect`, `critic`, `executor`, `planner` 등. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:15`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/task/agents.ts:9` |
| `prompts/goals/*` | goal continuation / active goal prompts. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/goals/goal-continuation.md:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/goals/goal-mode-active.md:1` |
| `prompts/memories/*` | memory stage1, phase2 consolidation, read/unavailable templates. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:11`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/memories/index.ts:13` |
| global prompts | `~/.jwc/agent/prompts` (fork; upstream 문서는 legacy `.gjc` 표기 잔존 가능) | `dirs.ts`, `prompt-templates.ts` |
| project prompts | `.jwc/prompts` | `dirs.ts`, `prompt-templates.ts` |

## jwc 개편 포인트

| 대상 | 현재 기본값 | jawcode 결정/로드맵 |
|---|---|---|
| identity | 템플릿 첫 줄은 Jaw/jwc identity다. | 020 밴드에서 jaw identity/prompt preset으로 개편한다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:1`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:14` |
| skill 정본 | 현재 native `.jwc` skills + customDirectories + bundled defaults. | D5는 `~/.cli-jaw/skills` 우선 3계층을 목표로 한다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:122`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:14` |
| PABCD | 현재 기본 prompt에는 jaw-interview/ralplan/ultragoal/team routing이 있다. | 050 밴드에서 PABCD 범용 진입 커맨드와 ralplan/P/A 병합을 다룬다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:61`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:17` |

## 매 턴 주입 레일 (per-turn injection rails — 260612 실측)

시스템 프롬프트는 세션 시작 시 1회 조립·캐시되지만(도구 변경·`refreshBaseSystemPrompt()` 호출 시에만 리빌드),
아래 레일은 **턴 단위로** 모델 컨텍스트에 텍스트를 넣는다. 신규 상태 주입(예: 99.03 pabcd 스테이지 헤더)은
새 아키텍처 없이 이 레일을 재사용한다.

| # | 레일 | 시점/전달 | 내용 | 근거 |
|---|------|----------|------|------|
| 1 | 메모리 백엔드 훅 | `beforeAgentStartPrompt` — 매 턴, systemPrompt 배열 블럭 append | local: Task Snapshot(`buildLocalTaskSnapshot`) + hindsight `<memories>`/`<mental_models>` | `memories/index.ts`, `local-query.ts`, `hindsight/state.ts` |
| 2 | plan 모드 | 매 턴, 유저 메시지 앞 custom message(`plan-mode-context`) | PLAN.md 본문 + AC/검증 | `agent-session.ts` `#buildPlanModeMessage` |
| 3 | goal 모드 | 매 턴 custom message(`goal-mode-context`) + 주기적 `<system-reminder>` continuation | `goal-mode-active.md` / `goal-continuation.md` 렌더 (objective·tokensUsed) | `goals/runtime.ts:100-107` |
| 4 | 스킬/서브스킬 주입 | `/skill:` 호출·yield 시, `sendCustomMessage(deliverAs: steer\|followUp)` | SKILL.md **본문 통주입** + `<gjc-subskill>` 래퍼, phase는 `skill-active-state.json` | `extensibility/gjc-plugins/injection.ts:50-114` |
| 5 | TTSR(prose) | 스트림 중단→재시도 시 hidden custom message | `ttsr-interrupt.md` 렌더, repeatMode 게이트 | `agent-session.ts` `#retryWithTtsr` |
| 6 | TTSR(tool) | `afterToolCall` 훅 — 도구 결과 content 선두 prepend (in-band) | `ttsr-tool-reminder.md` | `agent-session.ts` `#ttsrAfterToolCall` |
| 7 | plan 결정 리마인더 | plan→execute 전환 시 steer | `plan-mode-tool-decision-reminder.md` | `prompts/system/plan-mode-tool-decision-reminder.md` |

상태 파일을 읽어 컨텍스트로 보내는 기존 사례는 `skill-active-state.json`(서브스킬 phase 해석)과
`goal-mode-request.json`(세션 시작 goal 활성화) 2종뿐 — 매 턴 상태파일→프롬프트 자동 갱신 레일은 아직 없다.

## cli-jaw 주입 구조 대조 (원본 reference — 99.03 설계 근거)

cli-jaw(IPABCD 원본)는 4층 push로 워크플로 컨텍스트를 유지한다. jwc 포팅 시 각 층의 대응 레일:

| cli-jaw 층 | 동작 | cli-jaw 근거 | jwc 대응 (99.03) |
|---|---|---|---|
| 상주 안내 | system prompt에 `orchestration.md` 섹션 + dev-pabcd 가이드 **경로 포인터** ("⛔ 단계 전 필독") — 본문은 pull | `src/prompt/builder.ts:540-553` | M1: `system-prompt.md` `<jwc-runtime>`에 orchestrate native 표면 등재 |
| 자가 전이 | "YOU advance phases by running the exact `cli-jaw orchestrate …` shell command. No other method." — 모델이 Bash로 직접 전이, 서버 자동 전이 없음 | `orchestration.md:47`, `routes/orchestrate.ts:721` | M1 routing 행 + M3 스테이지 프롬프트 말미 전이 안내 |
| 매 턴 헤더 | `getPrefix()` — I/P/A 유저 턴·A/B 워커 턴마다 `[PLANNING MODE — User Feedback]`류 prefix | `pipeline.ts:417-419`, `state-machine.ts:240-261` | M2: plan/goal 모드 레일에 `readPabcdState()` 리더 추가 |
| plan 재주입 | A/B/C 매 턴 DB(`orc_state`) plan 전문 prepend — **컴팩션 면역** | `pipeline.ts:421-424` | M2b 후속 (`plan_ref` 파일 prepend) |
| 컴팩션 핸드오프 | post-compact 부트스트랩 `<overall_goal>`/`<current_state>` prepend | `src/core/compact.ts:568-686`, `spawn.ts:868-873` | gjc 자체 컴팩션 요약 + M2 매 턴 재생성으로 갈음 |

스테이지 프롬프트 포맷: `STATE_PROMPTS['B']` 첫 줄 = `[PABCD — B: BUILD]` (`state-machine.ts:434-475`).
I/P 진입 첫 턴만 `getStatePrompt()`로 프롬프트 전체 치환, A/B/C/D는 CLI stdout pull.

> 상세 설계·결정: `devlog/_plan/260612_jawcode_fork/99.03.00_plan_workflow_surface_revision.md`

## 99.03 구현 상태 (결정 반영)

| 모듈 | 레일 | 상태 | 정본 |
|---|---|---|---|
| M1 discovery | `system-prompt.md` `<native-workflow orchestrate>` + routing | ⬜ 착수 가능 | [99.03.01](../devlog/_plan/260612_jawcode_fork/99.03.01_impl_workflow_surface.md) **PASS v2** |
| M2 지속성 | 레일 #8 `pabcd-stage-context` (plan/goal 동형) | ⬜ | `agent-session.ts` + `readPabcdState` |
| M2b plan 본문 | `plan_ref` prepend | 후속 99.03.02 | — |
| M3 자가 전이 | `orchestrate-*.md` 말미 | ⬜ | 99.03.01 §M3 |

착수 순서: [m1_closeout.md](./m1_closeout.md) · MLB: [jwc_readiness.md](./jwc_readiness.md).
