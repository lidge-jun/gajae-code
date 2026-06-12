# 030 Provider Matrix — web_search swap categories

> 상태: 스캐폴딩 ✅
> 목적: provider별 검색 지원과 교체 가능 범주를 정리한다.

## Categories

| 범주 | 의미 | 대표 |
|---|---|---|
| Active-native | 현재 선택된 model provider의 native search를 우선 사용 | `auto` |
| Subscription native | OAuth/subscription 계정의 provider-native search | `codex`, `anthropic`, `gemini` |
| Keyed API search | 별도 API key 기반 검색 API | `tavily`, `brave`, `jina`, `kagi`, `parallel`, `synthetic`, `exa` |
| Answer engine | 검색+요약/응답형 provider | `perplexity`, `kimi`, `zai` |
| Keyless fallback | 설정 없이 terminal fallback | `duckduckgo` |
| Self-hosted/custom | 사용자가 endpoint를 제공 | `searxng` |

## Provider support

| provider id | human alias | support type | credentials | default role |
|---|---|---|---|---|
| `auto` | active/native | resolver mode | active provider creds if available | recommended default |
| `codex` | chatgpt/openai | native web_search via ChatGPT/Codex backend | OpenAI Codex OAuth (`/login openai-codex`) | preferred Exa replacement |
| `anthropic` | claude | native Claude web_search | Anthropic OAuth/API key | active-native for Claude |
| `gemini` | google | Google Search grounding | google-gemini-cli or antigravity OAuth/API | active-native for Gemini |
| `duckduckgo` | ddg | keyless search | none | terminal fallback |
| `perplexity` | pplx | answer/search engine | Perplexity cookie/API key | optional explicit |
| `kimi` | moonshot | answer/search engine | Moonshot search/API key | optional explicit |
| `zai` | glm/zai | remote MCP search | Z.AI auth/config | optional explicit |
| `tavily` | tavily | keyed API search | `TAVILY_API_KEY` | optional explicit |
| `brave` | brave | keyed API search | `BRAVE_API_KEY` | optional explicit |
| `jina` | jina | keyed API/search reader | `JINA_API_KEY` | optional explicit |
| `kagi` | kagi | keyed API search | `KAGI_API_KEY` | optional explicit |
| `parallel` | parallel | keyed API search | `PARALLEL_API_KEY` | optional explicit |
| `synthetic` | synthetic | keyed API search | `SYNTHETIC_API_KEY` | optional explicit |
| `searxng` | searx | self-hosted metasearch | endpoint setting/env | optional explicit |
| `exa` | exa | keyed neural search | `EXA_API_KEY` | explicit only; not recommended default |

## Availability notes from code

| provider id | cheap availability check |
|---|---|
| `codex` | `authStorage.hasOAuth("openai-codex")` |
| `anthropic` | `ANTHROPIC_SEARCH_API_KEY` or `authStorage.hasAuth("anthropic")` |
| `gemini` | OAuth for `google-gemini-cli` or `google-antigravity` |
| `duckduckgo` | always available |
| `exa` | `EXA_API_KEY` and Exa settings not disabled |
| `tavily`, `kagi`, `parallel`, `synthetic`, `zai` | stored auth or provider-specific env API key |
| `searxng` | endpoint setting/env |
| `brave`, `jina` | provider-specific env API key |

## Swappable scope

### Safe to swap via `/SEARCHENGINE`

- `providers.webSearch` preference.
- runtime `setPreferredSearchProvider()` value.
- alias normalization.

### Not safe to hide behind `/SEARCHENGINE`

- Provider credentials/login.
- Provider-specific model selection (`PI_CODEX_WEB_SEARCH_MODEL` etc.).
- Result rendering semantics.
- `web_search` tool schema.

## Recommended defaults

1. `auto` for most sessions.
2. `chatgpt`/`codex` when Exa is bad and ChatGPT OAuth is available.
3. `duckduckgo` when no credentials should be used.
4. Explicit keyed APIs only when user asks for that provider.

## Failure behavior

- If chosen provider is unavailable, existing resolver skips it and falls back to DuckDuckGo when possible.
- If chosen provider is available but runtime call fails, `executeSearch()` already records provider failure and tries the next provider in the chain.
- Error output should name failed providers and not silently claim native search was used.
