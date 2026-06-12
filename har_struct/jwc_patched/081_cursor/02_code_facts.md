# 081_cursor — code facts (jwc_patched)

> MOC `081_moc_cursor_tools.md`에서 추출한 경로·팩트 + devlog `081*` 플랜.

## 1. 경로 인벤토리 (MOC 인용)

| # | path |
|---:|---|
| 1 | `(MOC에 경로 없음 — structure/ 참조)` |

## 2. devlog 플랜·diff 발췌

### `081.1_issue_toolcall_render.md`

```markdown
# 081.1 — issue: TUI에 도구 호출이 하나도 안 그려지는 문제 (cursor 파서 드롭)

> 상태: 🔍 원인 확정(신뢰도 95%) / **수정 ✅ (A안, 260612 08시) — 검증 대기**. 조사: Opus 서브에이전트, 2026-06-12 06시.
> 수정: `cursor.ts` `processInteractionUpdate`의 `toolCallStarted`에 `buildNativeToolCallBlock` 폴백 추가
> — mcp/todo가 아닌 ToolCall oneof variant(shell/glob/grep/…)를 `*ToolCall` 키 스캔으로 잡아 `kind:"native"`
> 블록 push + `toolcall_start` emit. `cursorNativeToolName` 별칭 테이블은 cli-jaw `cursorToolKindLabel` 차용
> (`shell→bash`, `semSearch→codebase_search` 등). `ToolCallState.kind`에 `"native"` 추가. 타입체크·biome 통과.
> 검증: `jwc`(로컬 소스 symlink)로 cursor 모델에 도구 호출 유도 → TUI에 도구 행 렌더 확인.
> 소속: 080 밴드 (발현 표면 = TUI). 자매 이슈: [081.2](./081.2_issue_title_hallucination.md)·[081.3](./081.3_issue_exec_unbound.md) — 셋 다 **별개 원인**.
> 후속: 본 폴백으로 도구가 렌더되자 진짜 실행 실패([081.3](./081.3_issue_exec_unbound.md), exec 핸들러 unbound this)가 드러나 확정·수정됨.
> 판정: **업스트림 gjc cursor 통합 코드의 문제. TUI(080 밴드)는 무죄.** (업스트림 동일 코드 확인 — 아래 정정)
> **착수 시점: 밴드 순서 무관 — 즉시 가능 (hotfix 트랙).** M1 산출물 의존 0, 수정 파일은 fork 로컬 `cursor.ts`뿐.

260612 05:01 세션(gjc v0.4.4 + `cursor/composer-2.5-fast`)에서 에이전트가 도구를 시도하는 동안
TUI 트랜스크립트에는 텍스트 줄만 보이고 **도구 행(이름/진행/에러)이 단 하나도 렌더되지 않았다**.
원인은 TUI가 아니라 **cursor 프로바이더의 응답 파서**다: Cursor 백엔드의 `agent.v1.ToolCall`
protobuf 컨테이너는 oneof로 약 30종의 도구 variant를 갖는데, gjc 파서는 그중 **2종만 처리**하고
나머지(네이티브 `shellToolCall`/`globToolCall`/`grepToolCall` 등)는 **조용히 버린다**. toolCall
콘텐츠 블록이 push되지 않고 `toolcall_start` 이벤트도 발생하지 않으므로 TUI에 전달될 것이 없다.

## 확정 원인 (신뢰도 95%) — 메커니즘 체인

1. **파서 드롭 지점** — `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/src/providers/cursor.ts:1955-1991`
   (`processInteractionUpdate`, `toolCallStarted` 케이스):
   - `:1958-1974` `mcpToolCall`이면 → toolCall 블록 push + `toolcall_start` emit
   - `:1976-1990` `updateTodosToolCall`(`buildTodoWriteArgs`)이면 → push + emit
   - **그 외 전부** (`shellToolCall`, `globToolCall`, `grepToolCall`, `readToolCall`, `lsToolCall`,
     `editToolCall` 등): 분기 끝 도달 → push도 emit도 없이 드롭
2. **스키마 증거** — `packages/ai/src/providers/cursor/gen/agent_pb.ts:1139` `agent.v1.ToolCall` oneof:
   `shellToolCall`(1), `globToolCall`(4), `grepToolCall`(5), `readToolCall`(8), `lsToolCall`(13),
   `mcpToolCall`(15) 등 약 30개 variant. `grep shellToolCall cursor.ts` → **0건** (파서가 참조 안 함).
3. **TUI 무죄 (가설 H2·H3 기각)** — `packages/coding-agent/src/modes/utils/ui-helpers.ts:371` 및
   `modes/controllers/event-controller.ts:356`: `getToolByName()`이 undefined여도 **조건 없이**
   `ToolExecutionComponent`를 생성하고, `tool-execution.ts:188`이 `tool?.label ?? toolName`으로
   폴백한다. 미등록 도구 필터링/early-return이 없으므로, toolCall 블록이 존재하기만 했다면 무조건 그려진다.

## 증거

- **실패 세션**: `/Users/jun/.gjc/agent/sessions/-Developer-new/2026-06-11T20-01-29-356Z_019eb846-830c-7000-a938-3ab76e7178da.jsonl`
  (총 5줄) — assistant 콘텐츠 블록은 `["text","thinking"]`뿐, `toolCall` 블록 0개:
  ```json
  {"type":"text","text":"여러 도구를 동시에 호출해 동작 여부를 확인합니다.\n일부 도구에서 오류가 있어 다시 시도합니다.\n"}
  {"type":"thinking","thinking":"환경 문제로 여러 도구가 실패하고 있다."}
  ```
  (TUI 스크린샷의 3줄과 정확히 일치 — TUI는 받은 것을 전부 그렸다.)
```

