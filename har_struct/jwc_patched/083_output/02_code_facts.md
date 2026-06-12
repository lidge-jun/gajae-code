# 083_output — code facts (jwc_patched)

> MOC `083_moc_tui_output.md`에서 추출한 경로·팩트 + devlog `083*` 플랜.

## 1. 경로 인벤토리 (MOC 인용)

| # | path |
|---:|---|
| 1 | `(MOC에 경로 없음 — structure/ 참조)` |

## 2. devlog 플랜·diff 발췌

### `083.1_plan_tool_autocollapse.md`

```markdown
# 083.1 — plan: 완료 도구 자동 접힘 (A→B 시 A 한 줄로, 재오픈 가능)

> 상태: 🔶 1차(A안 minimize) 구현 완료 (2026-06-12) / 패턴 B(포커스 개별 펼침) ⬜ / 패턴 A(Ctrl+T 오버레이) ⬜.
> 소속: 083 ([083_moc_tui_output.md](./083_moc_tui_output.md)).
> 입력: 사용자 "펼쳐지는 건 좋은데 a tool b tool 갔을때 a는 접히고 나중에 열 수 있게 해야지".

## 현재 동작 (코드 사실)

- 도구 펼침은 **전역 단일 플래그** `toolOutputExpanded` (ctrl+o = `app.tools.expand`)로만 제어. 누르면
  **모든** 도구 컴포넌트에 `setExpanded(전역값)` 일괄 적용 (`ui-helpers.ts:157,209,…`, `event-controller.ts:118,371,486`).
- 도구 컴포넌트 상태는 2개뿐: `#expanded`(전체 출력) vs 기본(previewLines 축약). **도구별 "한 줄 요약"
  상태 없음.** → 도구가 여러 개면 각자 preview(헤더+N줄+expand 힌트)가 **세로로 누적**.
- 라이브 생성: `event-controller.ts:472 #handleToolExecutionStart` → `new ToolExecutionComponent(...)` →
  `chatContainer.addChild` + `pendingTools.set(toolCallId, component)`.

## 목표 동작 (Claude Code식)

- **활성/최신 도구만** preview(또는 펼침)로 보이고, 그 이전의 완료 도구는 **한 줄 요약**(아이콘 + 도구명 +
  짧은 인자/상태, 예: `✔ Bash · pwd && ls -la`)으로 접힘.
- 접힌 도구는 **나중에 재오픈** 가능. **[확정] 요구: 접힌 모든 도구를 개별적으로 다시 열 수 있어야 한다**
  (전역 ctrl+o 일괄 펼침만으로는 부족 — 특정 도구 하나만 골라 펼치는 인터랙션 필요). 레퍼런스(Claude Code/Codex/
  opencode) 패턴을 `/Users/jun/Developer/codex/01_tui-design`에서 조사 중 → 결과를 본 설계에 반영.

## 레퍼런스 결론 (260612 11시, `/Users/jun/Developer/codex` 실소스 조사)

- **Codex(Rust/ratatui)** = "모든 도구 개별 재오픈" 요구의 정답 모델:
  - 셀이 **두 가지 출력 길이**를 제공 — `display_lines`(head 5/tail 5 잘림) vs `transcript_lines`(전체).
    `/Users/jun/Developer/codex/codex-cli/codex-rs/tui/src/history_cell/mod.rs:184–224`
  - 메인 뷰포트는 항상 잘린 요약 + 인라인 힌트 `… +N lines (ctrl + t to view transcript)`.
    `.../exec_cell/render.rs:32, 103–169, 254–259`
  - **Ctrl+T 전체 transcript 오버레이** — 모든 셀의 전체 출력을 풀스크린 pager로. `.../pager_overlay.rs:409–448`, `keymap.rs:672`
- **gemini-cli** = jwc 현재와 동일한 **전역 ctrl+o** height-unconstrain 토글(개별 아님). `MaxSizedBox.tsx:87–141`, `AppContainer.tsx:329`
- **Claude Code** = 디컴파일 docs만(상세 부족), **opencode** = 웹앱이라 스크롤백 접힘 개념 없음.

→ **권장 조합: 패턴 B(인라인 per-tool 개별 펼침, jwc `setExpanded` 재사용) 1차 + 패턴 A(Codex식 Ctrl+T
전체 transcript 오버레이) 2차.** 이 둘이면 "접힌 모든 도구를 개별적으로(B) + 전체 한눈에(A)" 요구 완전 충족.
전역 ctrl+o(현행)는 C로 보조 유지.

