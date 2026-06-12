# 083_output — code facts (gjc_origin)

> **upstream 정본**: `/Users/jun/Developer/new/700_projects/jawcode/devlog/_upstream_gjc/` @ `40c8d7f`  
> MOC 보조: `devlog/_plan/260612_jawcode_fork/083_moc_*.md`

## 1. upstream 경로 인벤토리 (`devlog/_upstream_gjc/`)

| # | upstream path | line | excerpt |
|---:|---|---:|---|
| 1 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 5 | `import { renderDeepInterviewAssistantText } from "../../deep-interview/render-middleware";` |
| 2 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 8 | `import { resolveImageOptions } from "../../tools/render-utils";` |
| 3 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 11 | ` * Component that renders a complete assistant message` |
| 4 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 16 | `	#toolImagesByCallId = new Map<string, ImageContent[]>();` |
| 5 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 49 | `	setToolResultImages(toolCallId: string, images: ImageContent[]): void {` |
| 6 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 50 | `		if (!toolCallId) return;` |
| 7 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 53 | `			if (key.startsWith(`${toolCallId}:`)) {` |
| 8 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 58 | `			if (key.startsWith(`${toolCallId}:`)) {` |
| 9 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 63 | `			this.#toolImagesByCallId.delete(toolCallId);` |
| 10 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 65 | `			this.#toolImagesByCallId.set(toolCallId, validImages);` |
| 11 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 66 | `			this.#convertToolImagesForKitty(toolCallId, validImages);` |
| 12 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/components/assistant-message.ts` | 73 | `	#convertToolImagesForKitty(toolCallId: string, images: ImageContent[]): void {` |
| 13 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 16 | `} from "../../modes/components/read-tool-group";` |
| 14 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 18 | `import { ToolExecutionComponent } from "../../modes/components/tool-execution";` |
| 15 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 29 | `import { formatBytes, formatDuration } from "../../tools/render-utils";` |
| 16 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 68 | `		const rendered = useDim ? theme.fg("dim", message) : message;` |
| 17 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 71 | `			this.ctx.lastStatusText.setText(rendered);` |
| 18 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 77 | `		const text = new Text(rendered, 1, 0);` |
| 19 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 156 | `						component.setExpanded(this.ctx.toolOutputExpanded);` |
| 20 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 205 | `					const renderer = this.ctx.session.extensionRunner?.getMessageRenderer(message.customType);` |
| 21 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 207 | `					const component = new CustomMessageComponent(message as CustomMessage<unknown>, renderer);` |
| 22 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 208 | `					component.setExpanded(this.ctx.toolOutputExpanded);` |
| 23 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 216 | `				component.setExpanded(this.ctx.toolOutputExpanded);` |
| 24 | `devlog/_upstream_gjc/packages/coding-agent/src/modes/utils/ui-helpers.ts` | 223 | `				component.setExpanded(this.ctx.toolOutputExpanded);` |

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

- MOC: `devlog/_plan/260612_jawcode_fork/083_moc_*`
- 로드맵: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
- patched SoT: `structure/` (jwc_patched side)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin `devlog/_upstream_gjc` @ `40c8d7f`
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
