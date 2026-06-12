# architecture / workflows.md (gjc_origin)

> **스냅샷 (2026-06-13)**: patched SoT는 [`structure/workflows.md`](../../../structure/workflows.md).  
> fork `81bcea96` · gjc clone `67427c6`.

## structure/ 발췌 (첫 12줄)

```markdown
# Default Workflow Skills

> GJC/JWC의 공개 workflow surface는 기본 4종이다. 이 문서는 skill별 pipeline, artifact 경로, gate 정책만 기록한다.
> fork 런타임 기준 canonical slug는 `jaw-interview`이며, upstream `AGENTS.md`는 아직 `deep-interview` 표기를 유지한다 `[기본값]`.

## 공개 surface

| Workflow skill | 목적 | bundled source | 근거 |
|---|---|---|---|
| `jaw-interview` | Socratic requirements interview. `.gjc/specs/jaw-interview-{slug}.md` 아래 approved spec 산출. | `packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc/skills/jaw-interview/SKILL.md:1` |
| `ralplan` | consensus planning + approval gate. `.gjc/plans/` 아래 plan 산출. | `packages/coding-agent/src/defaults/gjc/skills/ralplan/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:12` |
| `ultragoal` | durable multi-goal execution ledger. `.gjc/ultragoal/` 사용. | `packages/coding-agent/src/defaults/gjc/skills/ultragoal/SKILL.md` | `/Users/jun/Developer/new/700_projects/jawcode/packages/coding-agent/src/defaults/gjc-defaults.ts:13`, `/Users/jun/Developer/new/700_projects/jawcode/AGENTS.md:13` |
```

## 대조 메모

| side | 역할 |
|---|---|
| gjc_origin | upstream 클론 시점의 structure 동형 요약 (과거 har_struct) |
| jwc_patched | **structure/** 가 항상 최신 정본 — 본 파일은 인덱스·리베이스 전 훑기용 |

## 부록

- 전수 갱신: `bun struct_har/_scripts/struct-har-regenerate-architecture.ts`

