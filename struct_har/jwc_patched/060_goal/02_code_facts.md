# 060_goal — code facts (jwc_patched)
> **worktree**: jawcode @ `81bcea96`  
> **gjc 대조**: `devlog/_upstream_gjc/` @ `67427c6`  
> MOC: `devlog/_plan/260612_jawcode_fork/060_moc_goal_merge.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md` | present |
| 2 | `packages/coding-agent/src/gjc-runtime/goal-runtime.ts` | present |
| 3 | `packages/coding-agent/src/gjc-runtime/ultragoal-runtime.ts` | present |
| 4 | `packages/coding-agent/src/commands/goal.ts` | present |

## 2. fork-delta (structure/fork-delta.md)

- goal-runtime.ts NEW
- commands/goal.ts NEW

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 67427c6
git rev-parse --short HEAD               # 81bcea96
diff -u devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`

