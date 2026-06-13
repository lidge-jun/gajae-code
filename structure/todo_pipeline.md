# Todo pipeline (`todo_write` · 세션 · TUI)

> `todo_write` 도구 → `AgentSession.#todoPhases` → composer 클러스터 `todoContainer` 렌더.  
> 활성 개선: [99.30.01](../devlog/_plan/260612_jawcode_fork/phase1/99.30.01_plan_todo_done_collapse.md) (전부 `completed` 시 패널 접힘 + stop 리마인더 `done` ops).

## 소유 경계

| 층 | 99 밴드 / 문서 | 비고 |
|----|----------------|------|
| 도구 스키마·ops | 내장 `TodoWriteTool` | executor 서브에이전트에서 `todo_write` 제거 가능 |
| 세션 상태·stop 리마인더 | `agent-session.ts` | `#checkTodoCompletion` — **미완료만** auto-continue |
| TUI 패널 (기능) | `interactive-mode.ts` `#renderTodoList` | **99.30** — 접힘·요약 행 |
| TUI 레이아웃 (083.7) | `ViewportFill` + composer 클러스터 | **99.09/083.7** — 바닥 고정; todo 높이는 스페이서가 흡수 |
| 프롬프트 삽입 | `prompt_flow.md` 레일 #9 (본 문서) | `eager-todo`·plan-mode·도구 md |
| 대조 스냅샷 | `struct_har/jwc_patched/080_tui/` | TUI 밴드 앵커 |

**99.20(UI/UX)** 와 구분: 99.30은 **상태·리마인더·접힘 규칙**; 99.20은 신규 인터랙션 문법·ask 등.

---

## 데이터 모델

| 타입 | 필드 | 근거 |
|------|------|------|
| `TodoStatus` | `pending` \| `in_progress` \| `completed` \| `abandoned` | `packages/coding-agent/src/tools/todo-write.ts` |
| `TodoItem` | `content` (식별자), `status`, optional `notes[]` | 동일 |
| `TodoPhase` | `name`, `tasks[]` | 동일 |

식별: **task = `content` 문자열** (자동 id 없음). `todo-write.md` 도구 설명이 정본.

---

## 상태 소스 (진실의 우선순위)

```text
todo_write 성공 → AgentSession.setTodoPhases(details.phases)
       ↓
getTodoPhases()  ← interactive-mode #loadTodoList
       ↓
#renderTodoList → todoContainer (Text)

/todo 슬래시·user edit → setTodoPhases + appendCustomEntry(USER_TODO_EDIT_CUSTOM_TYPE)
       ↓
getLatestTodoPhasesFromEntries(branch)  ← 재개 시 completed/abandoned 보존
```

| API | 역할 | 근거 |
|-----|------|------|
| `getTodoPhases()` / `setTodoPhases()` | 인메모리 캐시 | `agent-session.ts` ~5473 |
| `getLatestTodoPhasesFromEntries` | 세션 JSONL 브랜치에서 최신 phases | `todo-write.ts` |
| RPC `set_todos` | bridge 클라이언트 동기화 | `command-dispatch.ts` |
| `bridge-client setTodos` | 원격 세션 | `packages/bridge-client/src/commands.ts` |

`DEVELOPMENT.md`의 `todos.json` 언급은 레거시 표기 — 현행은 **세션 엔트리 + 인메모리** (`todo-command-controller.ts` 주석).

---

## `todo_write` 실행 경로

1. `TodoWriteTool.execute` — `applyParams` → `setTodoPhases`  
2. `agent_end` / tool_result: `toolName === "todo_write"` && `details.phases` → `setTodoPhases`  
3. 실패 시 `sendCustomMessage` system-reminder (재시도 유도) — `agent-session.ts` ~2014  

렌더: `todoWriteToolRenderer` (채팅 내 도구 행), 별도 `todoContainer` (composer 위 HUD).

---

## Stop · 리마인더 (`#checkTodoCompletion`)

| 조건 | 동작 |
|------|------|
| `todo.enabled` && `todo.reminders` | 리마인더 활성 |
| 마지막 assistant **toolCall 없음** (final stop) | 체크 실행 |
| `pending` \| `in_progress` 잔존 | `developer` 메시지 + `todo_reminder` 이벤트 + `#scheduleAgentContinue` |
| incomplete 0 (전부 `completed`/`abandoned`) | 리마인더 **없음**, `#todoReminderCount` 리셋 |

