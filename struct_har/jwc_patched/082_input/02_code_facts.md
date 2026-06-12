# 082_input — code facts (jwc_patched)
> **worktree**: jawcode @ `81bcea96`  
> **gjc 대조**: `devlog/_upstream_gjc/` @ `67427c6`  
> MOC: `devlog/_plan/260612_jawcode_fork/082_moc_tui_input.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/tui/src/` | present |
| 2 | `packages/coding-agent/src/modes/interactive/` | missing (verify path) |

## 2. fork-delta (structure/fork-delta.md)

- 082.1 Ctrl/ESC
- 082.2 caret jump ✅

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 67427c6
git rev-parse --short HEAD               # 81bcea96
diff -u devlog/_upstream_gjc/packages/tui/src/ packages/tui/src/ | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`

