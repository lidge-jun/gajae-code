# 083_output — TUI 출력·접기 (gjc_origin)

> **MOC 정본**: `devlog/_plan/260612_jawcode_fork/083_moc_tui_output.md`
> **side**: `gjc_origin` · **최소 100줄** · patched SoT는 `structure/`

## 0. baseline 스냅샷 (요약)

이전 스냅샷 요약

# 083_output — TUI 출력 / 도구 접기 (gjc_origin)

도구 출력 렌더 — 기본 gjc spacing/collapse 정책.

- 긴 tool output 전체 펼침
- autocollapse·spacing 튜닝 없음

## 1. MOC 전문

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

## 2. 관련 devlog 문서 목록

- `083.1_plan_tool_autocollapse.md` — # 083.1 — plan: 완료 도구 자동 접힘 (A→B 시 A 한 줄로, 재오픈 가능)
- `083.2_plan_tool_spacing.md` — # 083.2 — plan: 도구 간 공백 과다 축소

## 3. gjc_origin ↔ jwc_patched delta

| 항목 | gjc_origin | jwc_patched |
|---|---|---|
| 1 | upstream baseline | fork patched |
| 2 | upstream baseline | fork patched |
| 3 | upstream baseline | fork patched |
| 4 | upstream baseline | fork patched |

## 4. structure/ 링크

- `structure/INDEX.md`
- `structure/workflows.md`
- `structure/architecture.md`

## 5. upstream 계약

- AGENTS.md 수정 금지
- default workflows 표면: deep-interview (코드는 jaw-interview)


## 부록 — 용어·교차참조 1

- **[기본값]**: 업스트림 gjc가 실제로 하는 동작; 결정 없으면 유지
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 2

- **[제안]**: repo 기본값에서 벗어나는 변경안; 채택은 인터뷰 필요
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 3

- **MOC**: Map of Content — 밴드 스코프/완료기준 정본
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 4

- **L1/L2/L3**: 040 rename 계층: 표면 / 영속 state / RPC wire (042)
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 5

- **D5**: 글로벌 스킬 루트 ~/.cli-jaw/skills
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 6

- **D10**: cli-jaw 명령 어휘 통일 (orchestrate/goal/memory)
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 7

- **SoT**: structure/ = patched 단일 source of truth
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 8

- **har_struct**: gjc_origin vs jwc_patched 병렬 대조 스냅샷
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`


## 부록 — 용어·교차참조 9

- **rebrand-inventory**: scripts/rebrand-inventory.ts — bin·스킬 4종 기계 검증
- **밴드 `083_output`** · side `gjc_origin` · 갱신 규칙: jwc_patched 선행 → gjc_origin HEAD
- **로드맵**: `devlog/_plan/260612_jawcode_fork/000_roadmap.md`
