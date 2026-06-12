# 000 MOC — searchengine provider switching

> 상태: 스캐폴딩 ✅
> 입력: 사용자 지시 “exa가 개판이라 ChatGPT native search나 활성 프로바이더로 갈아끼우는 방안 + /SEARCHENGINE” (260612)
> 소유: `web_search` unified provider layer + slash command surface

## 문제

`web_search`는 이미 다수 provider를 지원하지만 operator가 즉석에서 “이번 세션 검색 엔진”을 바꾸는 표면이 약하다. Exa가 부정확하거나 noisy할 때 현재 active model의 native web search 또는 ChatGPT native search로 빠르게 전환해야 한다.

## 현재 구현 요약

- Tool: `packages/coding-agent/src/web/search/index.ts`
- Provider resolver: `packages/coding-agent/src/web/search/provider.ts`
- Provider preference setting: `providers.webSearch`
- Runtime setter: `setPreferredSearchProvider(provider)`
- Existing providers: `duckduckgo`, `exa`, `brave`, `jina`, `kimi`, `zai`, `perplexity`, `anthropic`, `gemini`, `codex`, `tavily`, `parallel`, `kagi`, `synthetic`, `searxng`
- `auto`: active model provider → native search mapping if credentials exist, then DuckDuckGo fallback

## 결정

1. Exa는 기본 추천 경로가 아니다. 명시 선택 시에만 사용한다.
2. 기본 UX는 `auto`: active model native search를 우선한다.
3. ChatGPT native search는 `codex` provider를 canonical로 쓰고, slash alias `chatgpt`, `openai`, `codex`를 모두 허용한다.
4. `/SEARCHENGINE` slashline은 settings-backed persistent preference와 runtime setter를 함께 갱신한다.
5. Provider별 native/search support matrix를 문서화해 “갈아끼울 수 있는 범주”를 명확히 한다.

## 범위

### MVP 포함

- `/searchengine` builtin slash command 추가. 대문자 `/SEARCHENGINE`는 parser가 case-insensitive가 아니면 alias로 명시 처리한다.
- `chatgpt`/`openai` alias → `codex` provider.
- 현재 provider 표시 + 후보 목록 출력.
- `providers.webSearch` 저장 + `setPreferredSearchProvider()` 호출.
- provider availability check는 표시용으로만 사용하고, 실행 실패는 기존 fallback/error path를 유지한다.

### MVP 비포함

- 새 provider 구현.
- Exa provider 삭제.
- `web_search` tool schema 확장.
- provider별 quality ranking 자동 학습.
- browser/web-ai search 통합.

## Acceptance

- `/SEARCHENGINE` without args prints current provider and supported aliases.
- `/SEARCHENGINE chatgpt` persists `providers.webSearch=codex` and subsequent `web_search` prefers Codex/OpenAI native search when credentials exist.
- `/SEARCHENGINE auto` restores active-model native search preference.
- Invalid provider prints a bounded usage message and does not mutate settings.
- Existing settings selector path for `providers.webSearch` continues to work.

## Verification

- Unit test slash parser/handler for `auto`, `chatgpt`, `codex`, invalid provider.
- Focused web search resolver test: active `openai-codex`/`anthropic`/`google-gemini-cli` maps to `codex`/`anthropic`/`gemini` in auto mode and appends DuckDuckGo fallback.
- Manual smoke with available credentials: `/SEARCHENGINE chatgpt` → `web_search` response provider is `codex` or reports credential failure and fallback behavior as designed.

## Rollback

Remove the builtin slash command entry and any alias helper. Restore `providers.webSearch` schema only if changed. Existing provider implementations remain untouched.
