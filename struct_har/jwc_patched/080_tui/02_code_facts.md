# 080_tui — code facts (jwc_patched)
> **worktree**: jawcode @ `dc4f22672581`
> **gjc 대조**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/080_moc_tui.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/tui/` | present |
| 2 | `packages/coding-agent/src/modes/` | present |
| 3 | `packages/coding-agent/src/status-line/` | missing (verify path) |

## 2. fork-delta (structure/40_fork-delta.md)

- TUI jaw branding WIP
- status-line segments 085

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/tui/ packages/tui/ | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

