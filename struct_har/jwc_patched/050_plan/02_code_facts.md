# 050_plan — code facts (jwc_patched)

> **worktree**: jawcode @ `81bcea96`  
> **gjc 대조**: `devlog/_upstream_gjc/` @ `67427c6`  
> MOC: `devlog/_plan/260612_jawcode_fork/050_moc_plan_pabcd.md`  
> **99.03**: 런타임 ✅ / discovery ⬜ — [02_logic_changes.md](./02_logic_changes.md)

## 1. patched 앵커 경로

| # | path | role |
|---:|---|---|
| 1 | `packages/coding-agent/src/gjc-runtime/orchestrate-state.ts` | PABCD registry, `readPabcdState`, transitions |
| 2 | `packages/coding-agent/src/gjc-runtime/orchestrate-runtime.ts` | stage I/P/A/B/C/D, audit prompts |
| 3 | `packages/coding-agent/src/commands/orchestrate.ts` | CLI + jaw brand gate |
| 4 | `packages/coding-agent/src/prompts/jaw/orchestrate-{i,p,a,b,c,d}.md` | stage stdout prompts |
| 5 | `packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md` | P-stage skill (slug 유지, 99.02 re-facing) |
| 6 | `.jwc/state/sessions/<sessionId>/pabcd-state.json` | persisted envelope |

## 2. fork-delta

- `orchestrate-state.ts`, `orchestrate-runtime.ts` — NEW
- `prompts/jaw/orchestrate-*` — NEW
- `system-prompt.md` — HARD-EDIT; **99.03 M1** 시 `085.5-M2 + 99.03-M1` co-update

## 3. structure/devlog

- [workflows.md](../../../structure/workflows.md) §Native orchestration
- [m1_closeout.md](../../../structure/m1_closeout.md)
- [99.03.01](../../../devlog/_plan/260612_jawcode_fork/99.03.01_impl_workflow_surface.md)

## 4. 검증

```bash
jwc orchestrate status
git diff -u devlog/_upstream_gjc/packages/coding-agent/src/gjc-runtime/orchestrate-runtime.ts packages/coding-agent/src/gjc-runtime/orchestrate-runtime.ts | head
```