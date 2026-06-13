# Web Search — 프로바이더 전환·OAuth/키 게이팅·통합 검색 (정본)

> `web_search` 도구가 어떤 프로바이더로 나가는지, 운영자가 `/searchengine`으로 어떻게
> 갈아끼우는지, 어떤 자격증명이 어떤 엔진을 푸는지의 정본. 구현 경위는 devlog
> [_fin/260612_searchengine](../devlog/_fin/260612_searchengine/00_moc_searchengine.md).

검색 표면은 세 층이다: ① **프로바이더 레이어**(엔진별 구현 + 해석 체인), ② **선택 표면**
(`providers.webSearch` 설정 + `/searchengine` 슬래시), ③ **가용성 게이팅**(OAuth/키 보유에
따른 활성화). 핵심 원칙: **검색 프로바이더는 활성 모델과 독립**이며, `auto`는 "지금 모델의
네이티브 검색"을 고르는 편의 기본값일 뿐이다.

---

## 1. 프로바이더 레이어

- 등록부: `getSearchProvider(id)`가 `PROVIDER_META`에서 lazy `import()`로 로드하고
  `instanceCache`에 캐싱한다 (`packages/coding-agent/src/web/search/provider.ts:119`).
- 해석 체인: `resolveProviderChain(authStorage, preferred, activeModelProvider)`
  (`provider.ts:206`) — ① 명시 선택 프로바이더가 가용하면 1순위, ② 아니면 활성 모델의
  네이티브 검색(그 프로바이더 `isAvailable`이 참일 때만), ③ **키리스 DuckDuckGo를 항상
  말단 폴백으로 추가**. keyed 단독 프로바이더는 auto에서 절대 자동 선택되지 않고 명시 선택
  전용이다.
- 도구 진입: `WebSearchTool` (`src/web/search/index.ts:229`), CLI는 `runSearchQuery`
  (`index.ts:211`). 자격증명은 오직 `AuthStorage`로만 해석(`getApiKey`/`getOAuthAccess`) —
  사이드 스토어 직접 오픈 금지(`providers/base.ts` 계약).
- 응답 형태: 모든 프로바이더가 `SearchResponse`(answer? + `SearchSource[]` + citations?)로
  정규화 (`src/web/search/types.ts`).

### 프로바이더 목록 (16종)

`SearchProviderId` 유니온 (`types.ts`): duckduckgo, exa, brave, jina, kimi, zai, anthropic,
perplexity, gemini, codex, tavily, parallel, kagi, synthetic, searxng, **xai**.
설정 enum은 `providers.webSearch` (`src/config/settings-schema.ts:2721`), 기본 `auto`.

---

## 2. 가용성 게이팅 — OAuth 해금 vs 키 전용

각 프로바이더 `isAvailable(authStorage)`가 진실의 원천. 모델 레이어의 OAuth 게이팅
(`#isModelAvailable` = `keyless || hasAuth(provider)`)과 **동일한 스토리지 키**를 검사하므로,
모델용 OAuth 로그인이 곧 그 프로바이더의 검색도 푼다.

### OAuth로 활성화 (6종)

| 검색 프로바이더 | 자격증명 | 로그인 |
|---|---|---|
| codex | `hasOAuth("openai-codex")` | OpenAI |
| anthropic | `hasAuth("anthropic")` (Claude OAuth 포함) + `ANTHROPIC_SEARCH_API_KEY` | Claude |
| gemini | `hasOAuth("google-gemini-cli"\|"google-antigravity")` | Google |
| perplexity | `hasAuth("perplexity")` (OAuth bearer) / `PERPLEXITY_COOKIES` / `PERPLEXITY_API_KEY` | Perplexity |
| kimi | `hasAuth("kimi-code")`(OAuth) / `MOONSHOT_SEARCH_API_KEY` / `KIMI_SEARCH_API_KEY` | Moonshot/Kimi |
| **xai** | `hasOAuth("xai")` / `hasAuth("xai")` / `XAI_API_KEY` | xAI (`grok login`) |

### 키/엔드포인트 전용 (OAuth 경로 없음)

zai(`ZAI_API_KEY`), tavily, brave, jina, exa(+`exa.enabled`), kagi(authStorage 전용),
parallel, synthetic, searxng(`SEARXNG_ENDPOINT`). 키 보유 시에만 활성.

> ⚠️ anthropic은 `isAvailable`이 `ANTHROPIC_SEARCH_API_KEY`만 검사하지만 `hasAuth("anthropic")`로
> Claude OAuth도 인정 — 즉 Claude 로그인만으로 별도 검색 키 없이 anthropic 검색이 열린다.

---

