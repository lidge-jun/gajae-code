# 260612 browse — tool schema slimming + browse skill

> 상태: 스캐폴딩 ✅
> 목적: `browser` tool 정의를 얇게 만들고 긴 조작 지침을 `browse` skill로 지연 주입한다.
> 비목표: 기존 MVP/web-ai 빌딩 폴더로 흡수하지 않는다. `browse`는 독립 브라우저 조작·진단 트랙이다.

## Jawdev layout

| 문서 | 역할 | 상태 |
|---|---|---|
| [000_moc_browse.md](./000_moc_browse.md) | 범위, 결정, 통합 원칙 | 스캐폴딩 ✅ |
| [010_plan_tool_slimming.md](./010_plan_tool_slimming.md) | `browser` tool description/schema 축소 실행안 | 스캐폴딩 ✅ |
| [020_skill_definition/SKILL.md](./020_skill_definition/SKILL.md) | 최소 `browse` skill 초안 | 스캐폴딩 ✅ |
| [030_subagent_review.md](./030_subagent_review.md) | planner/architecture/critic 점검 통합 기록 | 반영 완료 ✅ |

## Current decision

- Fork policy: 기존 “번들 기본 workflow skill 4개 제한”은 이 트랙에서 제품 제약으로 보지 않는다.
- 그래도 `browse`는 workflow skill이 아니라 **tool usage skill**로 취급한다.
- 기본 context 절감이 1차 목표다. 런타임 통합(cli-jaw/AGBrowse backend)은 후속 트랙이다.
- 현재 폴더의 MVP는 **계획 문서 스캐폴딩 + 실행 전 점검**이다. 이 패스에서는 제품 소스와 런타임 skill registry를 수정하지 않는다.
- 구현 MVP는 별도 착수 시 `010_plan_tool_slimming.md`의 phase split을 따른다.

## Subagent review — 260612

| reviewer | verdict | 반영 |
|---|---|---|
| sequence planner | 방향 적합, 실행 전 보강 필요 | B0 inventory, 측정 기준, skill discovery 경계 추가 |
| architecture planner | workflow skill 경계와 deferred-loader 계약 보강 필요 | `browse`를 non-workflow tool-help artifact로 고정 |
| critic | NEEDS_FIX → 문서 보강 필요 | rollback, token measurement, verification, path decision 추가 |