## 설계 (제안)

### A안 (권장·최소 위험): 3-state + "새 도구 시작 시 이전 도구 minimize"
1. `ToolExecutionComponent`에 `#minimized` 상태 + `setMinimized(bool)` 추가. 렌더에서 minimized면
   **헤더 1줄만** 출력(인자/결과 미리보기 생략). `tool-execution.ts:#updateDisplay`에 분기 추가.
2. `event-controller.ts:#handleToolExecutionStart`에서 새 컴포넌트 추가 직전, **직전 활성 도구 컴포넌트를
   `setMinimized(true)`**. "직전 활성"은 `pendingTools`/별도 `#lastToolComponent` 참조로 추적.
```

### `083.2_plan_tool_spacing.md`

```markdown
# 083.2 — plan: 도구 간 공백 과다 축소

> 상태: ✅ 구현 완료 (2026-06-12). 소속: 083 ([083_moc_tui_output.md](./083_moc_tui_output.md)).
> 입력: 사용자 "tool 과 tool 사이의 공백도 너무 큰 거 같은데?".

## 원인 (코드 사실)

도구 블록 하나당 빈 줄이 ~2-3줄 누적되는 원인 2겹 (`packages/coding-agent/src/modes/components/tool-execution.ts`):

1. **`:198` `this.addChild(new Spacer(1))`** — 도구 컴포넌트마다 **선행 1줄 빈 줄**.
2. **`:201-202` `new Box(1, 1, …)` / `new Text("", 1, 1, …)`** — 콘텐츠 박스/텍스트의 패딩/마진 `(1, 1)`
   (상/하 또는 좌/우). 세로 마진이면 도구마다 추가 빈 줄.

→ 도구가 연달아 오면 `Spacer(1)` + 박스 상하 마진이 합쳐져 도구 사이가 과하게 벌어짐.
(추가로 `tool-execution.ts:510/540/638`에 내부 `Spacer(1)`들이 있어 도구 내부 섹션 간격에도 기여 — 도구 간이
아니라 도구 내부이므로 1차 범위 밖, 단 동시 점검.)

## 레퍼런스 결론 (260612 11시, `/Users/jun/Developer/codex` 실소스)

**공통값 = "블록당 위쪽 1줄, 첫 블록 제외, 내부 패딩 0".**
- Codex: 셀 사이 `Insets::tlbr(top=1)`를 **첫 셀·stream continuation 제외** 모든 셀에 적용
  (`/Users/jun/Developer/codex/codex-cli/codex-rs/tui/src/chatwidget/rendering.rs:35`). transcript 내부도 빈 줄 1개.
- gemini: 도구 그룹 컨테이너 `marginBottom={0}` + 내부 요소만 선택적 1 (`ToolGroupMessage.tsx:331,446`).
- Claude Code: Yoga `gap`/`marginBottom={1}` (`01_cc_tui.md:387,456`).
→ jwc의 "무조건 선행 Spacer(1) + Box/Text 내부 패딩(1,1)"은 레퍼런스 대비 과함. **선행 1줄(첫 도구 0) + 내부 0**으로 수렴.

## 수정 방향 (제안)

### A안 (권장, 레퍼런스 일치): 선행 Spacer 조건부(첫 블록 0) + 내부 패딩 0
- `:198 Spacer(1)`를 **조건부**로 — 첫 도구(chatContainer 첫 추가)면 생략, 직전 형제가 있으면 1줄
  (Codex `i>0` 규칙, `pager_overlay.rs` render_cells). 컨트롤러가 "직전 형제 유무" 판단해 주입.
- `:201-202 Box(1,1)`/`Text("",1,1)`의 **상하 패딩을 0으로**(좌우만 유지) — 블록 간 간격은 위 Spacer 하나로
  일원화(Codex는 셀 내부 패딩이 아닌 셀 간 inset 1개로만 간격). Box 시그니처(`packages/tui/src/components/box.ts`)
  확인 후 가로/세로 분리 적용.
- 위험: 도구↔직전 텍스트 경계가 붙어 보일 수 있음 → 조건부 1줄로 경계만 유지.

### B안: Box/Text 세로 마진 축소
- `Box(1,1)`/`Text("",1,1)`의 세로 마진을 0으로(좌우 패딩만 유지)하면 도구 내부도 타이트. Box 시그니처
  (`packages/tui/src/components/box.ts`) 확인 후 가로/세로 패딩 인자 분리 적용.

