# 020_prompt — 02 logic changes (jwc_patched)

> jwc_patched: fork **실제 로직**. git `upstream/main..HEAD` + [fork-delta.md](../../../structure/40_fork-delta.md).
> worktree @ `dc4f22672581`.

## 런타임·표면

- `system-prompt.md`: Jaw/jwc, `jaw-interview`, `jwc` 네이티브 CLI (HARD-EDIT).
- `agent-identity.ts` + `identity.*` settings.
- Role agents: **jwc** bash prefix; ralplan state 쓰기만.
- 도구 프롬프트: `.jwc/`·jwc 어휘.

## 검증

`agent-identity-leak.test.ts`, `system-prompt-identity.test.ts`

## 커밋

`da701492`–`ff11c848`, `59043f77`, `db31d4bd`
## 정본

- 횡단: [structure/40_fork-delta.md](../../../structure/40_fork-delta.md)
- 파일 단위: [structure/40_fork-delta.md](../../../structure/40_fork-delta.md)
- 앵커 경로: [02_code_facts.md](./02_code_facts.md)

