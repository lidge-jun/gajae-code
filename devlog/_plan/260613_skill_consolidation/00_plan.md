# 스킬 통합: ultragoal → goal 흡수, ralplan → orchestrate p 대체

> 상태: 📋 계획 (260613)
> 소속: jawcode M2+ · 선행: 99.03.00 workflow surface revision

## 핵심 결정

| 현재 | 변경 | 이유 |
|---|---|---|
| `ultragoal` (번들 스킬) | `/goal` 네이티브 커맨드에 흡수 | 이미 동일 엔진 (`ultragoal-runtime.ts`) 공유, 스킬은 가이드 래퍼일 뿐 |
| `ralplan` (번들 스킬) | `jwc orchestrate p`로 완전 대체, 제거 | 99.30.02에서 superseded 선언 완료, 레거시 호환만 유지 중 |

## 현황: 왜 분리돼 있나

```
ultragoal SKILL.md (가이드)
    ↓ goal({op}) tool 호출
ultragoal-runtime.ts (엔진)
    ↓ 동일 함수
/goal CLI verbs (어댑터)
    ↓ 동일 저장소
.jwc/ultragoal/ (아티팩트)
```

- ultragoal 스킬 = 에이전트에게 "이렇게 goal tool을 써라"는 가이드
- `/goal` CLI = 사람이 쓰는 동일 엔진 어댑터
- **완전한 중복** — 스킬이 별도 존재할 이유 없음

ralplan은 이미 SKILL.md 첫 줄에 "SUPERSEDED" 선언. 실질적으로 `jwc orchestrate p`가 대체.

## 스킬 이름 변경

| 현재 | 변경 | 비고 |
|---|---|---|
| `/skill:ultragoal` | **제거** → goal 네이티브 가이드로 흡수 | `goal({op})` tool description에 가이드 통합 |
| `/skill:ralplan` | **제거** | `jwc orchestrate p` 완전 대체 |
| `/skill:jaw-interview` | 유지 | 독립 워크플로우, 변경 없음 |
| `/skill:team` | 유지 | 독립 워크플로우, 변경 없음 |
| `/skill:browse` | 유지 | tool-help 스킬, 변경 없음 |
| `/skill:search` | 유지 | tool-help 스킬, 변경 없음 |

번들 기본 스킬: **6 → 4** (jaw-interview, team, browse, search)

## 영향 범위 전수

### S1: ultragoal → goal 흡수

| 파일 | 변경 |
|---|---|
| `defaults/jwc/skills/ultragoal/SKILL.md` | 삭제 (가이드 내용은 goal tool description으로 이전) |
| `defaults/jwc/skills/ultragoal/ai-slop-cleaner.md` | goal 서브디렉토리로 이전 or tool prompt에 인라인 |
| `defaults/jwc-defaults.ts` | `ultragoal` 엔트리 제거 |
| `prompts/system/system-prompt.md` | `<skill name="ultragoal">` 하드코딩 제거 |
| `prompts/tools/skill.md` | ultragoal 참조 업데이트 |
| `jwc-runtime/workflow-manifest.ts:214` | `skill: "ultragoal"` → 네이티브 참조로 변경 |
| `modes/shared/agent-wire/workflow-gate-broker.ts:28` | `V1_STAGES`에서 `"ultragoal"` 제거 or 리네임 |
| `modes/shared/agent-wire/approval-gate.ts` | ultragoal execution gate → goal gate |
| `prompts/agents/executor.md` | `<ultragoal_red_team_mode>` → `<goal_red_team_mode>` |
| `cli.ts:45` | `ultragoal` CLI subcommand → `goal` 통합 (이미 goal-runtime.ts가 래핑) |

핵심: ultragoal-runtime.ts는 **그대로 유지** (엔진). 제거하는 건 스킬 래퍼뿐.

### S2: ralplan → orchestrate p 대체