### `081.2_issue_title_hallucination.md`

```markdown
# 081.2 — issue: 환각 세션 타이틀 저장 (title-generator 환각)

> 상태: 🔍 원인 확정(신뢰도 90%) / **수정 ✅ (A안, 260612 08시) — 검증 대기**. 조사: Opus 서브에이전트, 2026-06-12 06시.
> 수정: `title-generator.ts` `extractGeneratedTitle`에 평문 폴백 길이 가드 (toolCall 없는 평문이
> 80자/12단어 초과면 "" 반환 → 호출자 fallback). 상수 `MAX_TITLE_CHARS=80`/`MAX_TITLE_WORDS=12`. 타입체크·biome 통과.
> 검증: `jwc`(로컬 소스 symlink)로 cursor 모델 첫 메시지 → 세션 타이틀에 환각 서사 미저장 확인.
> 소속: 080 밴드 (발현 표면 = TUI 세션 타이틀). 자매 이슈: [081.1](./081.1_issue_toolcall_render.md)·[081.3](./081.3_issue_exec_unbound.md) — 셋 다 **별개 원인**.
> 주의: 본 이슈(타이틀 환각)는 "도구가 실패한 것처럼 보인" 표면일 뿐이고, **실제 도구 실행이 안 되던
> 근본 원인은 [081.3](./081.3_issue_exec_unbound.md)(exec 핸들러 unbound this)**다. 081 렌더 수정 후 드러남.
> **착수 시점: 밴드 순서 무관 — 즉시 가능 (hotfix 트랙).** M1 산출물 의존 0, 수정 파일은 `title-generator.ts`뿐.

260612 05:01, `/Users/jun/Developer/new`에서 gjc v0.4.4 TUI + `cursor/composer-2.5-fast`로
"tool 여러개 써봐 되는지"를 시켰더니, 모델이 `Shell → Rejected: Tool not available`,
`Glob`/`Grep → Tool not available`, `mcp_pi-agent_set_title → MCP 도구 없음`이라고 보고했다.
조사 결과 이것은 **실제 도구 실행 실패가 아니다**. 진짜 에이전트 턴에는 toolCall이 하나도 emit되지
않았고, 문제의 실패 서사는 **타이틀 생성기가 호출한 composer 모델의 환각 출력이 세션 제목으로
그대로 저장된 것**이다.

## 확정 원인 (신뢰도 90%)

메커니즘 체인:

1. 타이틀 생성기는 `toolChoice: {type:"tool", name:"set_title"}`로 도구 호출을 **강제**한다 —
   `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/utils/title-generator.ts:123`
2. `composer-2.5-fast`는 이 강제를 무시하고, set_title 호출 대신 **"여러 도구를 호출해봤는데 실패했다"는
   가짜 서사를 평문으로 생성**했다 (379 토큰).
3. `extractGeneratedTitle`은 toolCall이 없으면 평문 텍스트 전체를 제목으로 채택한다 —
   `title-generator.ts:160`, 채택 분기 `:168-172`. 길이/형식 가드가 없다.
4. 그 결과 "3–6단어 제목" 자리에 환각 실패 서사 전체가 들어갔고, 사용자에게 실제 도구 실패처럼 보였다.

## 증거

- **로그**: `/Users/jun/.gjc/logs/gjc.2026-06-12.log` `05:01:49.212` `"title-generator: response"`,
  `model:"cursor/composer-2.5-fast"`, `output:379` — 응답 본문이 세션 `title` 필드와 글자 단위로 동일.
- **세션 JSONL**: `/Users/jun/.gjc/agent/sessions/-Developer-new/2026-06-11T20-01-29-356Z_019eb846-830c-7000-a938-3ab76e7178da.jsonl`
  — `toolCall` 블록 0개, toolResult 0개, "Rejected" 이벤트 0개. 마지막 레코드는
  `stopReason:"aborted"` + `errorMessage:"Operation aborted"` (사용자 esc 중단).
- **"Tool not available" 실제 발생 지점은 이번에 타지 않음**:
  `/Users/jun/Developer/new/700_projects/jawcode/packages/ai/src/providers/cursor.ts:1255-1257`
  `buildRejected("Tool not available")` — Cursor 백엔드의 server-driven exec에 대응하는
  `execHandlers`가 없을 때만 발생. 세션에 exec 이벤트 자체가 없었다.
- **에이전트 런타임의 execHandlers 배선은 정상**: `packages/coding-agent/src/sdk.ts:1540`
  (`new CursorExecHandlers({cwd, tools, …})`) → `sdk.ts:1884` → `packages/agent/src/agent.ts:1153,1194`
  → `packages/ai/src/stream.ts:859-864`.

```

