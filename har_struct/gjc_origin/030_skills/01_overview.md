# 030_skills — 스킬 디스커버리 (gjc_origin)

스킬은 **2계층**만: 임베디드 defaults 4종 + 프로젝트/사용자 `.gjc/` 경로.

- `extensibility/skills.ts` — SKILL.md 파싱
- `loadSkills({ cwd })` → capability API
- 사용자 글로벌: `~/.gjc/agent/skills`
- **"GJC only accepts native .gjc skills"** — 외부 루트 설정 없음
- `sdk.ts discoverSkills()` = **스텁**(빈 배열)
