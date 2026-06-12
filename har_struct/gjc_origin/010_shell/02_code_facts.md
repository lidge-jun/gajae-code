# 010_shell — code facts (gjc_origin)

> **upstream 정본**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` @ `40c8d7f`  
> MOC 보조: `devlog/_plan/260612_jawcode_fork/010_moc_*.md`

## 1. upstream 경로 인벤토리 (`devlog/_upstream_gjc/`)

| # | upstream path | line | excerpt |
|---:|---|---:|---|
| 1 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 4 | ` * Uses PI_CONFIG_DIR (default ".gjc") for the config root and` |
| 2 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 20 | `export const APP_NAME: string = "gjc";` |
| 3 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 23 | `export const CONFIG_DIR_NAME: string = ".gjc";` |
| 4 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 92 | `/** Get the config directory name relative to home (e.g. ".gjc" or PI_CONFIG_DIR override). */` |
| 5 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 94 | `	return process.env.GJC_CONFIG_DIR ?? process.env.PI_CONFIG_DIR ?? CONFIG_DIR_NAME;` |
| 6 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 97 | `/** Get the config agent directory name relative to home (e.g. ".gjc/agent" or PI_CONFIG_DIR + "/agent"). */` |
| 7 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 143 | `						const joined = path.join(value, APP_NAME);` |
| 8 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 223 | `	return path.join(cwd, CONFIG_DIR_NAME);` |
| 9 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 242 | `	return path.join(getLogsDir(), `${APP_NAME}.${date.toISOString().slice(0, 10)}.log`);` |
| 10 | `devlog/_upstream_gjc/packages/utils/src/dirs.ts` | 447 | `	return dirs.agentSubdir(agentDir, `${APP_NAME}-debug.log`, "state");` |
| 11 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 32 | `const expectedBundledWorkflowSkills = ["deep-interview", "ralplan", "team", "ultragoal"] as const;` |
| 12 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 35 | `const expectedCliBins = ["gjc", "gjc-stats"] as const;` |
| 13 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 37 | `const allowedUnscopedPackageNames = new Set([expectedRootPackageName]);` |
| 14 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 257 | `const unexpectedBundledWorkflowSkills = bundledWorkflowSkills.filter(def => !expectedBundledWorkflowSkills.includes(def.` |
| 15 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 259 | `const missingBundledWorkflowSkills = expectedBundledWorkflowSkills.filter(name => !bundledWorkflowSkills.some(def => def` |
| 16 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 261 | `const nonGajaePackages = packages.filter(pkg => pkg.name && !pkg.name.startsWith(expectedPackageScope) && !allowedUnscop` |
| 17 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 263 | `const missingBins = expectedCliBins.filter(bin => !observedBins.includes(bin));` |
| 18 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 269 | `		cliBins: expectedCliBins,` |
| 19 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 271 | `		bundledWorkflowSkills: expectedBundledWorkflowSkills,` |
| 20 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 293 | `		unexpectedBundledWorkflowSkills,` |
| 21 | `devlog/_upstream_gjc/scripts/rebrand-inventory.ts` | 329 | `		unexpectedBundledWorkflowSkills.length > 0 \|\|` |
| 22 | `devlog/_upstream_gjc/packages/gajae-code/package.json` | 5 | `	"description": "One-line npm install wrapper for the Gajae-Code gjc CLI",` |
| 23 | `devlog/_upstream_gjc/packages/gajae-code/package.json` | 27 | `		"gjc"` |
| 24 | `devlog/_upstream_gjc/packages/gajae-code/package.json` | 29 | `	"bin": {` |
| 25 | `devlog/_upstream_gjc/packages/gajae-code/package.json` | 30 | `		"gjc": "bin/gjc.js"` |
| 26 | `devlog/_upstream_gjc/packages/gajae-code/package.json` | 39 | `		"bin",` |
| 27 | `devlog/_upstream_gjc/AGENTS.md` | 11 | `\| `deep-interview` \| Socratic requirements interview; writes approved specs under `.gjc/specs/`. \| `packages/coding-agen` |
| 28 | `devlog/_upstream_gjc/AGENTS.md` | 12 | `\| `ralplan` \| Consensus planning and approval gate; writes plans under `.gjc/plans/`. \| `packages/coding-agent/src/defau` |
| 29 | `devlog/_upstream_gjc/AGENTS.md` | 26 | `- `architect`, `planner`, and `critic` remain read-only for product files, but may use their restricted `bash` tool only` |
| 30 | `devlog/_upstream_gjc/AGENTS.md` | 37 | `2. `deep-interview` when intent, scope, or acceptance criteria are ambiguous.` |
| 31 | `devlog/_upstream_gjc/AGENTS.md` | 38 | `3. `ralplan` when requirements are clear enough to plan but architecture, sequencing, or verification needs consensus.` |
| 32 | `devlog/_upstream_gjc/AGENTS.md` | 42 | `Do not execute implementation from `deep-interview` or `ralplan` unless the user explicitly approves execution. Planning` |


- `packages/jwc/` — **없음** (`devlog/_upstream_gjc` @ `40c8d7f` 확인)

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

- MOC: `devlog/_plan/260612_jawcode_fork/010_moc_*`
- 로드맵: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
- patched SoT: `structure/` (jwc_patched side)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `010_shell`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