### `081.3_issue_exec_unbound.md`

```markdown
# 081.3 — issue: cursor 도구 실행이 전부 실패 (exec 핸들러 unbound this)

> 상태: ✅ **원인 확정(100%) + 수정 완료 + 격리 재현 + 사용자 e2e 검증 완료** (260612 08시).
> e2e: `jwc`로 "tool 10개" 재현 → Bash 실제 출력(`pwd && ls -la`), Read package.json, Grep/Find/Search,
> Web Search(DuckDuckGo 실결과), MCP 도구(CronList/IRC/Job) 전부 **실제 실행·렌더**. 환각 텍스트 아님 확정.
> 소속: 080 밴드 (cursor 파이프라인). 선행: [081.1](./081.1_issue_toolcall_render.md)(렌더)·[081.2](./081.2_issue_title_hallucination.md)(타이틀 환각).
> **착수 시점: 밴드 순서 무관 (hotfix 트랙).** 수정 파일은 `packages/agent/src/agent.ts` 1곳.

081 폴백을 넣어 cursor 네이티브 도구가 TUI에 렌더되기 시작하자, **진짜 실행 실패**가 드러났다.
`jwc` + `cursor/composer-2.5-fast`로 도구 10회 호출 시 전부 실패:
- Shell(pwd/echo/date/…) → exit code 1, 출력 없음
- Glob/Grep/Read → `undefined is not an object (evaluating 'this.#optionsForCall')`

081/082는 "보이게/타이틀" 문제였고, **본 이슈가 도구가 실제로 안 돌던 근본 원인**이다.

## 확정 원인 (100%)

`packages/agent/src/agent.ts`의 `#cursorExecHandlersForRun(runId)`(L678~)가 run 가드(`#assertActiveRun`)를
씌우려고 각 핸들러를 래핑하는데, **소스 메서드를 인스턴스에서 분리(unbound)해서 호출**한다:

```ts
const source = this.#cursorExecHandlers;       // CursorExecHandlers 인스턴스
const read = source.read;                       // ← 메서드를 bare로 추출 (this 분실)
guarded.read = async args => {
    this.#assertActiveRun(runId);
    const result = await read(args);            // ← this === undefined 로 호출
    ...
};
```

