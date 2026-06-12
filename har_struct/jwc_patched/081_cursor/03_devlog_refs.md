# 081_cursor — devlog refs (jwc_patched)

> `081*` devlog 전체 인덱스 + MOC 목차.

## 1. 문서 레지스트리

| 파일 | 첫 줄 | 줄 수 |
|---|---|---:|
| `081_moc_cursor_tools.md` | # 081 — cursor 도구 사용 이슈 (MOC / 해결 정본) | 100 |
| `081.1_issue_toolcall_render.md` | # 081.1 — issue: TUI에 도구 호출이 하나도 안 그려지는 문제 (cursor 파서 드롭) | 90 |
| `081.2_issue_title_hallucination.md` | # 081.2 — issue: 환각 세션 타이틀 저장 (title-generator 환각) | 70 |
| `081.3_issue_exec_unbound.md` | # 081.3 — issue: cursor 도구 실행이 전부 실패 (exec 핸들러 unbound this) | 81 |
| `081.4_issue_glob_empty_pattern.md` | # 081.4 — issue: Glob 호출 시 "Pattern must not be empty" | 51 |
| `081.5_audit_unbound_elsewhere.md` | # 081.5 — audit: cursor 외 동형 패턴(unbound-this / oneof-drop / arg-mismatch) 전역 감사 | 55 |
| `081.6_fix_cursor_host_override.md` | # 081.6 — fix: cursor 주입구에 host-override 지시 (cursor 설정 무시 → jwc 설정 우선) | 43 |
| `081.7_issue_cursor_autocompact.md` | # 081.7 — issue: cursor에서 자동 compact가 안 터짐 (usage.input=0) | 64 |
| `081_moc_cursor_tools.md` | # 081 — cursor 도구 사용 이슈 (MOC / 해결 정본) | 100 |

## 2. MOC 헤딩 트리

# 081 — cursor 도구 사용 이슈 (MOC / 해결 정본)
## 하위 문서
## 증상 (사용자 보고)
## 디버깅 여정 (오진 → 실증 → 확정)
## 근본 원인 4종 (전부 **업스트림 gjc** 코드 — `_upstream_gjc` HEAD 498d86b/v0.4.4에서 동일 라인 확인)
## 해결 방법 (적용된 수정)
### 081.1 — native toolCall 폴백 렌더 (`cursor.ts`)
### 081.3 — exec 핸들러 this 보존 (`agent.ts`) ★ 도구가 실제로 돌게 한 핵심
### 081.2 — 타이틀 환각 가드 (`title-generator.ts`)
### 081.4 — Glob 빈 패턴은 find로 라우팅 (`coding-agent/src/cursor.ts`)
## 검증
## 재현·관찰 팁 (다음에 또 의심될 때)
## 테스트 설치 (jwc symlink)

## 3. structure 교차

- `structure/architecture.md` (112 lines): # Jawcode 아키텍처 (현재 형태)
- `structure/conventions.md` (63 lines): # Jawcode 컨벤션
- `structure/extensibility.md` (69 lines): # Extensibility
- `structure/packages_overview.md` (58 lines): # Packages / Crates Overview
- `structure/prompt_flow.md` (78 lines): # Prompt Flow
- `structure/session_storage.md` (77 lines): # Session / Storage
- `structure/workflows.md` (59 lines): # Default Workflow Skills

## 4. 갱신·증거 규칙 (structure/conventions)

- absolute path:line 수동 검증
- generated 파일 수동 편집 금지
- AGENTS.md upstream contract

## 5. 관련 devlog 발췌 (상위 30줄)

### 081.1_issue_toolcall_render.md

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
```

### 081.2_issue_title_hallucination.md

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

```

### 081.3_issue_exec_unbound.md

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

```

### 081.4_issue_glob_empty_pattern.md

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
```

### 081.5_audit_unbound_elsewhere.md

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

```

### 081.6_fix_cursor_host_override.md

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


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `081_cursor`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `081_cursor`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
