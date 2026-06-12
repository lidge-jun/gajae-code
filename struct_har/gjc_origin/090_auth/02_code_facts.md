# 090_auth — code facts (gjc_origin)
> **upstream 클론**: `devlog/_upstream_gjc/` @ `67427c6`  
> MOC: `devlog/_plan/260612_jawcode_fork/090_moc_auth_release_gate.md`
## 1. upstream 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/ai/src/auth-storage.ts` | present |
| 2 | `packages/ai/src/utils/oauth/` | present |

## 2. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 67427c6
git rev-parse --short HEAD               # 81bcea96
diff -u devlog/_upstream_gjc/packages/ai/src/auth-storage.ts packages/ai/src/auth-storage.ts | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`

