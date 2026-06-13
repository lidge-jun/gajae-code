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

```yaml
subagent_models:
  self: (현재 메인 세션 모델)

  # ── 직접 OAuth/API 연동 ──
  anthropic:
    best: claude-opus-4-8
    cheap: claude-sonnet-4-6
  openai-codex:
    best: gpt-5.5
    cheap: gpt-5.4-mini
  xai:
    cheap: grok-composer-2.5-fast         # best 없음 (cheap only)
  google:
    best: gemini-3.1-pro
    cheap: gemini-3.5-flash

  # ── 런타임 프록시 (kiro/copilot은 자체 인증으로 다른 모델 접근) ──
  kiro:
    best: claude-fable-5                  # kiro 자체 인증 경유
    cheap: deepseek-3.2                   # kiro 무료 모델
  copilot:
    best: gpt-5.5                         # copilot 자체 인증 경유
    cheap: gpt-5-mini

  # ── 코딩 특화 (opencode-go, alibaba-coding-plan 등) ──
  opencode-go:
    best: mimo-v2.5-pro                   # $1.74/$3.48, 1M ctx
    cheap: deepseek-v4-flash              # $0.14/$0.28, 1M ctx
  alibaba-coding-plan:
    best: qwen3.6-plus                    # 무료, 1M ctx
    cheap: qwen3.6-flash                  # $0.19/$1.13, 1M ctx

  # ── 추론 인프라 (cerebras/groq — 속도 특화) ──
  cerebras:
    best: qwen-3-coder-480b              # 무료
    cheap: gpt-oss-120b                   # $0.25/$0.69
  groq:
    best: kimi-k2-instruct               # $1/$3, 262K
    cheap: llama-4-scout-17b-16e          # $0.11/$0.34

  # ── 독립 프로바이더 ──
  deepseek:
    best: deepseek-v4-pro                 # $0.44/$0.87, 1M ctx
    cheap: deepseek-v4-flash              # $0.14/$0.28, 1M ctx
  minimax-code:
    best: minimax-m3                      # 512K ctx
    cheap: MiniMax-M2.5                   # 무료
  mistral:
    best: mistral-medium-latest           # $1.5/$7.5, 262K
    cheap: devstral-small-latest          # $0.1/$0.3, 128K
```

추가 규칙:
- **cheap의 리즈닝 파라미터는 메인 세션(self)과 동일**하게 상속. cheap이라고 thinking off 하지 않음.
- best가 없는 프로바이더(xai)는 cheap만 노출 → 해당 프로바이더의 총 슬롯 = 1.
- 런타임 프록시(kiro/copilot)는 자체 인증을 경유하므로 별도 로그인 불필요 — 해당 런타임 로그인만 있으면 서브에이전트 모델 접근 가능.
- 인프라 프로바이더(cerebras/groq)는 속도 특화 — 탐색/파싱 서브에이전트에 적합.

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
self (1) + Σ provider slots = 1 + Σ(best?1:0 + cheap?1:0)

예시 (전 프로바이더 로그인):
  self(1) + anthropic(2) + codex(2) + xai(1) + google(2)
  + kiro(2) + copilot(2) + opencode-go(2) + alibaba(2)
  + cerebras(2) + groq(2) + deepseek(2) + minimax-code(2) + mistral(2)
  = 1 + 25 = 26 모델 (이론적 최대)

현실적 (주요 4개):
  self(1) + anthropic(2) + codex(2) + xai(1) + google(2) = 8 모델
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
