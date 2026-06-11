# 084 — cursor 도구 사용 이슈 해결 종합 (해결 방법 정본)

> 상태: ✅ 해결 완료·사용자 e2e 검증 (260612 08시). 081·082·083·Glob 4건 수정 묶음.
> 소속: 080 밴드. 개별 분석: [081](./081_issue_tui_toolcall_render.md)·[082](./082_issue_cursor_tools_fail.md)·[083](./083_issue_cursor_exec_unbound.md).
> 본 문서 = "어떻게 해결했나"의 정본 (디버깅 여정 + 수정 + 검증법).

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
   순수 창작 불가. cursor 네이티브 exec는 gjc toolCall 블록이 아니라 **cursor RPC exec 채널**로 흘러
   세션에 안 남는다는 사실과 결합 → 실제로 한 번 터진 에러를 모델이 베낀 것으로 추정.
4. **실증 3 (격리 재현)**: 클래스 private 메서드를 bare 추출해 호출하면 Bun에서 **글자 단위로 동일한 에러**
   (`undefined is not an object (evaluating 'this.#opt')`) 재현. 환경 문제(bind+private)가 아님도 별도 확인.
5. **근본 위치 확정**: `packages/agent/src/agent.ts:678` `#cursorExecHandlersForRun`가 핸들러를 unbound로 추출.

## 근본 원인 4종 (전부 **업스트림 gjc** 코드 — `_upstream_gjc` HEAD 498d86b/v0.4.4에서 동일 라인 확인)

| # | 증상 | 근본 원인 | 파일 |
|---|------|-----------|------|
| 081 | 도구 행 미표시 | `processInteractionUpdate`가 ToolCall oneof 중 mcp/todo 2종만 처리, native variant 드롭 | `packages/ai/src/providers/cursor.ts` |
| 082 | 환각 타이틀 저장 | `extractGeneratedTitle`이 toolCall 없는 긴 평문도 제목으로 채택 | `packages/coding-agent/src/utils/title-generator.ts` |
| 083 | **도구 실행 crash** | exec 핸들러를 인스턴스에서 unbound 추출 → `this` undefined → `this.#optionsForCall` 폭발 | `packages/agent/src/agent.ts` |
| Glob | "Pattern must not be empty" | native Glob이 grep exec(빈 pattern)로 도착, search 도구가 빈 패턴 거부 | `packages/coding-agent/src/cursor.ts` |

## 해결 방법 (적용된 수정)

### 081 — native toolCall 폴백 렌더 (`cursor.ts`)
`toolCallStarted`에서 mcp/todo가 아니면 `buildNativeToolCallBlock`로 `*ToolCall` 키를 스캔해
`kind:"native"` 블록 push + `toolcall_start` emit. 이름 별칭(`cursorNativeToolName`)은 cli-jaw
`cursorToolKindLabel`(커밋 `0ff4e544`) 차용 — `shell→bash`, `semSearch→codebase_search` 등.
`ToolCallState.kind`에 `"native"` 추가.

### 083 — exec 핸들러 this 보존 (`agent.ts`) ★ 도구가 실제로 돌게 한 핵심
`#cursorExecHandlersForRun`의 9개 핸들러 추출을 전부 `?.bind(source)`로 변경:
`read/ls/grep/write/delete/shell/shellStream/diagnostics/mcp`. run 가드(`#assertActiveRun`) 래핑은 유지.
```ts
const read = source.read?.bind(source);   // (전) const read = source.read;
```

### 082 — 타이틀 환각 가드 (`title-generator.ts`)
`extractGeneratedTitle`이 toolCall 없는 평문 폴백을 80자/12단어 초과 시 `""` 반환 → 호출자 fallback.
상수 `MAX_TITLE_CHARS=80` / `MAX_TITLE_WORDS=12`.

### Glob — 빈 패턴은 find로 라우팅 (`coding-agent/src/cursor.ts`)
grep 핸들러에서 `pattern.trim()`이 비면 content search 대신 `find` 도구로 glob path 전달.

## 검증

- **타입체크·biome**: `packages/ai`·`packages/coding-agent`·`packages/agent` 전부 통과.
- **격리 재현**: 083 before/after 대조 (`bare ERROR: …this.#opt` → `bound: 15`).
- **사용자 e2e** (081+083 적용 후 "tool 10개"): Bash 실제 출력(`pwd && ls -la`), Read package.json,
  Grep/Find/Search, Web Search(DuckDuckGo 실결과), MCP 도구(CronList/IRC/Job) **전부 실제 실행·렌더**.
  수정 전(0 toolCall 블록, 환각 표) → 수정 후(실제 도구 행) 대조 확인.

## 재현·관찰 팁 (다음에 또 의심될 때)

- 모델 출력 표를 믿지 말고 **세션 JSONL의 toolCall 블록 유무**로 "진짜 파싱됐는지" 판정.
- 와이어 레벨 확인: `DEBUG_CURSOR=1`(또는 `=verbose`) + `DEBUG_CURSOR_LOG=<path>` 환경변수로
  `cursor.ts`의 `log()` 활성화 → `interactionUpdate`/`exec dispatch` 실제 흐름 캡처.

## 테스트 설치 (jwc symlink)

`~/.bun/bin/jwc → packages/jwc/bin/jwc.js` (레포 워크스페이스가 TS 소스 직결). 전역 `gjc`는 02:08
복사본이라 수정 미반영 — **테스트는 반드시 `jwc`로**. 소스 수정은 재빌드 없이 즉시 반영.
