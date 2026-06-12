# 081_cursor — code facts (jwc_patched)
> **worktree**: jawcode @ `81bcea96`  
> **gjc 대조**: `devlog/_upstream_gjc/` @ `67427c6`  
> MOC: `devlog/_plan/260612_jawcode_fork/081_moc_cursor_tools.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/ai/src/providers/cursor.ts` | present |
| 2 | `packages/coding-agent/src/cursor.ts` | present |

## 2. fork-delta (structure/fork-delta.md)

- 081 hotfixes ✅ (e2e)

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 67427c6
git rev-parse --short HEAD               # 81bcea96
diff -u devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts packages/ai/src/providers/cursor.ts | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`

