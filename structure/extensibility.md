# Extensibility

> 확장 표면은 capability API가 중심이다. jaw brand(`jwc`)에서는 `~/.cli-jaw/skills` global root가 native user root를 대체하고, D5의 project-level 우선순위는 아직 미완이다.

## Capability / Source Path

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| native source paths | native user base는 `getConfigDirName()`, project dir는 `.jwc`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:28`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:36` |
| other provider paths | claude/codex/gemini/opencode/cursor 등 source path도 정의되어 있다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:38`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:43`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:53` |
| source metadata | provider/path/level을 `SourceMeta`로 만든다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:106` |

## Skills

| 항목 | 현재 구조 | 근거 |
|---|---|---|
| skill shape | `name`, `description`, `filePath`, `baseDir`, `source`, `hide`, `_source`, embedded `content`. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:13` |
| active snapshot | active session skills는 process-global `activeSkills`에 저장되고 `skill://` handler가 읽는다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:41`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:43` |
| native-only filter | `loadSkills()`는 jaw brand가 아니면 native `.jwc` source만 허용한다. jaw brand에서는 `cli-jaw`/`agents` provider도 활성화된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:124`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:142` |
| cli-jaw global root | jaw brand + `~/.cli-jaw/skills` 존재 시 native user root를 대체한다. 없으면 native user root fallback. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/cli-jaw.ts:4`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:129` |
| capability load | skills는 `loadCapability(skillCapability.id, {cwd})`로 수집된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:132` |
| source scan | project ancestor `.jwc/skills`와 user `~/.jwc/agent/skills`를 scan한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:284`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:286`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/builtin.ts:299` |
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
| active commands | builtin slash names include `settings`, `theme`, `goal`, `model`, `memory`, `provider`, `login`, `searchengine`, etc. `searchengine`는 [search.md](./providers.md) 참조. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/slash-commands/builtin-registry.ts:212`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/slash-commands/builtin-registry.ts:228`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/slash-commands/builtin-registry.ts:910` |
| `/help` 도킹 2-페인 카탈로그 (99.20.08) | 모델-셀렉터 문법의 docked 2-pane 선택기: builtin/skill/custom 탭 분할, enter로 커맨드 삽입. ACP는 plain 카탈로그 핸들. | `8e17a1ce` (99.20.08), `src/slash-commands/builtin-registry.ts` |
| 세션 슬래시 표면 (99.07.01) | `/fork [msg]`·`/branch`·`/resume <id>`·`/sessions`·`/switch`(alias). `AgentSession.fork()`는 큐 메시지 클리어. | `7fa8a9d0` (99.07.01) |
| `/model` 2-페인 키보드 (99.30.04 S7.1) | 화살표로 리스트 순환, space로 provider/model 페인 전환 복원. | `04132930` (99.30.04 S7.1) |

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
| plugin root | user root는 `getAgentDir()/gjc-plugins`, project root는 `<cwd>/.jwc/gjc-plugins` (디렉터리명은 legacy 내부 식별자). | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:6`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:10` |
| root discovery | root 또는 child dir에 plugin manifest가 있으면 plugin root로 인정한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:18`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/gjc-plugins/paths.ts:28` |
| extension load | extension loader는 native capability modules와 installed plugin extension paths를 합친다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/extensions/loader.ts:505`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/extensions/loader.ts:513` |

## D5와 현재 gap

| 목표 | 현재 코드 | gap |
|---|---|---|
| `~/.cli-jaw/skills` global 우선 | jaw brand에서 `cli-jaw` provider가 `~/.cli-jaw/skills`를 scan하고, 디렉터리가 있으면 native user root를 suppress한다. | project-level `.jwc/skills` vs global 우선순위, frontmatter 호환, collision override 세부는 D5 완료 전. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/cli-jaw.ts:17`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:134` |
| cli-jaw embedded skill 공유 | jaw brand에서만 `cli-jaw`/`agents` provider skill surface가 활성화된다. | legacy upstream bin 경로에서는 native-only. M2 임베딩 시 brand detection/`customDirectories` 정책 재검토 필요. 근거: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/extensibility/skills.ts:142`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/discovery/helpers.ts:106` |


---

# (merged) Bundled Workflow Skills (4종)


---

## Default Workflow Skills

> jwc의 공개 workflow surface는 기본 4종 + **native IPABCD orchestration**(`jwc orchestrate`)이다.
> fork 런타임 기준 canonical slug는 `jaw-interview`이며, upstream `AGENTS.md`는 아직 `deep-interview` 표기를 유지한다 `[기본값]`.

### Native orchestration (050 — 런타임 ✅ / discovery ⬜ 99.03)

| 표면 | 동작 | 상태 |
|---|---|---|
| CLI | `jwc orchestrate <i\|p\|a\|b\|c\|d>`, `audit-prompt`, `status`, **`reset`** (99.07-U1: 어느 상태→idle, goal 불가침, --shared/--dry-run) | ✅ 구현 (`orchestrate-runtime.ts`) |
| interview CLI | `jwc interview cancel` | ✅ **99.07-U2** — 세션 스코프 상태 파일 삭제 + HUD inactive 동기화 (`jaw-interview-runtime.ts`) |
| Slash | `/orchestrate` (jaw brand only) | ✅ |
| State | `.jwc/state/sessions/<id>/pabcd-state.json` | ✅ `orchestrate-state.ts` |
| 전이 규칙 | **P 직행 1급화** — `i`는 `P`의 필수 선행이 아님(idle→P 직접 가능) | ✅ `2d3a14a8` (260613 실측) |
| 세션 스코프 | `JWC_SESSION_ID` env 자동 디폴트 — 전역 상태 오염 차단 | ✅ `8331c03b` (`orchestrate-runtime.ts`) |
| 상태 리더 폴백 | pabcd 상태 스코프→**공유 경로 폴백** (라이브 TUI HUD 띠/헤더 미표시 버그 수정) | ✅ `ac42e4f3` (`orchestrate-state.ts`·`workflow-readers.ts`) |
| Stage prompts | `prompts/jaw/orchestrate-*.md` — CLI stdout pull | ✅ |
| **모델 discovery** | `system-prompt.md`에 orchestrate/IPABCD | ✅ **99.03 M1** 완료 (`45cba4e2`) |
| **매 턴 단계 헤더** | `pabcd-stage-context` custom message | ✅ **99.03 M2** 완료 (`8a7ea342`) |
| dev-pabcd 스킬 | 글로벌 스킬 | jaw에서 **의도 차단** — native 표면으로 대체 |

레디니스: [status.md](./status.md) · 마감 맵: [status.md](./status.md).

### Bundled workflow skills (4종)

| Workflow skill | 목적 | bundled source | 근거 |
|---|---|---|---|
| `jaw-interview` | IPABCD **I** — Socratic interview → `.jwc/specs/`; **99.30.02부터 핸드오프가 `jwc orchestrate p --spec-ref`로 재배선** | `defaults/gjc/skills/jaw-interview/SKILL.md` | `gjc-defaults.ts:13`, `8e17a1ce` |
| `ralplan` | ⚠️ **99.30.02 supersession** — ralplan SKILL은 superseded(스텁), 플래닝은 `jwc orchestrate p`(네이티브)로 이전. autocomplete 상단 핀도 `/orchestrate`·`/goal`로 교체, ralplan 핀 강등 | `ralplan/SKILL.md`(스텁) | `8e17a1ce` (99.30.02 ralplan 이별), [fork-delta.md](./fork-delta.md) |
| `ultragoal` | Goal ledger (ultragoal 엔진) → `.jwc/ultragoal/`; **99.30.02부터 플래닝 전제(prerequisite)가 네이티브화** | `ultragoal/SKILL.md` | 060 + 99, `8e17a1ce` |
| `team` | IPABCD **B** — tmux workers → `.jwc/state/team/` | `team/SKILL.md` | |

### 99.08 PABCD–goal 융합 (260613)

- **99.08-A** (`09f7fb20`): 매 턴 `pabcd-stage-context` 헤더(prompt_flow 레일 #4)에 현재 goal
  objective를 병기 — 단계 컨텍스트와 목표가 한 헤더에 같이 주입된다.
- **99.08-B** (`a771f492`): `jwc orchestrate` 전이가 일어날 때마다 goal 체크포인트를 자동 기록 —
  수동 `/goal` 호출 없이 단계 진행이 ledger에 남는다.
- 근거: [prompt_flow.md](./prompt_flow.md) 99.03/99.08 표.

### Upstream baseline vs jwc runtime

| 계층 | upstream gajae-code `[기본값]` | jwc runtime `[기본값]` | 호환 |
|---|---|---|---|
| bundled skill slug | `deep-interview` | `jaw-interview` | `/skill:deep-interview` alias, legacy state read-normalize |
| system prompt routing | `deep-interview` | `jaw-interview` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:63` |
| CLI subcommand | (upstream `deep-interview`) | `jwc interview` alias `deep-interview` — **jaw 브랜드 전용 등록**(D050-24/25 `jawOnlyCommands` 게이트; legacy upstream bin은 `/skill:jaw-interview` 경로만) | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/cli.ts` `jawOnlyCommands` |
| persisted state slug | `deep-interview` (legacy) | write는 `jaw-interview` only | `normalizeWorkflowSkillSlug()` read-compat — `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/gjc-runtime/state-schema.ts:17`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/gjc-runtime/state-schema.ts:24` |

