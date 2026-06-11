# Extensibility

> 확장 표면은 capability API가 중심이다. 단, GJC skills는 현재 native `.gjc` source만 허용하고, D5 목표인 `~/.cli-jaw/skills` 우선 규칙은 아직 구현 전이다.

## Capability / Source Path

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| native source paths | native user base는 `getConfigDirName()`, project dir는 `.gjc`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:28`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:36` |
| other provider paths | claude/codex/gemini/opencode/cursor 등 source path도 정의되어 있다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:38`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:43`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:53` |
| source metadata | provider/path/level을 `SourceMeta`로 만든다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:106` |

## Skills

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| skill shape | `name`, `description`, `filePath`, `baseDir`, `source`, `hide`, `_source`, embedded `content`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:13` |
| active snapshot | active session skills는 process-global `activeSkills`에 저장되고 `skill://` handler가 읽는다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:41`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:43` |
| native-only filter | `loadSkills()`는 provider가 `native`가 아니면 false를 반환한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:122`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:124` |
| capability load | skills는 `loadCapability(skillCapability.id, {cwd})`로 수집된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:132` |
| source scan | project ancestor `.gjc/skills`와 user `~/.gjc/agent/skills`를 scan한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:284`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:286`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:299` |
| collision | 같은 skill name이 이미 있으면 뒤 skill은 skip하고 warning을 쌓는다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:184`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:186` |
| custom directories | settings `customDirectories`는 provider `custom:user`로 별도 scan된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:111`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:204` |
| deterministic order | 최종 skills는 `compareSkillOrder`로 정렬된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:270` |

## Slash Commands

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| builtin registry | `BUILTIN_SLASH_COMMANDS`는 declarative registry를 completion/hint 함수로 materialize한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/slash-commands.ts:93`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/slash-commands.ts:97` |
| file slash command shape | `name`, `description`, `content`, `source`, `_source`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/slash-commands.ts:119` |
| capability load | file commands는 `loadCapability(slashCommandCapability.id, {cwd})`로 로드된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/slash-commands.ts:158`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/slash-commands.ts:162` |
| native scan | builtin provider는 config dirs의 `commands/*.md`를 scan한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:325`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:330` |
| active commands | builtin slash names include `settings`, `theme`, `goal`, `model`, `memory`, `provider`, `login`, etc. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/slash-commands/builtin-registry.ts:212`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/slash-commands/builtin-registry.ts:228`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/slash-commands/builtin-registry.ts:910` |

## Custom Tools

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| loader | custom tool loader는 Bun native import로 TS tool module을 로드한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/custom-tools/loader.ts:1`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/custom-tools/loader.ts:44` |
| declarative files | `.md`, `.json`은 executable module로 로드하지 않고 error 처리한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/custom-tools/loader.ts:32` |
| API injection | factory에는 cwd, exec, ui, logger, typebox, zod, `pi`가 들어간다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/custom-tools/loader.ts:99` |
| conflict detection | builtin names와 충돌하면 tool을 skip하고 error를 기록한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/custom-tools/loader.ts:121`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/custom-tools/loader.ts:135` |

## Hooks

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| loader | hook module은 default function을 export해야 한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:157`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:164`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:168` |
| API | hook API는 `on`, `sendMessage`, `appendEntry`, `registerMessageRenderer`, `registerCommand`, `exec`, `logger`, `typebox`, `zod`, `pi`를 제공한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:90`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:107`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:129`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:141` |
| discovery | hooks는 capability API discovery + explicit configured paths를 합쳐 로드한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:225`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:249`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/hooks/loader.ts:253` |

## Plugins

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| plugin manifest | plugin package manifest는 tools/hooks/extensions/commands/features/settings를 가질 수 있다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/plugins/types.ts:24`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/plugins/types.ts:35`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/plugins/types.ts:44` |
| installed plugin | installed plugin record는 name/version/path/manifest/enabledFeatures/enabled를 가진다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/plugins/types.ts:99` |
| GJC plugin root | user root는 `getAgentDir()/gjc-plugins`, project root는 `<cwd>/.gjc/gjc-plugins`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:6`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:10` |
| root discovery | root 또는 child dir에 GJC manifest가 있으면 plugin root로 인정한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:18`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:28` |
| extension load | extension loader는 native capability modules와 installed plugin extension paths를 합친다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/extensions/loader.ts:505`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/extensions/loader.ts:513` |

## D5와 현재 gap

| 목표 | 현재 코드 | gap |
|---|---|---|
| `~/.cli-jaw/skills` 우선 | native user skill path는 `~/.gjc/agent/skills`, project는 `.gjc/skills`다. | D5 구현 전이므로 `~/.cli-jaw/skills` 우선순위, conflict override, cli-jaw SKILL.md frontmatter 호환이 필요하다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:14`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:299` |
| cli-jaw embedded skill 공유 | `loadSkills()`는 provider `native`만 허용한다. | cli-jaw skill source를 native-compatible provider로 넣거나 customDirectories 우선순위를 재설계해야 한다. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:122`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:204` |
