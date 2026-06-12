# 050_plan — code facts (jwc_patched)
> **worktree**: jawcode @ `dc4f22672581`
> **gjc 대조**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/050_moc_plan_pabcd.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md` | present |
| 2 | `packages/coding-agent/src/gjc-runtime/orchestrate-runtime.ts` | present |
| 3 | `packages/coding-agent/src/prompts/jaw/orchestrate-d.md` | present |
| 4 | `structure/051_design_command_port.md` | missing (verify path) |

## 2. fork-delta (structure/fork-delta.md)

- orchestrate-runtime NEW
- prompts/jaw/orchestrate-* NEW

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

