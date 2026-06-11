# SDK Surface

> cli-jaw 임베딩 관점의 단일 통로는 `jwc/sdk`다. 현재 `jwc/sdk`는 `@gajae-code/coding-agent/sdk`를 그대로 재수출한다.

## Public Boundary

| 표면 | 의미 | 근거 |
|---|---|---|
| `packages/jwc/src/sdk.ts` | jwc가 외부 호스트에 제공하는 SDK boundary. 현재는 coding-agent SDK 재수출. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/src/sdk.ts:1` |
| `packages/jwc/package.json` export `./sdk` | `import "jwc/sdk"` 공개 export. | `/Users/jun/Developer/new/700_projects/jawcode/packages/jwc/package.json:15` |
| `packages/coding-agent/src/sdk.ts` | 실제 구현체. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217` |

## `CreateAgentSessionOptions`

| 옵션 | 타입/계약 | cli-jaw 임베딩 의미 | 근거 |
|---|---|---|---|
| `cwd?: string` | project-local discovery 기준 작업 디렉토리. | cli-jaw Project root를 반드시 명시 주입해야 한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:217` |
| `agentDir?: string` | 기본 global config dir는 `~/.gjc/agent`. | M2에서 `.cli-jaw` 기반 agentDir 또는 bridge 정책을 결정해야 한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:220`, `/Users/jun/Developer/new/700_projects/jawcode/packages/utils/src/dirs.ts:216` |
| `authStorage?: AuthStorage` | credential store 직접 주입. | D7 로컬 토큰 시딩/OAuth 공유의 주입 지점. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:225`, `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:16` |
| `modelRegistry?: ModelRegistry` | authStorage를 가진 model registry. | `authStorage`와 다른 인스턴스면 startup에서 error. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:227`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:807` |
| `model?: Model`, `modelPattern?: string`, `thinkingLevel?: ThinkingLevel` | model selection / deferred model pattern / thinking selector. | cli-jaw settings의 per-runtime model 선택을 이 레이어로 매핑한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:230`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:232`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:235` |
| `systemPrompt?: string[] \| fn` | default prompt를 array로 대체하거나 function으로 변환. | cli-jaw PABCD/skills/global prompt를 끼우는 가장 직접적인 hook. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:240`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1613` |
| `customTools?: (CustomTool \| ToolDefinition)[]` | builtin tools 외 custom tools 등록. | cli-jaw tool bridge를 붙일 수 있는 표면. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:246` |
| `skills?: Skill[]` | caller-provided skills. | 명시 주입해도 bundled 4 workflow skill은 보존된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:265`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1001` |
| `contextFiles?: {path, content}[]` | AGENTS.md 등 context files 선주입. | cli-jaw가 이미 계산한 context를 주입해 재탐색을 줄일 수 있다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:269`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:849` |
| `promptTemplates?: PromptTemplate[]` | prompt templates 선주입. | `.gjc/prompts`와 global prompts 대신 cli-jaw prompt catalog를 연결할 수 있다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:273`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:853` |
| `slashCommands?: FileSlashCommand[]` | file-based slash commands 선주입. | 현재 discovery helper는 빈 배열이라 host 선주입이 더 중요하다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:275`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:857` |
| `eventBus?: EventBus` | shared event bus. | cli-jaw bus/SSE 매핑의 후보 지점. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:262`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:799` |
| `sessionManager?: SessionManager` | session store override. | M2 jaw.db 영속화 또는 adapter 방식의 핵심 결정 지점. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:311`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:877` |
| `settings?: Settings` | settings instance override. | cli-jaw settings와 jwc settings bridge 가능. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:317`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:830` |
| `shouldPause?: () => boolean` | Agent cooperative pause checkpoint. | goal/autonomy pause integration 후보. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:337` |

## Discovery / Builder Functions

| 함수 | 시그니처 | 현재 동작 | 근거 |
|---|---|---|---|
| `discoverAuthStorage(agentDir = getDefaultAgentDir())` | `Promise<AuthStorage>` | broker config가 있으면 remote broker snapshot, 아니면 `<agentDir>/agent.db` SQLite auth store를 연다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:409`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:410`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:425` |
| `discoverExtensions(_cwd?)` | `Promise<LoadExtensionsResult>` | 현재 SDK helper는 빈 extension result를 반환한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:437` |
| `discoverSkills(_cwd?, _agentDir?, _settings?)` | `Promise<{skills,warnings}>` | 현재 SDK helper는 빈 배열을 반환한다. 실제 세션은 내부 `loadSkills()`를 사용한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:444`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:449`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1011` |
| `discoverContextFiles(cwd?, agentDir?)` | `Promise<Array<{path,content,depth?}>>` | cwd에서 AGENTS.md context를 load한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:456`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:460` |
| `discoverPromptTemplates(cwd?, agentDir?)` | `Promise<PromptTemplate[]>` | global/project prompt templates를 로드한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:468`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/config/prompt-templates.ts:265` |
| `discoverSlashCommands(_cwd?)` | `Promise<FileSlashCommand[]>` | 현재 SDK helper는 빈 배열을 반환한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:478`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:479` |
| `discoverCustomTSCommands(_cwd?, _agentDir?)` | `Promise<CustomCommandsLoadResult>` | 현재 SDK helper는 빈 commands/errors를 반환한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:485`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:486` |
| `buildSystemPrompt(options)` | `Promise<BuildSystemPromptResult>` | internal builder에 cwd/skills/contextFiles/appendPrompt/repeatToolDescriptions를 전달한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:493`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:508`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:509` |
| `createAgentSession(options)` | `Promise<CreateAgentSessionResult>` | model/auth/settings/session/tools/prompt를 조립해 `AgentSession`을 만든다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:796`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:807`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:877` |

## `createAgentSession()` 내부 순서

| 단계 | 내용 | 근거 |
|---|---|---|
| 1 | `cwd`, `agentDir`, `eventBus`를 확정한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:796` |
| 2 | `modelRegistry`를 만들고, `authStorage`와 registry authStorage가 다르면 error. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:807`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:811` |
| 3 | `Settings.init({cwd, agentDir})`를 기본 settings로 사용한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:830` |
| 4 | workspace tree, context files, prompt templates를 병렬 준비한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:840`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:846` |
| 5 | `SessionManager.create(cwd, SessionManager.getDefaultSessionDir(cwd, agentDir))`를 기본 session manager로 사용한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:877` |
| 6 | skills는 caller-provided list 또는 `loadSkills()` 결과에 embedded default 4종을 합친다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1001`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1011`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1019` |
| 7 | `rebuildSystemPrompt()`가 memory instructions, MCP server instructions, tools, skills, rules를 합쳐 default prompt를 만들고 `options.systemPrompt`로 최종 변환한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1551`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1570`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1594`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1613` |

## 임베딩 주의점

| 주의점 | 이유 | 근거 |
|---|---|---|
| `discoverSkills()` 이름만 믿으면 안 된다. | SDK helper는 빈 배열이고, 실제 session path는 `loadSkills()`를 직접 호출한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:444`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1011` |
| `options.skills=[]`를 줘도 default workflow 4종은 제거되지 않는다. | `withEmbeddedDefaultGjcSkills()`가 명시 skill list에도 default skill을 추가한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:786`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1003` |
| `authStorage`는 `modelRegistry.authStorage`와 동일 인스턴스여야 한다. | 불일치 시 error를 던진다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:807`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:811` |
| cli-jaw prompt injection은 `options.systemPrompt` function이 가장 작다. | default prompt를 받은 뒤 final blocks를 반환할 수 있다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:240`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1619` |
