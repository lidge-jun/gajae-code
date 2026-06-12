# 010_shell — code facts (jwc_patched)
> **worktree**: jawcode @ `dc4f22672581`
> **gjc 대조**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/010_moc_shell_rename.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/jwc/package.json` | present |
| 2 | `packages/jwc/bin/jwc.js` | present |
| 3 | `packages/jwc/src/sdk.ts` | present |
| 4 | `scripts/rebrand-inventory.ts` | present |

## 2. fork-delta (structure/fork-delta.md)

- packages/jwc/** NEW
- gjc bin REMOVED (085.5-M7)

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/jwc/package.json packages/jwc/package.json | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

