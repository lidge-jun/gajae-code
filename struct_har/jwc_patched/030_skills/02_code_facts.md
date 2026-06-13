# 030_skills — code facts (jwc_patched)
> **worktree**: jawcode @ `dc4f22672581`
> **gjc 대조**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/030_moc_skills_discovery.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/defaults/gjc-defaults.ts` | present |
| 2 | `packages/coding-agent/src/extensibility/skills.ts` | present |
| 3 | `packages/coding-agent/src/gjc-runtime/cli-jaw-vocab.ts` | present |

## 2. fork-delta (structure/40_fork-delta.md)

- jaw-interview slug
- cli-jaw-vocab.ts NEW (057)

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts packages/coding-agent/src/defaults/gjc-defaults.ts | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