### Bundling / Load Contract

| 항목 | 현재 계약 | 근거 |
|---|---|---|
| default names | `["jaw-interview", "ralplan", "team", "ultragoal"]` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| embedded imports | 4개 `SKILL.md`와 fragment 3개가 TS import로 bundled 된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:74` |
| session invariant | explicit `options.skills`가 있어도 4 workflow skill을 보존한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1003`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1019` |
| repo-visible `.jwc` defaults | commit하지 않는다. runtime user/project `.jwc` discovery는 지원한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:27`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:28` |

### Skill별 계약

| Skill | Pipeline / phases | Artifact 경로 | Gate 정책 | 근거 |
|---|---|---|---|---|
| `jaw-interview` | Phase 0 ambiguity threshold → Phase 1 initialize → Round 0 topology gate → Phase 2 interview loop → Phase 3 challenge agents → Phase 4 crystallize spec → Phase 5 execution bridge. | handoff `.jwc/specs/jaw-interview-{slug}.md`; legacy spec glob은 `{jaw-interview,deep-interview,deep}-*.md` 호환 읽기. | ambiguity threshold와 topology gate가 blocking prerequisite. 실행은 승인 전 금지. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:7`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:78`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/jaw-interview/structured-renderer.ts:1` |
| `ralplan` | consensus planning alias; planner/architect/critic loop; pre-execution gate. | `.jwc/plans/` 아래 plan. | planning/execution boundary와 pre-execution gate가 있음. pending approval까지가 기본. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:10`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:36`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:93`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:120` |
| `ultragoal` | create goals → complete goals → dynamic steering → delegation guidance → completion cleanup/review gate. | `.jwc/ultragoal/` durable ledger. | completion cleanup and review gate가 mandatory. team과 함께 쓸 수 있음. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:12`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:106`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:175` |
| `team` | invocation contract → pre-context intake gate → runtime behavior → required lifecycle → commands/data/control planes. | `.jwc/state/team/`, mailbox/dispatch APIs, tmux panes. | pre-context intake gate, team-first launch contract, active leader monitoring rule. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:37`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:97`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:221` |

### Routing 규칙

| 상황 | 기본 workflow | 근거 |
|---|---|---|
| 명확하고 낮은 위험의 구현 | direct implementation | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:62` |
| intent/scope/acceptance criteria가 모호함 | `jaw-interview` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:63` |
| 요구사항은 충분하나 architecture/sequence/verification consensus 필요 | `ralplan` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:64` |
| durable goal ledger 필요 | `ultragoal` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:65` |
| 승인된 작업이 병렬 worker 이득을 봄 | `team` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:66` |

### jaw workflow 병합 상태

| 밴드 | 병합 대상 | 상태 | 근거 |
|---|---|---|---|
| 040 | `jaw-interview` (구 `deep-interview` + jaw Interview) | `[확정]` 구현 완료 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/phase1/042_diff_jaw_interview.md:3` |
| 050 | `ralplan` + PABCD + orchestrate | 런타임 ✅ · discovery **99.03** | `status`, `050_plan/02_code_facts` |
| 060 | `ultragoal` + `jwc goal` | 런타임 ✅ | `060_goal` |
| 030/050 | `team` + dispatch/PABCD | 대기 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:12` |
