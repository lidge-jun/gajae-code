# 083 — TUI 출력 접기/노이즈 (MOC, 계획)

> 상태: 📋 계획 (조사 완료, 구현 ⬜). 소속: 080 밴드(TUI)의 출력-밀도 하위군. 입력: 사용자 "jwc가 claude code처럼
> 접기가 부족, --verbose 항상 보는 느낌" (260612 10시) + "tool↔tool 공백 너무 큼".
> ⚠️ 번호 규약: TUI 출력 밀도 버그군을 083 하위(083.n)로 묶음 (081=cursor 도구, 082=TUI 입력/IME).

jwc TUI가 Claude Code 대비 출력이 장황하게 느껴지는 문제. 조사 결과 **접기 인프라는 있으나(도구 출력
previewLines + ctrl+o 펼침, JSON 트리 collapse, thinking 토글) 두 가지 핵심 UX가 빠져 있다.**

## 하위 문서 (계획)

| # | 이슈 | 핵심 | 상태 |
|---|------|------|------|
| [083.1](./083.1_plan_tool_autocollapse.md) | 완료 도구 자동 접힘 | A 도구→B 도구 시 A가 한 줄로 접히고 나중에 재오픈 (현재는 전역 ctrl+o만, 도구별 개념 없음) | 📋 계획 |
| [083.2](./083.2_plan_tool_spacing.md) | 도구 간 공백 과다 | 도구마다 leading `Spacer(1)` + Box/Text 패딩(1,1)으로 ~2-3줄 빈 줄 누적 | 📋 계획 |

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

- 083.1: 도구 여러 개 실행 시 활성 도구만 펼침, 이전 완료 도구는 한 줄 요약 + ctrl+o(또는 포커스)로 재오픈
- 083.2: 도구 간 빈 줄이 1줄 이내로 축소 (가독성 유지), gjc 무회귀 스냅샷