### 권장 조합: A(선행 Spacer 제거) 우선 적용 → 시각 확인 → 필요 시 B로 미세조정.

### 열린 질문
1. 도구↔어시스턴트 텍스트 경계는 1줄 유지가 자연스러운가 (붙으면 가독성↓)?
2. 083.1(자동 접힘)과 상호작용: minimized 한 줄 도구들 사이는 간격 0이 더 깔끔 — 083.1 구현 시 함께 튜닝.
```

### `083_moc_tui_output.md`

```markdown
# 083 — TUI 출력 접기/노이즈 (MOC, 계획)

> 상태: 🔶 083.2 ✅ + 083.1 1차(minimize) ✅ (260612 12시) / 083.1 패턴 B(포커스 개별 펼침)·패턴 A(Ctrl+T 오버레이) ⬜.
> 소속: 080 밴드(TUI)의 출력-밀도 하위군. 입력: 사용자 "jwc가 claude code처럼
> 접기가 부족, --verbose 항상 보는 느낌" (260612 10시) + "tool↔tool 공백 너무 큼".
> ⚠️ 번호 규약: TUI 출력 밀도 버그군을 083 하위(083.n)로 묶음 (081=cursor 도구, 082=TUI 입력/IME).

jwc TUI가 Claude Code 대비 출력이 장황하게 느껴지는 문제. 조사 결과 **접기 인프라는 있으나(도구 출력
previewLines + ctrl+o 펼침, JSON 트리 collapse, thinking 토글) 두 가지 핵심 UX가 빠져 있다.**

## 하위 문서 (계획)

| # | 이슈 | 핵심 | 상태 |
|---|------|------|------|
| [083.1](./083.1_plan_tool_autocollapse.md) | 완료 도구 자동 접힘 | A 도구→B 도구 시 A가 한 줄 요약(`✔ bash: … +N lines`)으로, ctrl+o로 재오픈 | 🔶 1차 ✅ (3a85824) / 패턴 B·A ⬜ |
| [083.2](./083.2_plan_tool_spacing.md) | 도구 간 공백 과다 | 도구 사이 빈 줄 3줄 → 1줄 (Box/Text 세로 패딩 0, Spacer 일원화) | ✅ 구현 (a590aea) |

## 관련 레버 (참고)

- **thinking 기본 펼침**: `hideThinkingBlock` 기본값 `false` (`settings-schema.ts:729`) → 추론 트레이스가
  매 턴 통째로 인라인. Claude Code는 기본 접음. 083 범위 밖이나 노이즈 동일 원인 — 별도 결정 시 jwc 브랜드
  기본값 변경 또는 "완료 후 한 줄 요약 접기" 검토 가능. (사용자 1차 선택은 "도구 자동 접힘" 우선.)

## 공통 코드 지도

- 라이브 도구 컴포넌트 생성: `packages/coding-agent/src/modes/controllers/event-controller.ts:472`
  (`#handleToolExecutionStart` → `new ToolExecutionComponent` → `chatContainer.addChild`, `pendingTools` 추적)
- 정적 재렌더(히스토리): `packages/coding-agent/src/modes/utils/ui-helpers.ts` (`setExpanded(toolOutputExpanded)` 전역 적용)
- 전역 펼침 토글: `toolOutputExpanded` (ctrl+o = `app.tools.expand`) — 모든 도구 일괄 토글, 도구별 상태 없음
- 도구 컴포넌트: `packages/coding-agent/src/modes/components/tool-execution.ts`
  (`setExpanded`, `#expanded`, `previewLines`, 생성자 `:198 Spacer(1)` / `:201-202 Box/Text(1,1)`)

## 완료 기준 (구현 시)

- 083.1: 도구 여러 개 실행 시 활성 도구만 펼침, 이전 완료 도구는 한 줄 요약 + ctrl+o로 재오픈 → ✅ 1차 충족
  (단위 테스트 `tool-execution-minimize.test.ts`). **포커스 기반 개별 펼침(패턴 B)·Ctrl+T 오버레이(패턴 A)는 잔여.**
- 083.2: 도구 간 빈 줄이 1줄 이내로 축소 → ✅ 정확히 1줄 (`tool-execution-spacing.test.ts`), gjc 무회귀
  (스위트 5322 pass, 변경은 브랜드 무관 공통 컴포넌트).
```

## 3. 검증 명령

```bash
bun check
bun test packages/coding-agent
bun scripts/rebrand-inventory.ts --strict
```


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `083_output`** · side `jwc_patched` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
