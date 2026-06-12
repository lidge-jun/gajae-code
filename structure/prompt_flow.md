# Prompt Flow

> 현재 GJC/JWC 프롬프트는 `system-prompt.md` 템플릿 + `SYSTEM.md` customization + project context + tools + skills + memory append instructions로 조립된다.

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
| global prompts | `~/.gjc/agent/prompts`가 global prompt template directory. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:420`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/config/prompt-templates.ts:276` |
| project prompts | `.gjc/prompts`가 project prompt template directory. | `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:459`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/config/prompt-templates.ts:281` |

## jwc 개편 포인트

| 대상 | 현재 기본값 | jawcode 결정/로드맵 |
|---|---|---|
| identity | 템플릿 첫 줄은 GJC/Gajae Code identity다. | 020 밴드에서 jaw identity/prompt preset으로 개편한다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:1`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:14` |
| skill 정본 | 현재 native `.gjc` skills + customDirectories + bundled defaults. | D5는 `~/.cli-jaw/skills` 우선 3계층을 목표로 한다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:122`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:14` |
| PABCD | 현재 기본 prompt에는 jaw-interview/ralplan/ultragoal/team routing이 있다. | 050 밴드에서 PABCD 범용 진입 커맨드와 ralplan/P/A 병합을 다룬다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:61`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:17` |
