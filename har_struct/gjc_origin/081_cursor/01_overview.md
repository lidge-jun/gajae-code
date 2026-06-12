# 081_cursor — Cursor 프로바이더 / 도구 렌더 (gjc_origin)

`packages/ai/src/providers/cursor.ts` — Cursor Agent API 어댑터.

**알려진 upstream 버그** (devlog 081.x):
- native ToolCall oneof 드롭 → TUI 도구 행 미표시
- title hallucination
- exec unbound
- glob empty pattern
- host override
- autocompact
