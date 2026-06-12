# 100_node — code facts (gjc_origin)

> **upstream 정본**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` @ `40c8d7f`  
> MOC 보조: `devlog/_plan/260612_jawcode_fork/100_moc_*.md`

## 1. upstream 경로 인벤토리 (`devlog/_upstream_gjc/`)

| # | upstream path | line | excerpt |
|---:|---|---:|---|
| 1 | `devlog/_upstream_gjc/packages/ai/package.json` | 35 | `		"check": "biome check . && bun run check:types",` |
| 2 | `devlog/_upstream_gjc/packages/ai/package.json` | 38 | `		"test": "bun test",` |
| 3 | `devlog/_upstream_gjc/packages/ai/package.json` | 41 | `		"generate-models": "bun scripts/generate-models.ts"` |
| 4 | `devlog/_upstream_gjc/packages/ai/package.json` | 52 | `		"@types/bun": "catalog:"` |
| 5 | `devlog/_upstream_gjc/packages/ai/package.json` | 54 | `	"engines": {` |
| 6 | `devlog/_upstream_gjc/packages/ai/package.json` | 55 | `		"bun": ">=1.3.14"` |
| 7 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 34 | `		"build": "bun scripts/build-binary.ts",` |
| 8 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 35 | `		"check": "biome check . && bun run check:types",` |
| 9 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 38 | `		"test": "bun test",` |
| 10 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 39 | `		"generate-schemas": "bun ../../scripts/generate-json-schemas.ts",` |
| 11 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 40 | `		"check:schemas": "bun ../../scripts/generate-json-schemas.ts --check",` |
| 12 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 41 | `		"fix": "biome check --write --unsafe . && bun run format-prompts && bun run generate-docs-index",` |
| 13 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 42 | `		"fmt": "biome format --write . && bun run format-prompts",` |
| 14 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 43 | `		"format-prompts": "bun scripts/format-prompts.ts",` |
| 15 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 44 | `		"generate-docs-index": "bun scripts/generate-docs-index.ts",` |
| 16 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 45 | `		"prepack": "bun scripts/generate-docs-index.ts",` |
| 17 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 46 | `		"generate-template": "bun scripts/generate-template.ts",` |
| 18 | `devlog/_upstream_gjc/packages/coding-agent/package.json` | 47 | `		"install:defaults": "bun src/cli.ts setup defaults"` |

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

- MOC: `devlog/_plan/260612_jawcode_fork/100_moc_*`
- 로드맵: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
- patched SoT: `structure/` (jwc_patched side)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 10

- **[확정]**: 인터뷰에서 확정된 결정 — devlog 05_interview_conclusions.md
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 11

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `100_node`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
