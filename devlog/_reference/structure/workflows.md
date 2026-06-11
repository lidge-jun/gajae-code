# Default Workflow Skills

> GJC/JWC의 공개 workflow surface는 기본 4종이다. 이 문서는 skill별 pipeline, artifact 경로, gate 정책만 기록한다.

## 공개 surface

| Workflow skill | 목적 | bundled source | 근거 |
|---|---|---|---|
| `deep-interview` | Socratic requirements interview. `.gjc/specs/` 아래 approved spec 산출. | `packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:5`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:9` |
| `ralplan` | consensus planning + approval gate. `.gjc/plans/` 아래 plan 산출. | `packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:10` |
| `ultragoal` | durable multi-goal execution ledger. `.gjc/ultragoal/` 사용. | `packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:11` |
| `team` | tmux-backed parallel execution. `.gjc/state/team/` 사용. | `packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:12` |

## Bundling / Load Contract

| 항목 | 현재 계약 | 근거 |
|---|---|---|
| default names | `["deep-interview", "ralplan", "team", "ultragoal"]` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| embedded imports | 4개 `SKILL.md`와 fragment 3개가 TS import로 bundled 된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:7`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:74` |
| session invariant | explicit `options.skills`가 있어도 4 workflow skill을 보존한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1003`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1019` |
| repo-visible `.gjc` defaults | commit하지 않는다. runtime user/project `.gjc` discovery는 지원한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:24`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:25` |

## Skill별 계약

| Skill | Pipeline / phases | Artifact 경로 | Gate 정책 | 근거 |
|---|---|---|---|---|
| `deep-interview` | Phase 0 ambiguity threshold → Phase 1 initialize → Round 0 topology gate → Phase 2 interview loop → Phase 3 challenge agents → Phase 4 crystallize spec → Phase 5 execution bridge. | spec template가 `# Deep Interview Spec`이며 `.gjc/specs/` handoff를 전제로 한다. | ambiguity threshold와 topology gate가 blocking prerequisite. 실행은 승인 전 금지. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md:75`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md:168`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md:418`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md:784` |
| `ralplan` | consensus planning alias; planner/architect/critic loop; pre-execution gate. | `.gjc/plans/` 아래 plan. | planning/execution boundary와 pre-execution gate가 있음. pending approval까지가 기본. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:10`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:36`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:93`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:120` |
| `ultragoal` | create goals → complete goals → dynamic steering → delegation guidance → completion cleanup/review gate. | `.gjc/ultragoal/` durable ledger. | completion cleanup and review gate가 mandatory. team과 함께 쓸 수 있음. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:12`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:106`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:175` |
| `team` | invocation contract → pre-context intake gate → runtime behavior → required lifecycle → commands/data/control planes. | `.gjc/state/team/`, mailbox/dispatch APIs, tmux panes. | pre-context intake gate, team-first launch contract, active leader monitoring rule. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:37`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:97`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:221` |

## Routing 규칙

| 상황 | 기본 workflow | 근거 |
|---|---|---|
| 명확하고 낮은 위험의 구현 | direct implementation | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:33` |
| intent/scope/acceptance criteria가 모호함 | `deep-interview` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:34` |
| 요구사항은 충분하나 architecture/sequence/verification consensus 필요 | `ralplan` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:35` |
| durable goal ledger 필요 | `ultragoal` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:36` |
| 승인된 작업이 병렬 worker 이득을 봄 | `team` | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:37` |

## jaw workflow 병합 방향

| 밴드 | 병합 대상 | 기준 |
|---|---|---|
| 040 | `deep-interview` + jaw I | ambiguity score/topology/spec handoff + 4차원 tracker/known-unknown/negativity bias. 근거: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:16` |
| 050 | `ralplan` + jaw P/A + PABCD command | consensus loop/pending approval + P/A gate/user checkpoint. 근거: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:17` |
| 060 | `ultragoal` + jaw goal | checkpoint/evidence/pause-audit mapping. 근거: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/000_roadmap.md:18` |
| 030/050 | `team` + dispatch/PABCD | team은 dispatch 대응 workflow로 분류. 근거: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/05_interview_conclusions.md:12` |
