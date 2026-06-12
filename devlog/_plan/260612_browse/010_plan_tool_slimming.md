# 010 Plan — browser tool definition slimming

> 상태: 스캐폴딩 ✅
> 목표: 기본 요청마다 상주하는 `browser` tool schema/description 비용을 줄인다.

## Phase split

- Current pass: planning docs + subagent review only. No product source mutation.
- Implementation MVP: prompt slimming, guidance relocation, token measurement, smoke verification.
- Follow-up: compact schema, settings/routing defaults, cli-jaw/AGBrowse runtime features.

## Target files

| 파일 | 변경 |
|---|---|
| `packages/coding-agent/src/prompts/tools/browser.md` | 긴 instruction/examples를 browse skill로 이동하고 10~20줄 affordance만 유지 |
| `packages/coding-agent/src/tools/browser.ts` | schema `.describe()` 축약/삭제, description 유지 경로 확인 |
| chosen non-workflow tool-help path (TBD before implementation) | 긴 browser 조작법 보관. Until chosen, source text remains `devlog/_plan/260612_browse/020_skill_definition/SKILL.md` |
| `packages/coding-agent/src/config/settings-schema.ts` | MVP에서 제외. 필요 시 follow-up에서만 `browser.skillHint`/skill discovery 기본값 검토 |

## Implementation MVP

1. `browser.md`를 다음 정보만 남기도록 축소한다.
   - open/close/run/act 네 가지 action 존재.
   - static web은 `read` 우선, JS/interactive/auth 필요 시 browser.
   - 자세한 조작법은 browse tool-help artifact.
   - `open` 선행 requirement.
2. 현재 긴 `browser.md` 내용은 선택된 non-workflow browse tool-help 경로로 옮긴다. 구현 전까지 draft source는 `devlog/_plan/260612_browse/020_skill_definition/SKILL.md`다.
3. `browser.ts` zod `.describe()`는 모델 선택에 필수인 것만 남긴다.
4. token estimate 명령으로 `browser` 단독과 active tools 합계 전후를 기록한다.
5. public workflow skill registration, `/skill:browse` entrypoint, settings/routing defaults는 MVP에서 제외한다.

## Follow-up — optional compact schema

1차 이후에도 `browser`가 2K 이상이면 다음 envelope를 검토한다.

```ts
const browserSchema = z.object({
  action: z.enum(["open", "close", "run", "act"]),
  name: z.string().optional(),
  url: z.string().optional(),
  code: z.string().optional(),
  actions: z.array(z.record(z.string(), z.unknown())).optional(),
  options: z.record(z.string(), z.unknown()).optional(),
});
```

Tradeoff:

| 장점 | 단점 |
|---|---|
| schema token 대폭 감소 | provider-side structured validation 약화 |
| 새 verb/options 추가 쉬움 | 모델이 skill을 안 읽으면 실수 증가 |


Implementation rule: do not compact to `z.record(...)` in the first pass. If a later pass adopts this envelope, keep runtime verb validation and concise actionable validation errors.
## Acceptance

- 기본 active tool set에서 `browser` token estimate가 감소한다.
- Target: `browser` 단독 추정치가 기존 약 4.5K에서 2.5K 이하가 된다. 미달 시 residual cost breakdown을 기록한다.
- `browser` smoke scenario가 유지된다.
- browse tool-help 없이도 최소 `open`/`close`는 이해 가능하다.
- browse tool-help를 읽으면 기존 긴 설명 수준의 현재 jwc browser 조작법이 복원된다.
- fifth bundled workflow skill이나 public `/skill:browse` entrypoint를 추가하지 않는다.

## Token measurement

Use the repo-local token estimator pattern from the investigation. Record both before and after in this file or the implementation receipt.

```bash
bun -e 'import { createTools } from "./packages/coding-agent/src/tools/index.ts"; import { Settings } from "./packages/coding-agent/src/config/settings.ts"; import { countTokens } from "@gajae-code/natives"; const settings=Settings.isolated({"inspect_image.enabled":true,"calc.enabled":false,"github.enabled":false,"checkpoint.enabled":false,"renderMermaid.enabled":false}); const session={cwd:process.cwd(),hasUI:true,settings,getSessionFile:()=>null,getSessionSpawns:()=>null,enableLsp:true,skipPythonPreflight:true,skills:[{name:"jaw-interview",description:"",path:""}],getAgentId:()=>"0-Main",agentRegistry:{}}; const tools=await createTools(session); const rows=tools.map(t=>{let schema=""; try{schema=JSON.stringify(t.parameters??{});}catch{} return {name:t.name, mode:t.loadMode, total:countTokens([t.name,t.description??"",schema])};}).sort((a,b)=>b.total-a.total); console.table(rows.filter(r=>r.name==="browser")); console.log("total", rows.reduce((s,r)=>s+r.total,0), "count", rows.length);'
```

## Verification

- Token check: command above shows `browser` below target or records why not.
- Smoke: start a jwc session with browser enabled and run `open` on `https://example.com`, then `act` with `{ "verb": "observe" }`, then `close`; pass = no tool error and observe returns page state.
- Skill scenario: with browse guidance injected, ask for an interactive page workflow; pass = model chooses observe-first, re-observes after navigation, and reserves raw `run` for conditional logic.
- Doc-only MVP: project-wide gates are intentionally skipped because no product source is changed.

## Non-goals

- cli-jaw web-ai runtime 포팅.
- Playwright 전환.
- browser backend adapter.

## Rollback

Revert `packages/coding-agent/src/prompts/tools/browser.md`, `packages/coding-agent/src/tools/browser.ts`, the chosen browse tool-help file/path, and any routing/settings edits introduced by the implementation. Keep before/after token numbers in devlog as rollback evidence.