| 파일 | 변경 |
|---|---|
| `defaults/jwc/skills/ralplan/SKILL.md` | 삭제 |
| `defaults/jwc-defaults.ts` | `ralplan` 엔트리 제거 |
| `prompts/system/system-prompt.md` | `<skill name="ralplan">` 하드코딩 제거 |
| `jwc-runtime/ralplan-runtime.ts` | 레거시 실행만 유지 or deprecate 경고 추가 |
| `jwc-runtime/workflow-manifest.ts:175` | `skill: "ralplan"` 제거 |
| `modes/shared/agent-wire/workflow-gate-broker.ts:28` | `"ralplan"` 제거 |
| `modes/shared/agent-wire/approval-gate.ts` | ralplan approval gate 제거 |
| `tools/bash-allowed-prefixes.ts:124` | `jwc ralplan --write` 제거 |
| `prompts/agents/planner.md` | `jwc ralplan --write` → `jwc orchestrate p` |
| `prompts/agents/critic.md` | 동일 치환 |
| `prompts/agents/architect.md` | 동일 치환 |
| `prompts/jaw/orchestrate-p.md` | ralplan 경로 참조 정리 |
| `prompts/jaw/orchestrate-a.md` | 동일 |
| `jaw-interview/SKILL.md` | ralplan 참조 → orchestrate p |
| `team/SKILL.md` | ralplan 참조 → orchestrate p |
| `cli.ts:46` | `ralplan` CLI subcommand 제거 or deprecation wrapper |

### S3: system-prompt.md 정리

현재 하드코딩 (lines 23-37):
```xml
<skill name="jaw-interview" ...>...</skill>
<skill name="ralplan" ...>...</skill>    ← 제거
<skill name="ultragoal" ...>...</skill>  ← 제거
<skill name="team" ...>...</skill>
```

변경 후:
```xml
<skill name="jaw-interview" ...>...</skill>
<skill name="team" ...>...</skill>
```

+ 동적 `{{#list skills}}` 블록이 나머지 스킬 렌더 (이미 구현 완료)

### S4: goal tool description 강화

ultragoal SKILL.md의 핵심 가이드를 goal tool의 description에 통합:
- multi-goal story plan 구조
- aggregate mode
- quality gate (ai-slop-cleaner, architect review)
- dynamic steering
- completion gate

위치: goal tool definition (현재 위치 확인 필요)

## 구현 순서

| # | 내용 | 위험도 |
|---|---|---|
| M1 | ralplan 스킬 제거 + 모든 참조 orchestrate p로 치환 | 낮음 (이미 superseded) |
| M2 | system-prompt.md에서 ralplan/ultragoal 하드코딩 제거 | 낮음 (동적 렌더로 대체) |
| M3 | ultragoal SKILL.md 가이드 → goal tool description 이전 | 중간 (가이드 손실 주의) |
| M4 | ultragoal 스킬 제거 + defaults 정리 | 낮음 (엔진 유지) |
| M5 | HUD 통합 — ultragoal HUD → goal + PABCD phase 표시 | 중간 |
| M6 | 테스트 — goal 워크플로우 정상, ralplan 레거시 아티팩트 읽기 가능 | — |

### M5: HUD 통합 상세

현재 (ultragoal 별도):
```
◆ hud ultragoal:goal-planning goals=0/0 current=goal-planning status=goal-planning receipt=fresh
```

변경 후 (goal + PABCD phase 통합):
```
◆ hud goal:P goals=1/3 current=G001 phase=P status=planning receipt=fresh
◆ hud goal:B goals=1/3 current=G001 phase=B status=building receipt=wip
◆ hud goal:C goals=1/3 current=G001 phase=C status=checking receipt=wip
◆ hud goal:D goals=2/3 current=G002 phase=D status=done receipt=complete
```

- `ultragoal:*` 네임스페이스 → `goal:*`로 단일화
- PABCD phase가 HUD에 직접 노출 — 현재 어떤 단계인지 한눈에 파악
- goals=N/M 카운터 + current story ID 유지
- orchestrate 상태와 goal 상태가 하나의 HUD 라인으로 통합

영향 파일:
- HUD 렌더러 (상태바에 ultragoal 표시하는 코드)
- goal-runtime.ts (HUD 상태 발행)
- ultragoal-runtime.ts (HUD 이벤트 포맷)

## 미결정

- ralplan-runtime.ts 완전 삭제 vs 레거시 아티팩트 읽기용 유지
- ultragoal의 ai-slop-cleaner.md를 어디로 옮길지 (goal tool prompt? 별도 파일?)
- `.jwc/plans/ralplan/` 기존 디스크 아티팩트 마이그레이션 or 읽기만 유지
- `V1_STAGES` 배열에서 제거 시 기존 gate 이벤트 호환성