## 3. `auto` 모드 — 활성 모델 → 네이티브 검색

`MODEL_PROVIDER_TO_SEARCH` (`provider.ts:157`)가 활성 모델 provider를 그 네이티브 검색으로
매핑한다. **8개 계열**에서 동작:

| 모델 provider | → 검색 |
|---|---|
| openai / openai-codex / openai-responses | codex |
| anthropic | anthropic |
| google / google-gemini-cli / google-antigravity / gemini | gemini |
| moonshot / kimi-code / kimi | kimi |
| zai | zai |
| perplexity | perplexity |
| synthetic | synthetic |
| xai / grok | xai |

매핑에 없는 provider(deepseek·mistral·cerebras·ollama·lm-studio·커스텀 compat 등)는 네이티브
검색이 없으니 `auto`가 **DuckDuckGo로 폴백**한다. status 표시용 헬퍼는
`nativeSearchProviderFor(modelProvider)` (`provider.ts:190`).

이 8개는 **모델을 돌리는 자격증명 = 검색을 푸는 자격증명**이 동일하므로, 해당 모델을 쓸 수
있으면 `auto` 검색이 추가 설정 없이 같이 열린다.

---

## 4. `/searchengine` 슬래시 표면

- 스펙: `src/slash-commands/builtin-registry.ts:563` — `allowArgs: true`(필수, 없으면 TUI
  디스패처 게이트 `:1576`가 인자형을 LLM 채팅으로 흘림 = cmd_audit P1), 대문자 `SEARCHENGINE`
  명시 alias(룩업은 대소문자 구분).
- 인자 정규화 `normalizeSearchEngineArg` (`:220`): `chatgpt`/`openai`→codex, `claude`→anthropic,
  `google`→gemini, `grok`/`x`→xai, `ddg`/`duck`→duckduckgo, `active`/`native`/`default`→auto;
  나머지는 정식 id 직통.
- `status`(또는 무인자): 실제 `isAvailable` 프로브로 **Activated vs Needs-setup** 분리 표시,
  provider별 셋업 힌트 `SEARCH_ENGINE_SETUP_HINTS` (`:258`).
- 전환: `providers.webSearch` 설정에 SETTING_HOOK이 없어 **이중 기록 필수** —
  `settings.set` + `setPreferredSearchProvider(next)` (`provider.ts:180`) 둘 다 호출 후
  `notifyConfigChanged`. 키 없는 keyed 프로바이더를 골라도 persist하되 "not activated yet"
  경고(`:607`) — 검색은 그때까지 DuckDuckGo.
- 활성 모델과 독립: Claude 모델 + (OpenAI OAuth 보유 시) codex 검색처럼 섞어 쓸 수 있다.
  `auto`만이 모델-검색을 묶는 디폴트.

---

## 5. xAI Grok — 통합 웹 + X 검색

`src/web/search/providers/xai.ts`. xAI Responses API(`https://api.x.ai/v1/responses`,
`xai.ts:30`)에 **`web_search` + `x_search` 두 도구를 함께 탑재**(`XAI_SEARCH_TOOLS`,
`xai.ts:35`)해 일반 웹과 X 라이브 인덱스를 한 왕복에 통합 검색하고, Grok이 질의별로 소스를
고른다 — X 전용이 아니다.

- 라이브 탐침으로 확인한 유효 도구: `web_search`, `x_search`, `collections_search`,
  `file_search`, `code_exec`, `function` (`news_search`는 무효). 공개 웹 검색은 앞 둘이 전부.
- bearer는 `getOAuthAccess("xai")` → `getApiKey("xai")`/`XAI_API_KEY` 순. 답변 + `url_citation`
  주석을 `SearchSource[]`로 가상화. xAI가 citation title을 인덱스 번호로 주는 결함 → URL 폴백.
- 라이브 검증(grok OAuth): 웹+X 소스 혼합 왕복 확인. 포팅 원천: cli-jaw devlog 260530.

---

## 근거 파일

| 영역 | 위치 |
|---|---|
| 등록부·해석 체인·auto 매핑 | `packages/coding-agent/src/web/search/provider.ts:119,157,190,206` |
| 도구·CLI 진입 | `src/web/search/index.ts:146,211,229` |
| 타입·프로바이더 유니온 | `src/web/search/types.ts` |
| 설정 enum | `src/config/settings-schema.ts:2721` |
| `/searchengine` 스펙·게이팅·힌트 | `src/slash-commands/builtin-registry.ts:220,258,563,1576` |
| xAI 통합 검색 | `src/web/search/providers/xai.ts:30,35,161` |
| 프로바이더별 `isAvailable` | `src/web/search/providers/*.ts` |
