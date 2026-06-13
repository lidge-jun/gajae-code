# 040_interview — code facts (jwc_patched)
> **worktree**: jawcode @ `dc4f22672581`
> **gjc 대조**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/040_moc_interview_merge.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md` | present |
| 2 | `packages/coding-agent/src/defaults/gjc-defaults.ts` | present |
| 3 | `packages/coding-agent/src/skill-state/jaw-interview-mutation-guard.ts` | present |

## 2. fork-delta (structure/40_fork-delta.md)

- deep-interview → jaw-interview HARD-EDIT
- mutation-guard INVERTED-GUARD

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