`CursorExecHandlers.read`/`shell`/`grep`/… 는 `this.#optionsForCall()`(private 메서드,
`packages/coding-agent/src/cursor.ts:166`)를 참조한다. `read(args)`를 분리 호출하면 `this`가
undefined가 되어 `this.#optionsForCall` 평가에서 던진다 →
**`undefined is not an object (evaluating 'this.#optionsForCall')`**. 이 에러를 provider의
`resolveExecHandler` catch(`cursor.ts`)가 받아 `buildError`/`buildShellFailureResult`로 변환 →
Grep/Read는 에러 텍스트, Shell은 exit code 1로 표면화된다.

provider dispatch가 `execHandlers?.read?.bind(execHandlers)`로 다시 bind하지만(cursor.ts:1009 등),
그 bind 대상은 이미 망가진 `guarded` 래퍼이고, 래퍼 내부의 `read(args)`는 여전히 분리 호출이라
무력하다.

## 증거 (격리 재현 — 에러 문자열 일치)

```ts
class H { constructor(private o:{x:number}){} #opt(){return this.o.x} async shell(a:{n:number}){return this.#opt()+a.n} }
```

### `081.4_issue_glob_empty_pattern.md`

```markdown
# 081.4 — issue: Glob 호출 시 "Pattern must not be empty"

> 상태: ✅ 원인 확정 + 수정 완료 (260612 09시). 소속: 081 cursor 도구군 ([081_moc_cursor_tools.md](./081_moc_cursor_tools.md)).
> 선행: [081.3](./081.3_issue_exec_unbound.md) 수정으로 도구가 실제 실행되자 드러난 경미 이슈.

081.1(렌더)+081.3(실행) 수정 후 "tool 10개" e2e에서 도구는 다 돌았으나, **Glob만 실패**:
`✘ Error: Pattern must not be empty`. 모델은 즉시 `find`/`search`로 자동 대체했지만, Glob 경로 자체가 깨져 있었다.

## 원인

cursor의 네이티브 **Glob** 도구는 별도 `globArgs` exec가 없고 **`grepArgs`로 도착**한다 (cursor exec
dispatch switch에 glob 케이스 없음 — `packages/ai/src/providers/cursor.ts`). 이때 content `pattern`은
비어 있고 `glob` 필드만 채워진다. 그런데 grep 핸들러가 그 빈 `pattern`을 그대로 `search` 도구에 넘긴다:

```ts
// packages/coding-agent/src/cursor.ts  (수정 전)
async grep(args) {
    const searchPath = args.glob ? `${args.path || "."}/${args.glob}` : args.path || ".";
    return executeTool(this.#optionsForCall(), "search", toolCallId, {
        pattern: args.pattern,   // ← 빈 문자열
        paths: [searchPath],
    });
}
```

`search` 도구는 빈 패턴을 거부한다 (`packages/coding-agent/src/tools/search.ts:244`
`throw new ToolError("Pattern must not be empty")`). → "파일명 glob 매칭"인데 content search로 라우팅돼
터진 것.

## 수정 (완료)

빈 `pattern`은 "이 glob에 맞는 파일 나열" 의도이므로, content search 대신 **`find` 도구**(glob path를
`paths`로 받음, `packages/coding-agent/src/tools/find.ts`)로 라우팅:

```ts
// packages/coding-agent/src/cursor.ts  (수정 후)
const pattern = typeof args.pattern === "string" ? args.pattern : "";
if (pattern.trim().length === 0) {
    const globPath = args.glob ? `${args.path || "."}/${args.glob}` : `${args.path || "."}/**/*`;
    return executeTool(this.#optionsForCall(), "find", toolCallId, { paths: [globPath] });
}
// 비어있지 않으면 기존 search 경로 유지
```

- 파일: `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/cursor.ts` (grep 핸들러)
```

### `081.5_audit_unbound_elsewhere.md`

```markdown
# 081.5 — audit: cursor 외 동형 패턴(unbound-this / oneof-drop / arg-mismatch) 전역 감사

> 상태: ✅ 감사 완료 (260612 09시). 조사: Opus 서브에이전트. 소속: 081 cursor 도구군 ([081_moc_cursor_tools.md](./081_moc_cursor_tools.md)).
> 목적: 081.3(unbound this)·081.1(oneof drop)·081.4(arg mismatch)와 **같은 클래스의 잠복 버그**가 다른 곳에도 있는지.

세 버그 클래스를 우선순위 패키지(`packages/agent`·`packages/ai`·`packages/coding-agent`) 중심으로 스캔.
**결론: Class A는 이미 고친 곳 외 클린, Class B에서 인접 위험 2곳(경미), Class C는 추가 없음.**

## Class A — unbound 메서드 추출 (081.3과 동형) → ✅ 클린

이미 고친 `agent.ts#cursorExecHandlersForRun` 외 **추가 실사례 0건**. 근거:
- `CursorExecHandlers` 메서드(`read/ls/grep/write/delete/shell/shellStream/diagnostics/mcp`)는 전부
  `this.#optionsForCall()`(private) 사용 → 진짜 위험군. 그러나 **소비처가 둘뿐이고 둘 다 안전**:
  - `agent.ts:687~` → `source.read?.bind(source)` (081.3 수정 완료)
  - `cursor.ts:1009/1022/1035/1048/1070/1084/1145/1159` + `824~825` → **전부 `?.bind(execHandlers)`**. 미바인딩 0건.
- 다른 후보(`agent.ts:1188 getApiKey`, `1203 beforeToolCall` 등)는 클래스 메서드가 아니라 **옵션으로 받은
  함수값 필드**(`this.getApiKey = opts.getApiKey`) — 자체 클로저라 bare 전달 정상.
- `.map/.forEach/setTimeout/.on(...)`에 인스턴스 메서드 bare 전달: **0건**.

## Class B — oneof/discriminated-union 부분 처리 후 silent drop (081.1과 동형) → 인접 위험 2곳 (경미)

| 파일:라인 | 심볼 | 위험 | 신뢰도 | 귀속 |
|---|---|---|---|---|
| `packages/ai/src/providers/openai-responses-server.ts:918` | `encodeStream` `switch(ev.type)` | `AssistantMessageEvent` 13 case만, **default 없음** → 새 이벤트 추가 시 SSE에서 조용히 소멸 | 추정·중 | 업스트림 공유 추정 |
| `packages/ai/src/providers/anthropic-messages-server.ts:528` | `encodeStream` `switch(ev.type)` | 동일 (13 case, default 없음) | 추정·중 | 업스트림 공유 추정 |

**심각도 완화**: 둘 다 **server-side 인코더** — 우리가 *직접 생성*하는 내부 union을 다룸(통제 가능). cursor의
081.1(외부 protobuf ~30 변종 *수신*)과 달리 외부 입력이 아님 → 위험 낮음. 단 default 부재로 미래 회귀 취약.
방어적 default(로그 warn 또는 `assertNever`) 권장.

낮은 위험(참고, 이론): `openai-chat-server.ts:71`, `openai-responses-server.ts:298`,
`anthropic-messages-server.ts:422` — default 없으나 상위 가드로 보호.

## Class C — 빈/누락 인자를 엄격한 downstream으로 forwarding (081.4와 동형) → 추가 없음

- `cursor.ts:186 grep` → **081.4에서 이미 수정** (빈 pattern → find).
- 나머지 cursor exec 핸들러(`write/shell/shellStream/mcp/diagnostics`): 빈 인자 폴백·가드 정상, 추가 미스매치 없음.

## 후속 수정 리스트 (우선순위)

1. **(추정·중) server 인코더 default 방어** — `openai-responses-server.ts:918` /
   `anthropic-messages-server.ts:528` `switch(ev.type)`에 default(로그 또는 assertNever) 추가. 같은 union이라 한 번에.
2. **(이론·낮) cursor native delta/completed** — `cursor.ts:2061/2069`이 `kind==="mcp"`만 갱신. native 변종은
   delta 누적 안 되나 completed에서 인자 채워져 실질 영향 작음. 점검만.
3. **(회귀 방지) 단위테스트** — `CursorExecHandlers` 소비처에 "bare 추출 시 `this.#optionsForCall` 안 던지는지"
```

### `081.6_fix_cursor_host_override.md`

```markdown
# 081.6 — fix: cursor 주입구에 host-override 지시 (cursor 설정 무시 → jwc 설정 우선)

> 상태: ✅ 수정 완료 (260612 09시). 소속: 081 cursor 도구군 ([081_moc_cursor_tools.md](./081_moc_cursor_tools.md)).
> 입력: 사용자 "jwc에서는 cursor 주입구에 cursor 관련 설정을 무시하고 jwc 설정을 고려하라 — 강하게 영문으로".

## 배경

cursor 모델(composer-*)은 Cursor IDE용으로 학습돼, 별도 지시가 없으면 **Cursor IDE 관습**을 가정한다 —
`.cursor/rules`·`.cursorrules`·`.cursorignore`·"Rules for AI", Cursor 네이티브 도구명 등. jwc는 Cursor가
아닌 독립 터미널 에이전트인데, 이 가정이 jwc 시스템 프롬프트/도구 계약과 충돌한다 (081.1에서 모델이
Cursor 네이티브 도구명을 부른 것도 같은 뿌리).

## 수정

**주입구 = `buildCursorSystemPromptJsons`** (`packages/ai/src/providers/cursor.ts`) — 모든 cursor 요청의
`rootPromptMessagesJson` 시스템 헤드를 만드는 함수. 맨 앞에 **high-priority host-override 시스템 블롭**을
무조건 prepend:

- "You are running inside `${APP_NAME}` … NOT operating inside the Cursor IDE. This overrides any contrary training assumption."
- IGNORE `.cursor/rules`/`.cursorrules`/`.cursorignore`/Cursor "Rules for AI" 및 Cursor 프로젝트 설정.
- Cursor 네이티브 도구 세트 가정 금지 — **이 세션에 advertise된 도구만** 사용.
- `${APP_NAME}` 시스템 지시 + 프로젝트 설정(AGENTS.md/settings)만 따르고, 충돌 시 **`${APP_NAME}`이 항상 우선**.

`APP_NAME`(`@gajae-code/utils`)으로 **브랜드 자동 반영** — jwc 실행 시 "jwc", gjc 실행 시 "gjc"로 출력되어
양 브랜드에 자연 적용. 별도 brand 분기 불필요.

```ts
// cursor.ts buildCursorSystemPromptJsons (요지)
const override = JSON.stringify({ role: "system", content: CURSOR_HOST_OVERRIDE_PROMPT });
return [override, ...systemPrompts.map(...)];   // 항상 override가 맨 앞
```

## 검증

- 단위테스트 갱신: `packages/ai/test/cursor-exec-handlers.test.ts` — override가 항상 첫 블롭이고
  뒤에 기존 시스템 프롬프트가 오는지 확인 (16 pass). 타입체크·biome 통과.
- e2e: jwc로 cursor 모델 기동 시 첫 system 블롭에 host-override가 실림 (요청 헤드).

## upstream vs fork

**fork 고유 동작.** 업스트림 `buildCursorSystemPromptJsons`는 override 없이 시스템 프롬프트만 emit.
이 주입은 jwc/gjc 호스트 가정을 강제하는 fork 가치-추가이므로 **업스트림 PR(081.1~081.4 버그픽스)에는
미포함** — 별개 행동 변경이라 분리한다.
```

### `081.7_issue_cursor_autocompact.md`

```markdown
# 081.7 — issue: cursor에서 자동 compact가 안 터짐 (usage.input=0)

> 상태: ✅ 수정 완료 (A안, 2026-06-12). 조사: 2026-06-12 11시. 소속: 081 cursor 도구군 ([081_moc_cursor_tools.md](./081_moc_cursor_tools.md)).
> 입력: 사용자 "자동 compact 매커니즘이 없나? cursor에서만 작동 안 하는 건가" + 화면 컨텍스트 **114.7%/200K**(100% 초과인데 미발동).

자동 compact **메커니즘은 존재**한다. 그런데 cursor 프로바이더에서는 컨텍스트가 100%를 넘겨도 자동 compact가
트리거되지 않고 무한히 쌓인다. (수동 `/compact`는 동작.) 원인은 **임계치 판정이 provider 보고 usage에
의존**하는데 cursor가 `usage.input: 0`으로 보고하기 때문.

## 원인 메커니즘 (90%)

1. 턴 종료 후 임계치 자동 compact 판정 — `packages/coding-agent/src/session/agent-session.ts:6511`:
   ```ts
   let contextTokens = calculateContextTokens(assistantMessage.usage);   // ← provider usage
   ...
   if (shouldCompact(contextTokens, contextWindow, compactionSettings, this.model?.maxTokens ?? 0)) { … }
   ```
2. `calculateContextTokens` = `usage.totalTokens || (usage.input + usage.output + usage.cacheRead + usage.cacheWrite)`
   (`packages/agent/src/compaction/compaction.ts:165`).
3. **cursor/composer는 usage를 과소 보고** — `input:0`. (근거: title-generator 로그 `usage:{input:0, output:379, …, totalTokens:10}`, `~/.gjc/logs/gjc.2026-06-12.log`.) → `contextTokens`가 실제(수만~20만)보다 훨씬 작은 값.
4. `shouldCompact(작은값, contextWindow, …)` → 임계치 미달 → **compact 미발동**. (`shouldCompact`은
   `contextTokens > thresholdTokens`일 때만 true, `compaction.ts:236`.)

대조: **상태줄 표시(114.7%)는 내용 기반 추정** `estimateTokens`(`context-usage.ts:133`, `compaction.ts:275`)을
써서 정확하다. 즉 **표시는 맞는데 compact 판정은 다른(틀린) 소스를 본다** — 둘이 어긋남.

오버플로 경로(Case 1, `agent-session.ts:6500 #runAutoCompaction("overflow")`)는 provider가 컨텍스트
오버플로 *에러*를 반환할 때만(`isContextOverflow`) 발동 — cursor가 그런 에러를 안 주면 이 경로도 안 탐.

## 영향 범위

- **cursor 프로바이더 사용 시 자동 compact 전면 무력화** → 컨텍스트 무한 증가, 결국 요청 실패/품질 저하.
- 일반화: usage를 0/불완전하게 보고하는 모든 프로바이더에 동일 위험(현재 알려진 케이스 = cursor).

## 수정 방향

| 안 | 내용 | 파일 | 평가 |
|----|------|------|------|
| **A (권장)** | 임계치 판정을 **상태줄과 같은 내용 기반 추정**으로 — `agent-session.ts:6511`에서 `calculateContextTokens(usage)` 대신 메시지 히스토리 `estimateTokens` 합(이미 `getContextUsage`가 계산)을 사용, 또는 둘 중 큰 값 `Math.max(usageTokens, estimatedTokens)` | `agent-session.ts:6511` | 표시·판정 일원화, 근본 해결 |
| B | `calculateContextTokens`가 `usage.input===0 && totalTokens`이 비정상으로 작으면 추정으로 폴백 | `compaction.ts:165` | 국소, 다른 호출처 영향 |
| C | cursor 프로바이더가 usage를 제대로 채우게 (input 토큰 보고) — 가능하면 정공법이나 cursor 백엔드 응답 의존 | `packages/ai/.../cursor.ts` | 불확실(백엔드가 안 주면 불가) |

> 권장: **A** — compact 결정과 상태줄 표시가 같은 추정을 보게 통일. (cursor뿐 아니라 usage 불완전 프로바이더 전반 방어.)

## 적용된 수정 (A안)
```

### `081_moc_cursor_tools.md`

```markdown
# 081 — cursor 도구 사용 이슈 (MOC / 해결 정본)

> 상태: ✅ 해결 완료·사용자 e2e 검증 (260612 08시). 081.1~081.4 = 4건 수정 묶음.
> 소속: 080 밴드. 본 문서 = cursor 도구군 이슈의 **인덱스 + "어떻게 해결했나" 정본** (디버깅 여정 + 수정 + 검증법).
> ⚠️ 번호 규약: cursor 도구 버그가 많아 081 하위(081.1~)로 묶음. 다른 이슈군은 082.n(TUI Ctrl/IME) 등 별도.
> 📤 **업스트림 PR: [Yeachan-Heo/gajae-code#515](https://github.com/Yeachan-Heo/gajae-code/pull/515)** —
> 081.1~081.4 버그픽스(4건)를 업스트림에 제출. 081.6 host-override는 fork 고유라 미포함.
> (업스트림 클론 = `devlog/_upstream_gjc` gitignored, 포크 = `lidge-jun/gajae-code`.)
> **PR 경과 (260612 12시)**: ① 오너 "main 아닌 dev 대상" 지적 → ② base를 dev로 변경했더니 충돌 →
> ③ **오너가 직접 브랜치를 dev 위로 리베이스(force-push, 최종 4283930)** 하여 관리 인수. 현재
> base=dev·충돌 없음(CLEAN/MERGEABLE)·OPEN. 수정 4건+작성자(lidge-jun) 모두 보존 확인
> (bind×9, buildNativeToolCallBlock×3, find 라우팅, 타이틀 캡). **우리 쪽 추가 액션 없음 — 리뷰/CI 대기.**
> 교훈: 이 레포 기여 흐름은 `dev` 대상 (CONTRIBUTING 참조). 다음 PR부터 처음부터 dev로.

## 하위 문서

| # | 이슈 | 상태 |
|---|------|------|
| [081.1](./081.1_issue_toolcall_render.md) | TUI에 도구 행 미표시 (cursor 파서 oneof 드롭) | ✅ 수정·PR |
| [081.2](./081.2_issue_title_hallucination.md) | 환각 세션 타이틀 저장 (composer 모델) | ✅ 수정·PR |
| [081.3](./081.3_issue_exec_unbound.md) | 도구 실행 crash (exec 핸들러 unbound this) ★핵심 | ✅ 수정·PR |
| [081.4](./081.4_issue_glob_empty_pattern.md) | Glob 빈 패턴 "Pattern must not be empty" | ✅ 수정·PR |
| [081.5](./081.5_audit_unbound_elsewhere.md) | cursor 외 동형 패턴(unbound-this/oneof-drop) 감사 | ✅ 감사 완료 |
| [081.6](./081.6_fix_cursor_host_override.md) | cursor 주입구 host-override (cursor 설정 무시→jwc 우선) | ✅ 수정 (fork 고유) |
| [081.7](./081.7_issue_cursor_autocompact.md) | cursor에서 자동 compact 미발동 (usage.input=0 → 임계치 판정 실패) | ✅ 수정 (estimate 폴백, fork 커밋 16ce10d) |

## 증상 (사용자 보고)

`jwc` + `cursor/composer-2.5-fast`에서 "tool 호출 N번 해봐":
1. TUI에 도구 행이 **하나도 안 뜸** (텍스트만)
2. 모델이 "Shell/Glob/Grep → Tool not available / `this.#optionsForCall` 오류" 표를 출력
3. 세션 타이틀에 환각 서사가 통째로 저장됨

## 디버깅 여정 (오진 → 실증 → 확정)

이 케이스의 교훈: **composer-2.5-fast는 환각이 심해, 모델이 출력한 "도구 결과 표"를 증거로 쓰면 안 된다.**
사용자가 "그거 LLM이 텍스트로 준 거지 tool 파싱된 게 아니다"라고 정확히 지적한 게 분기점이었다.

1. **1차 오진 후보**: 모델 보고만 보면 "도구 실행 실패"로 보임 → 실제로는 환각 텍스트.
2. **실증 1 (세션 JSONL)**: `~/.gjc/agent/sessions/.../<id>.jsonl`에서 `toolCall` 콘텐츠 블록 **0개**,
   `this.#optionsForCall`는 전부 assistant **text** 안에만 존재 → 모델이 도구를 안 부르고 텍스트로 흉내냄 확인.
   ```bash
   cat <session>.jsonl | jq -rc '(.message.content//[])|map(select(.type=="toolCall")|.name)'  # → 빈 배열
   ```
3. **실증 2 (내부 이름의 정확성)**: 그런데 `this.#optionsForCall`은 우리 private 메서드명과 정확히 일치 —
```

## 3. 검증 명령

```bash
bun check
bun test packages/coding-agent
bun scripts/rebrand-inventory.ts --strict
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `081_cursor`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `081_cursor`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `081_cursor`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `081_cursor`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `081_cursor`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
