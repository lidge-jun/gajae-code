# 서브에이전트 멀티프로바이더 모델 라우팅

> 상태: 📋 계획 (260613)
> 소속: jawcode M2+ · 선행: 110 JawRuntime 상주 + 130 주입 3종

## 핵심 아이디어

서브에이전트(task agent) spawn 시 **로그인된 프로바이더 풀에서 모델을 골라 지정**할 수 있게 한다.
메인 세션은 비싼 모델(opus), 서브에이전트는 싸고 빠른 모델(haiku, gpt-5.4-mini)로 돌려서
토큰 비용 최적화. Claude Code의 `Agent({model: "sonnet"})` 패턴과 동일한 UX.

## 설계

### 프리셋 구조: `self + provider × 2`

각 프로바이더별로 **best**(품질 우선)와 **cheap**(비용/속도 우선) 두 슬롯을 프리셋으로 지정.
서브에이전트 spawn 시 `self`(메인과 동일), `best:provider`, `cheap:provider` 중 선택.

```
subagent_models:
  self: (현재 메인 세션 모델 — 별도 지정 불필요)
  anthropic:
    best: claude-opus-4-8
    cheap: claude-haiku-4-5
  openai-codex:
    best: gpt-5.5
    cheap: gpt-5.4-mini
  xai:
    best: grok-4.3
    cheap: grok-composer-2.5-fast
  google:
    best: gemini-3-flash-preview
    cheap: gemini-2.5-flash
```

### 노출 규칙

| 조건 | 서브에이전트에 노출되는 모델 |
|---|---|
| **self** (기본) | 메인 세션과 동일 모델 — 현행 동작 |
| **같은 프로바이더** | 해당 프로바이더의 지원 모델명 전체 노출 (OAuth cutoff 적용) |
| **다른 프로바이더** | 프리셋 best/cheap 2개만 노출 |

- OAuth cutoff: 99.30.04에서 구현한 `unlisted` 마킹이 그대로 적용. 서브에이전트에도 listed 모델만 보임.
- 프리셋은 **기본값 내장 + 사용자 오버라이드** 가능. 저장 위치 후보:
  - `~/.jwc/agent/config.yml` (jwc 설정 파일, 이미 존재)
  - `settings.json` 내 `subagentModels` 키 (cli-jaw 측, jaw 모드일 때)
  - env는 부적합 (구조화된 데이터) → 설정 파일이 맞음

### 총 사용 가능 모델 수

```
self (1) + providers × 2 = 1 + N×2

예시 (4 provider 로그인):
  self(1) + anthropic(2) + codex(2) + xai(2) + google(2) = 9 모델
```

## 기존 인프라

- `createAgentSession({ model })`: 이미 model 옵션 존재 (sdk.ts:225)
- `authStorage.list()`: 로그인된 프로바이더 목록 반환
- `discoverAuthStorage(agentDir)`: 프로바이더별 credential 탐색
- 서브에이전트(task agent): `taskDepth` + `model` 조합으로 spawn, `taskDepth` 상한으로 재귀 제한
- 99.30.04 `unlisted` 인프라: OAuth cutoff가 서브에이전트 모델 선택에도 자연 적용

## 구현 슬라이스 (초안)

| # | 내용 | 비고 |
|---|---|---|
| S1 | 프리셋 스키마 정의 + 기본값 내장 | `SubagentModelPreset` 타입, 위 표의 기본값 |
| S2 | 설정 파일 로드/오버라이드 | config.yml 또는 settings.json 경로 결정 |
| S3 | task agent spawn 시 model 라우팅 | `resolveSubagentModel(preset, targetHint)` |
| S4 | TUI 노출 | 서브에이전트 spawn 시 어떤 모델로 돌리는지 표시 |
| S5 | e2e | 다른 프로바이더 서브에이전트 1턴 완주 |

## 미결정

- 서브에이전트가 **도구 권한**을 메인과 동일하게 받는지, 제한하는지 (130 도구 샌드박스 소관)
- 프로바이더 간 **시스템 프롬프트 호환성** — anthropic → codex 전환 시 프롬프트 포맷 차이
- **비용 추적**: 프로바이더별 토큰 소비를 분리 집계할지
- 프리셋 이름을 사용자가 자유롭게 붙일 수 있게 할지 (best/cheap 고정 vs 커스텀 슬롯)
