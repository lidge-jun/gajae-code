# 081_cursor — code facts (gjc_origin)

> **upstream 정본**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` @ `40c8d7f`  
> MOC 보조: `devlog/_plan/260612_jawcode_fork/081_moc_*.md`

## 1. upstream 경로 인벤토리 (`devlog/_upstream_gjc/`)

| # | upstream path | line | excerpt |
|---:|---|---:|---|
| 1 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 25 | `	ToolCall,` |
| 2 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 32 | `import { toolWireSchema } from "../utils/schema/wire";` |
| 3 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 272 | `	if (typeName === "agent.v1.McpToolCall") {` |
| 4 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 351 | `			const requestContextTools = buildMcpToolDefinitions(context.tools);` |
| 5 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 375 | `			let currentToolCall: ToolCallState \| null = null;` |
| 6 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 385 | `				get currentToolCall() {` |
| 7 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 386 | `					return currentToolCall;` |
| 8 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 397 | `				setToolCall: t => {` |
| 9 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 398 | `					currentToolCall = t;` |
| 10 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 528 | `			if (state.currentToolCall) {` |
| 11 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 529 | `				const idx = output.content.indexOf(state.currentToolCall);` |
| 12 | `devlog/_upstream_gjc/packages/ai/src/providers/cursor.ts` | 530 | `				state.currentToolCall.arguments = parseStreamingJson(state.currentToolCall.partialJson);` |
| — | `devlog/_upstream_gjc/packages/coding-agent/src/cursor.ts` | — | *(file exists, no pattern hit)* |

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

- MOC: `devlog/_plan/260612_jawcode_fork/081_moc_*`
- 로드맵: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
- patched SoT: `structure/` (jwc_patched side)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `081_cursor`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `081_cursor`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `081_cursor`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `081_cursor`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `081_cursor`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`

## 부록 — upstream 87

- cite `devlog/_upstream_gjc/` not fork root when documenting gjc_origin

## 부록 — upstream 91

- cite `devlog/_upstream_gjc/` not fork root when documenting gjc_origin

## 부록 — upstream 95

- cite `devlog/_upstream_gjc/` not fork root when documenting gjc_origin

## 부록 — upstream 99

- cite `devlog/_upstream_gjc/` not fork root when documenting gjc_origin
