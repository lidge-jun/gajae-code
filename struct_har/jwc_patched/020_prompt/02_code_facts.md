# 020_prompt — code facts (jwc_patched)
> **worktree**: jawcode @ `dc4f22672581`
> **gjc 대조**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/020_moc_prompting.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/system-prompt.ts` | present |
| 2 | `packages/coding-agent/src/prompts/system/system-prompt.md` | present |
| 3 | `packages/coding-agent/src/gjc-runtime/agent-identity.ts` | present |
| 4 | `structure/prompt_flow.md` | present |

## 2. fork-delta (structure/fork-delta.md)

- system-prompt.md HARD-EDIT
- prompts/tools/*.md HARD-EDIT
- agent-identity.ts NEW

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts packages/coding-agent/src/system-prompt.ts | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

