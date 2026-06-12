# 040_interview — code facts (gjc_origin)
> **upstream 클론**: `devlog/_upstream_gjc/` @ `67427c6`  
> MOC: `devlog/_plan/260612_jawcode_fork/040_moc_interview_merge.md`
## 1. upstream 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md` | present |
| 2 | `packages/coding-agent/src/defaults/gjc-defaults.ts` | present |

## 2. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 67427c6
git rev-parse --short HEAD               # 81bcea96
diff -u devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md packages/coding-agent/src/defaults/gjc/skills/deep-interview/SKILL.md | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`

