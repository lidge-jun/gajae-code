# 070_memory — code facts (jwc_patched)
> **worktree**: jawcode @ `dc4f22672581`
> **gjc 대조**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/99.01.00_moc_memory.md`
## 1. patched 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/memories/` | present |
| 2 | `structure/22_session_storage.md` | present |
| 3 | `devlog/_plan/260612_jawcode_fork/phase1/99.01.00_moc_memory.md` | present |

## 2. fork-delta (structure/40_fork-delta.md)

- 99.01 local-query (planned)
- session_storage.md NEW

## 3. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/coding-agent/src/memories/ packages/coding-agent/src/memories/ | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

