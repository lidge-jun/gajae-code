# 020_prompt — code facts (gjc_origin)
> **upstream 클론**: `devlog/_upstream_gjc/` @ `75d103f45145`
> MOC: `devlog/_plan/260612_jawcode_fork/phase1/020_moc_prompting.md`
## 1. upstream 앵커 경로

| # | path | status |
|---:|---|---|
| 1 | `packages/coding-agent/src/system-prompt.ts` | present |
| 2 | `packages/coding-agent/src/prompts/system/system-prompt.md` | present |
| 3 | `packages/coding-agent/src/gjc-runtime/agent-identity.ts` | missing (verify path) |

## 2. 검증

```bash
git -C devlog/_upstream_gjc rev-parse --short HEAD   # 75d103f45145
git rev-parse --short HEAD               # dc4f22672581
diff -u devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts packages/coding-agent/src/system-prompt.ts | head
```

## 부록

- **struct_har** 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate.ts` (2026-06-13)
- **로드맵**: `devlog/_plan/260612_jawcode_fork/phase1/000_roadmap.md`

