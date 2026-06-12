# 030_skills — code facts (gjc_origin)

> **upstream 정본**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` @ `40c8d7f`  
> MOC 보조: `devlog/_plan/260612_jawcode_fork/030_moc_*.md`

## 1. upstream 경로 인벤토리 (`devlog/_upstream_gjc/`)

| # | upstream path | line | excerpt |
|---:|---|---:|---|
| 1 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 3 | `import autoAnswerUncertainFragment from "./gjc/skills/deep-interview/auto-answer-uncertain.md" with { type: "text" };` |
| 2 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 4 | `import autoResearchGreenfieldFragment from "./gjc/skills/deep-interview/auto-research-greenfield.md" with {` |
| 3 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 7 | `import deepInterviewSkill from "./gjc/skills/deep-interview/SKILL.md" with { type: "text" };` |
| 4 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 13 | `export const DEFAULT_GJC_DEFINITION_NAMES = ["deep-interview", "ralplan", "team", "ultragoal"] as const;` |
| 5 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 14 | `export type DefaultGjcDefinitionName = (typeof DEFAULT_GJC_DEFINITION_NAMES)[number];` |
| 6 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 74 | `const DEFAULT_GJC_DEFINITIONS: readonly DefaultGjcDefinition[] = [` |
| 7 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 77 | `		name: "deep-interview",` |
| 8 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 78 | `		relativePath: "skills/deep-interview/SKILL.md",` |
| 9 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 86 | `		parentSkillName: "deep-interview",` |
| 10 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 87 | `		relativePath: "skill-fragments/deep-interview/auto-research-greenfield.md",` |
| 11 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 92 | `		parentSkillName: "deep-interview",` |
| 12 | `devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts` | 93 | `		relativePath: "skill-fragments/deep-interview/auto-answer-uncertain.md",` |
| 13 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 4 | `import { skillCapability } from "../capability/skill";` |
| 14 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 7 | `import { type Skill as CapabilitySkill, loadCapability } from "../discovery";` |
| 15 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 8 | `import { compareSkillOrder, scanSkillsFromDir } from "../discovery/helpers";` |
| 16 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 11 | `import type { LoadedSubskillActivation } from "./gjc-plugins";` |
| 17 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 12 | `import { buildSubskillInjection } from "./gjc-plugins/injection";` |
| 18 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 20 | `	 * When `true`, the skill is loaded and reachable via `skill://<name>` and` |
| 19 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 21 | `	 * skill slash aliases, but is excluded from the rendered system prompt's` |
| 20 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 22 | `	 * `<skills>` listing.` |
| 21 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 27 | `	/** Embedded SKILL.md content for bundled defaults that survive .gjc deletion. */` |
| 22 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 32 | `	skillPath: string;` |
| 23 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 37 | `	skills: Skill[];` |
| 24 | `devlog/_upstream_gjc/packages/coding-agent/src/extensibility/skills.ts` | 44 | ` * Process-global snapshot of skills the active session loaded.` |

## 2. fork diff 관찰 (worktree vs upstream)

```bash
# 밴드 공통 diff 패턴
diff -qr devlog/_upstream_gjc/packages/coding-agent/src/ packages/coding-agent/src/ | head
git -C devlog/_upstream_gjc rev-parse --short HEAD   # → 40c8d7f
git rev-parse --short HEAD               # → e90ee99
```

| 관찰 | upstream (`devlog/_upstream_gjc`) | fork (worktree) |
|---|---|---|
| HEAD | `40c8d7f` | `e90ee99` |
| jwc wrapper | 없음 | `packages/jwc` ✅ |
| interview slug | `deep-interview` | `jaw-interview` ✅ |

## 3. 검증 명령 (upstream 클론에서)

```bash
git -C devlog/_upstream_gjc log -1 --oneline
grep -n deep-interview devlog/_upstream_gjc/packages/coding-agent/src/defaults/gjc-defaults.ts
grep -n expectedCliBins devlog/_upstream_gjc/scripts/rebrand-inventory.ts
bun -C devlog/_upstream_gjc run check   # upstream 자체 검증
```

## 4. devlog 교차 (스코프·결정)

- MOC: `devlog/_plan/260612_jawcode_fork/030_moc_*`
- 로드맵: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
- patched SoT: `structure/` (jwc_patched side)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `030_skills`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
