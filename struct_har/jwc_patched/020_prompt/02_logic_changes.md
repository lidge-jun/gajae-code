# 020_prompt — 02 logic changes (jwc_patched)

> jwc_patched: fork **실제 로직**. git `upstream/main..HEAD` + [fork_logic_changelog.md](../../../structure/fork_logic_changelog.md).
> worktree @ `81bcea96`.

## 런타임·표면

- `system-prompt.md`: Jaw/jwc, `jaw-interview`, `jwc` 네이티브 CLI (HARD-EDIT).
- `agent-identity.ts` + `identity.*` settings.
- Role agents: **jwc** bash prefix; ralplan state 쓰기만.
- 도구 프롬프트: `.jwc/`·jwc 어휘.

## 검증

`agent-identity-leak.test.ts`, `system-prompt-identity.test.ts`

## 커밋

`da701492`–`ff11c848`, `59043f77`, `db31d4bd`
## 99.03 (미구현 discovery — 99.03.01 PASS v2)

- **M1**: `system-prompt.md` — `<native-workflow orchestrate>` + routing 자가 전이 (현재 orchestrate **0언급**).
- **M2**: `agent-session.ts` — `pabcd-stage-context` 매 턴 (`readPabcdState`).
- **M3**: `prompts/jaw/orchestrate-*.md` 말미 전이 문구.
- re-facing: 4 스킬 산문 IPABCD 우산; `name=`/`ralplan` slug **무변경**.

정본: [99.03.01](../../../devlog/_plan/260612_jawcode_fork/99.03.01_impl_workflow_surface.md) · [m1_closeout](../../../structure/m1_closeout.md)
## 정본

- 횡단: [structure/fork_logic_changelog.md](../../../structure/fork_logic_changelog.md)
- 파일 단위: [structure/fork-delta.md](../../../structure/fork-delta.md)
- 앵커 경로: [02_code_facts.md](./02_code_facts.md)

