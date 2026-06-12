# 050_plan — 02 logic changes (jwc_patched)

> jwc_patched: fork **실제 로직**. git `upstream/main..HEAD` + [fork_logic_changelog.md](../../../structure/fork_logic_changelog.md).
> worktree @ `81bcea96`.

## 런타임·표면

- `orchestrate-state.ts` + `orchestrate-runtime.ts` (I/P/A/B/C/D).
- `commands/orchestrate.ts`, `/orchestrate`, jaw-only brand gate.
- `prompts/jaw/orchestrate-*.md`; ralplan pending approval → ultragoal.

## 커밋

`595350bf`–`09c76c23`
## 런타임 vs discovery (99.03)

| | 코드 | 모델 |
|---|---|---|
| CLI / slash / state / stage prompts | ✅ | stdout pull |
| system-prompt orchestrate | — | ❌ **M1** |
| `pabcd-stage-context` 매 턴 | — | ❌ **M2** |

[m1_closeout](../../../structure/m1_closeout.md) · [99.03.01](../../../devlog/_plan/260612_jawcode_fork/99.03.01_impl_workflow_surface.md)
## 정본

- 횡단: [structure/fork_logic_changelog.md](../../../structure/fork_logic_changelog.md)
- 파일 단위: [structure/fork-delta.md](../../../structure/fork-delta.md)
- 앵커 경로: [02_code_facts.md](./02_code_facts.md)

