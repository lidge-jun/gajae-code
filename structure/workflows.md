# Default Workflow Skills

> jwc의 공개 workflow surface는 기본 4종 + **native IPABCD orchestration**(`jwc orchestrate`)이다.
> fork 런타임 기준 canonical slug는 `jaw-interview`이며, upstream `AGENTS.md`는 아직 `deep-interview` 표기를 유지한다 `[기본값]`.

## Native orchestration (050 — 런타임 ✅ / discovery ⬜ 99.03)

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

레디니스: [jwc_readiness.md](./jwc_readiness.md) · 마감 맵: [m1_closeout.md](./m1_closeout.md).

## Bundled workflow skills (4종)

| Workflow skill | 목적 | bundled source | 근거 |
|---|---|---|---|
| `jaw-interview` | IPABCD **I** — Socratic interview → `.jwc/specs/`; **99.30.02부터 핸드오프가 `jwc orchestrate p --spec-ref`로 재배선** | `defaults/gjc/skills/jaw-interview/SKILL.md` | `gjc-defaults.ts:13`, `8e17a1ce` |
| `ralplan` | ⚠️ **99.30.02 supersession** — ralplan SKILL은 superseded(스텁), 플래닝은 `jwc orchestrate p`(네이티브)로 이전. autocomplete 상단 핀도 `/orchestrate`·`/goal`로 교체, ralplan 핀 강등 | `ralplan/SKILL.md`(스텁) | `8e17a1ce` (99.30.02 ralplan 이별), [fork-delta.md](./fork-delta.md) |
| `ultragoal` | Goal ledger (ultragoal 엔진) → `.jwc/ultragoal/`; **99.30.02부터 플래닝 전제(prerequisite)가 네이티브화** | `ultragoal/SKILL.md` | 060 + 99, `8e17a1ce` |
| `team` | IPABCD **B** — tmux workers → `.jwc/state/team/` | `team/SKILL.md` | |

## 99.08 PABCD–goal 융합 (260613)

- **99.08-A** (`09f7fb20`): 매 턴 `pabcd-stage-context` 헤더(prompt_flow 레일 #4)에 현재 goal
  objective를 병기 — 단계 컨텍스트와 목표가 한 헤더에 같이 주입된다.
- **99.08-B** (`a771f492`): `jwc orchestrate` 전이가 일어날 때마다 goal 체크포인트를 자동 기록 —
  수동 `/goal` 호출 없이 단계 진행이 ledger에 남는다.
- 근거: [prompt_flow.md](./prompt_flow.md) 99.03/99.08 표.

## Upstream baseline vs jwc runtime

| 계층 | upstream gajae-code `[기본값]` | jwc runtime `[기본값]` | 호환 |
|---|---|---|---|
| bundled skill slug | `deep-interview` | `jaw-interview` | `/skill:deep-interview` alias, legacy state read-normalize |
| system prompt routing | `deep-interview` | `jaw-interview` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/prompts/system/system-prompt.md:63` |
| CLI subcommand | (upstream `deep-interview`) | `jwc interview` alias `deep-interview` — **jaw 브랜드 전용 등록**(D050-24/25 `jawOnlyCommands` 게이트; legacy upstream bin은 `/skill:jaw-interview` 경로만) | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/cli.ts` `jawOnlyCommands` |
| persisted state slug | `deep-interview` (legacy) | write는 `jaw-interview` only | `normalizeWorkflowSkillSlug()` read-compat — `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/gjc-runtime/state-schema.ts:17`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/gjc-runtime/state-schema.ts:24` |

## Bundling / Load Contract

| 항목 | 현재 계약 | 근거 |
|---|---|---|
| default names | `["jaw-interview", "ralplan", "team", "ultragoal"]` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13` |
| embedded imports | 4개 `SKILL.md`와 fragment 3개가 TS import로 bundled 된다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:3`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:74` |
| session invariant | explicit `options.skills`가 있어도 4 workflow skill을 보존한다. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1003`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/sdk.ts:1019` |
| repo-visible `.jwc` defaults | commit하지 않는다. runtime user/project `.jwc` discovery는 지원한다. | `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:27`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:28` |

## Skill별 계약

| Skill | Pipeline / phases | Artifact 경로 | Gate 정책 | 근거 |
|---|---|---|---|---|
| `jaw-interview` | Phase 0 ambiguity threshold → Phase 1 initialize → Round 0 topology gate → Phase 2 interview loop → Phase 3 challenge agents → Phase 4 crystallize spec → Phase 5 execution bridge. | handoff `.jwc/specs/jaw-interview-{slug}.md`; legacy spec glob은 `{jaw-interview,deep-interview,deep}-*.md` 호환 읽기. | ambiguity threshold와 topology gate가 blocking prerequisite. 실행은 승인 전 금지. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:7`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:78`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/jaw-interview/structured-renderer.ts:1` |
| `ralplan` | consensus planning alias; planner/architect/critic loop; pre-execution gate. | `.jwc/plans/` 아래 plan. | planning/execution boundary와 pre-execution gate가 있음. pending approval까지가 기본. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:10`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:36`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:93`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md:120` |
| `ultragoal` | create goals → complete goals → dynamic steering → delegation guidance → completion cleanup/review gate. | `.jwc/ultragoal/` durable ledger. | completion cleanup and review gate가 mandatory. team과 함께 쓸 수 있음. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:12`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:106`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md:175` |
| `team` | invocation contract → pre-context intake gate → runtime behavior → required lifecycle → commands/data/control planes. | `.jwc/state/team/`, mailbox/dispatch APIs, tmux panes. | pre-context intake gate, team-first launch contract, active leader monitoring rule. | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:37`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:51`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:97`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/team/SKILL.md:221` |

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
| 040 | `jaw-interview` (구 `deep-interview` + jaw Interview) | `[확정]` 구현 완료 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/phase1/042_diff_jaw_interview.md:3` |
| 050 | `ralplan` + PABCD + orchestrate | 런타임 ✅ · discovery **99.03** | `m1_closeout`, `050_plan/02_code_facts` |
| 060 | `ultragoal` + `jwc goal` | 런타임 ✅ | `060_goal` |
| 030/050 | `team` + dispatch/PABCD | 대기 | `/Users/jun/Developer/new/700_projects/jawcode/devlog/_plan/260612_jawcode_fork/phase1/05_interview_conclusions.md:12` |
