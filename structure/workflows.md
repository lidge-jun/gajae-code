# Default Workflow Skills

> GJC/JWC의 공개 workflow surface는 기본 4종이다. 이 문서는 skill별 pipeline, artifact 경로, gate 정책만 기록한다.
> fork 런타임 기준 canonical slug는 `jaw-interview`이며, upstream `AGENTS.md`는 아직 `deep-interview` 표기를 유지한다 `[기본값]`.

## 공개 surface

| Workflow skill | 목적 | bundled source | 근거 |
|---|---|---|---|
| `jaw-interview` | Socratic requirements interview. `.gjc/specs/jaw-interview-{slug}.md` 아래 approved spec 산출. | `packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:1` |
| `ralplan` | consensus planning + approval gate. `.gjc/plans/` 아래 plan 산출. | `packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:12` |
| `ultragoal` | durable multi-goal execution ledger. `.gjc/ultragoal/` 사용. | `packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:13` |
| `team` | tmux-backed parallel execution. `.gjc/state/team/` 사용. | `packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:14` |

## Upstream contract vs fork runtime

| 계층 | upstream `AGENTS.md` `[기본값]` | fork runtime `[기본값]` | 호환 |
|---|---|---|---|
| bundled skill slug | `deep-interview` | `jaw-interview` | `/skill:deep-interview` alias, legacy state read-normalize |
| system prompt routing | `deep-interview` | `jaw-interview` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:63` |
| CLI subcommand | (upstream `deep-interview`) | `jwc interview` alias `deep-interview` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/cli.ts:50` |
| persisted state slug | `deep-interview` (legacy) | write는 `jaw-interview` only | `normalizeWorkflowSkillSlug()` read-compat — `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/gjc-runtime/state-schema.ts:17`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/gjc-runtime/state-schema.ts:24` |

## Bundling / Load Contract

| 항목 | 현재 계약 | 근거 |
|---|---|---|
| default names | `["jaw-interview", "ralplan", "team", "ultragoal"]` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| embedded imports | 4개 `SKILL.md`와 fragment 3개가 TS import로 bundled 된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:74` |
| session invariant | explicit `options.skills`가 있어도 4 workflow skill을 보존한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1003`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1019` |
| repo-visible `.gjc` defaults | commit하지 않는다. runtime user/project `.gjc` discovery는 지원한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:27`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:28` |

## Skill별 계약

| Skill | Pipeline / phases | Artifact 경로 | Gate 정책 | 근거 |
|---|---|---|---|---|
| `jaw-interview` | Phase 0 ambiguity threshold → Phase 1 initialize → Round 0 topology gate → Phase 2 interview loop → Phase 3 challenge agents → Phase 4 crystallize spec → Phase 5 execution bridge. | handoff `.gjc/specs/jaw-interview-{slug}.md`; legacy spec glob은 `{jaw-interview,deep-interview,deep}-*.md` 호환 읽기. | ambiguity threshold와 topology gate가 blocking prerequisite. 실행은 승인 전 금지. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:7`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:78`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/jaw-interview/structured-renderer.ts:1` |
| `ralplan` | consensus planning alias; planner/architect/critic loop; pre-execution gate. | `.gjc/plans/` 아래 plan. | planning/execution boundary와 pre-execution gate가 있음. pending approval까지가 기본. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:10`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:36`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:93`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:120` |
| `ultragoal` | create goals → complete goals → dynamic steering → delegation guidance → completion cleanup/review gate. | `.gjc/ultragoal/` durable ledger. | completion cleanup and review gate가 mandatory. team과 함께 쓸 수 있음. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:12`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:106`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:175` |
| `team` | invocation contract → pre-context intake gate → runtime behavior → required lifecycle → commands/data/control planes. | `.gjc/state/team/`, mailbox/dispatch APIs, tmux panes. | pre-context intake gate, team-first launch contract, active leader monitoring rule. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:37`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:97`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:221` |

## Routing 규칙

| 상황 | 기본 workflow | 근거 |
|---|---|---|
| 명확하고 낮은 위험의 구현 | direct implementation | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:62` |
| intent/scope/acceptance criteria가 모호함 | `jaw-interview` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:63` |
| 요구사항은 충분하나 architecture/sequence/verification consensus 필요 | `ralplan` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:64` |
| durable goal ledger 필요 | `ultragoal` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:65` |
| 승인된 작업이 병렬 worker 이득을 봄 | `team` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:66` |

## jaw workflow 병합 상태

| 밴드 | 병합 대상 | 상태 | 근거 |
|---|---|---|---|
| 040 | `jaw-interview` (구 `deep-interview` + jaw Interview) | `[확정]` 구현 완료 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/042_diff_jaw_interview.md:3` |
| 050 | `ralplan` + jaw P/A + PABCD command | 진행 중 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:17` |
| 060 | `ultragoal` + jaw goal | 대기 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:18` |
| 030/050 | `team` + dispatch/PABCD | 대기 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:12` |