설정: `todo.reminders.max` (기본 3). 이벤트: `TodoReminderComponent` → `chatContainer` (스크롤 영역 알림).

**갭 (99.30.01 M1)**: 리마인더에 `{"op":"done","task":"…"}` 예시 없음. UI 길게 펼침은 **M2 ✅ 완료**(`a7543582`).

---

## Eager init (`todo.eager`)

| 설정 | 기본 | 효과 |
|------|------|------|
| `todo.eager` | `false` | 사용자 프롬프트마다 `toolChoice: todo_write` + `eager-todo.md` prelude |
| `todo.enabled` | `true` | 도구·리마인더 마스터 스위치 |

`#createEagerTodoPrelude`: 기존 phases 있으면 스킵 (`getTodoPhases().length > 0`). 테스트: `agent-session-eager-todo.test.ts`.

---

## TUI (`interactive-mode.ts`)

| 멤버 | 역할 |
|------|------|
| `todoContainer` | `statusContainer` 아래 composer 클러스터 (083.7 D1) |
| `todoExpanded` | 사용자 토글; 기본 `false` |
| `#renderTodoList` | collapsed = 활성 페이즈 최대 5 task + 헤더 (**완전 접힘 아님**) |
| `#getActivePhase` | pending/in_progress 페이즈 → 없으면 **마지막 페이즈** |
| `toggleTodoExpansion` | 키바인드 → `todoExpanded` flip |

**99.30.01 M2 ✅ 완료 (`a7543582`)**: 세션 상태가 **전부 `completed`**(또는 terminal `abandoned`만)일 때 **hermes식 1줄 영수증 접힘** — [99.30.01 M2 플랜](../devlog/_plan/260612_jawcode_fork/phase1/99.30.01_plan_todo_done_collapse.md).

참조 UI: `~/Developer/codex/hermes-agent/ui-tui/src/components/todoPanel.tsx` (`▸ Todo (done/total)`, `!effectiveCollapsed`일 때만 본문).

---

## 프롬프트 레일 (`prompt_flow.md` 교차)

| # | 트리거 | 내용 |
|---|--------|------|
| 9 | `todo.eager` + 신규 phases 없음 | `eager-todo.md` prelude + named tool choice |
| — | plan mode | `plan-mode-approved.md` — step마다 `todo_write` |
| — | tool md | `prompts/tools/todo-write.md` |
| — | stop incomplete | `#checkTodoCompletion` `<system-reminder>` (in-band) |

99.03 시스템 re-facing과 **독립** — todo 규칙은 도구 md + 99.30 M1에서 보강.

---

## 테스트 앵커

| 파일 | 검증 |
|------|------|
| `test/tools/todo-write.test.ts` | ops 적용 |
| `test/agent-session-auto-compaction-queue.test.ts` | `todo_reminder` + continue |
| `test/agent-session-eager-todo.test.ts` | eager prelude |
| `test/agent-session-new-session-todos.test.ts` | newSession/branch 시 phases 클리어 |

---

## struct_har · fork-delta

| 문서 | 내용 |
|------|------|
| `struct_har/jwc_patched/080_tui/02_code_facts.md` | todo 관련 path 행 |
| `structure/fork-delta.md` §TUI | `interactive-mode.ts` HARD-EDIT (083.7); 99.30은 동일 파일 추가 편집 예정 |
| `080_moc_tui.md` | TUI 밴드; todo UX는 99.30으로 추적 |

구현 후: `fork_logic_changelog.md` 한 줄 + `struct-har-regenerate` 080 앵커에 `todo-write.ts` 선택 반영.

---

## 동기화 (INDEX 규칙)

| 변경 | 갱신 |
|------|------|
| `#checkTodoCompletion` / 리마인더 문구 | 본 문서 §Stop, `prompt_flow.md` #9, `99.30.01` |
| `#renderTodoList` / 접힘 설정 | 본 문서 §TUI, `struct_har/080_tui`, `fork-delta` |
| `settings-schema` `todo.*` | 본 문서 §설정, `extensibility.md` (도구 표면) |