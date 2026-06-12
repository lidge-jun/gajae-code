# 100_node — code facts (jwc_patched)
> **worktree**: jawcode @ `81bcea96`  
> **gjc 대조**: `devlog/_upstream_gjc/` @ `67427c6`  
> MOC: `devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/cli.ts` | present |
| 2 | `devlog/_plan/260612_jawcode_fork/100_moc_node_porting.md` | present |

## 2. fork-delta (structure/fork-delta.md)

- M2 Bun→Node porting — not started in M1

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 67427c6
git rev-parse --short HEAD               # 81bcea96
diff -u devlog/_upstream_gjc/packages/coding-agent/src/cli.ts packages/coding-agent/src/cli.ts | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`

