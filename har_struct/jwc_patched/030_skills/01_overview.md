# 030_skills — 스킬 디스커버리 (jwc_patched)

[확정 D5] **3계층 + 대체 폴백**:

1. 임베디드 gjc defaults (+ jaw 워크플로)
2. 프로젝트 `.gjc/skills` + **`.agents/skills`** (워크업 nearest) + `.gemini`
3. 사용자 **`~/.cli-jaw/skills`** — 부재 시 upstream `~/.gjc/agent/skills` 폴백

- `discovery/cli-jaw.ts` provider (priority 110, global wins on collision)
- 네이티브 충돌 스킬 `memory`, `dev-pabcd` → jwc 네이티브 명령으로 대체 후 로드 제외 (D10)
