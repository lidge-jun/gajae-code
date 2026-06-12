# 020_prompt — code facts (gjc_origin)

> **upstream 정본**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` @ `40c8d7f`  
> MOC 보조: `devlog/_plan/260612_jawcode_fork/020_moc_*.md`

## 1. upstream 경로 인벤토리 (`devlog/_upstream_gjc/`)

| # | upstream path | line | excerpt |
|---:|---|---:|---|
| 1 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 2 | ` * System prompt construction and project context loading` |
| 2 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 7 | `import { $env, getGpuCachePath, getProjectDir, hasFsCode, isEnoent, logger, prompt } from "@gajae-code/utils";` |
| 3 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 10 | `import { systemPromptCapability } from "./capability/system-prompt";` |
| 4 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 14 | `import customSystemPromptTemplate from "./prompts/system/custom-system-prompt.md" with { type: "text" };` |
| 5 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 15 | `import projectPromptTemplate from "./prompts/system/project-prompt.md" with { type: "text" };` |
| 6 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 16 | `import systemPromptTemplate from "./prompts/system/system-prompt.md" with { type: "text" };` |
| 7 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 18 | `import { AGENTS_MD_LIMIT, buildWorkspaceTree, type WorkspaceTree } from "./workspace-tree";` |
| 8 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 27 | `	return prompt.format(content, { renderPhase: "post-render" }).trim();` |
| 9 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 40 | `function promptSourceContainsRule(source: string \| null \| undefined, ruleContent: string): boolean {` |
| 10 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 54 | `	promptSources: Array<string \| null \| undefined>,` |
| 11 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 59 | `		rule => !promptSources.some(source => promptSourceContainsRule(source, rule.content)),` |
| 12 | `devlog/_upstream_gjc/packages/coding-agent/src/system-prompt.ts` | 67 | `	return otherSources.some(otherSource => promptSourceContainsRule(otherSource, resolvedSource)) ? "" : resolvedSource;` |
| 13 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 3 | `You are GJC, the Gajae Code coding agent. You are the staff engineer trusted with load-bearing code changes, debugging u` |
| 14 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 19 | `<gjc-runtime>` |
| 15 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 23 | `<skill name="deep-interview" user-entrypoint="/skill:deep-interview" cli-runtime="native: gjc deep-interview">` |
| 16 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 24 | `Use for vague ideas that need Socratic requirements gathering, mathematical ambiguity scoring, topology confirmation, an` |
| 17 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 27 | `<skill name="ralplan" user-entrypoint="/skill:ralplan" cli-runtime="native: gjc ralplan">` |
| 18 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 28 | `Use for consensus planning when requirements are clear enough to plan but architecture, sequencing, or verification need` |
| 19 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 31 | `<skill name="ultragoal" user-entrypoint="/skill:ultragoal" cli-runtime="native: gjc ultragoal">` |
| 20 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 32 | `Use for durable multi-goal execution ledgers under `.gjc/ultragoal/`, especially when a leader must track goal state, ch` |
| 21 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 35 | `<skill name="team" user-entrypoint="/skill:team" cli-runtime="native: gjc team">` |
| 22 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 36 | `Use for tmux-backed coordinated execution with workers, shared state under `.gjc/state/team/`, mailbox/dispatch APIs, wo` |
| 23 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 39 | `Agent sessions MUST activate bundled workflow skills via the `/skill:<name>` user-entrypoint unless a skill explicitly r` |
| 24 | `devlog/_upstream_gjc/packages/coding-agent/src/prompts/system/system-prompt.md` | 42 | `GJC also bundles four source-defined role agents for the task/sub-agent tool. These are not workflow skills and are not ` |

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

- MOC: `devlog/_plan/260612_jawcode_fork/020_moc_*`
- 로드맵: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
- patched SoT: `structure/` (jwc_patched side)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `020_prompt`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
