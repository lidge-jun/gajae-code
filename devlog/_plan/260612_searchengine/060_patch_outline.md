# 060 Patch outline — `/SEARCHENGINE` MVP

> 상태: 구현 전 설계 ✅
> 목적: 실제 패치 시 손댈 파일과 순서를 고정한다.

## Files to change

1. `packages/coding-agent/src/slash-commands/builtin-registry.ts`
   - add imports:
     - `setPreferredSearchProvider` from `../web/search/provider`
     - `isSearchProviderPreference`, `type SearchProviderId` from `../web/search/types`
   - add `normalizeSearchEngineArg()` helper
   - add `searchengine` builtin command; case-insensitive builtin lookup is optional polish, not MVP
   - **spec MUST declare `allowArgs: true`** — without it the TUI dispatcher gate
     (`:1382`) refuses the args form and `/searchengine chatgpt` silently falls
     through to LLM chat ([cmd_audit P1](../../_fin/260613_cmd_audit/00_audit_slash_command_logic.md)
     — the exact `/model` bug repaired in `492913de`). Regression test must
     assert `command.allowArgs === true` like model-onboarding-guidance does.
2. `packages/coding-agent/test/slash-commands/searchengine-slash.test.ts` or existing slash surface test
   - command status
   - lowercase command dispatch
   - alias canonicalization
   - invalid arg no mutation

## Optional case-insensitive builtin lookup

Not required for MVP. If desired later, implement at builtin lookup boundary only:

```ts
const command = BUILTIN_SLASH_COMMAND_LOOKUP.get(parsed.name) ?? BUILTIN_SLASH_COMMAND_LOOKUP.get(parsed.name.toLowerCase());
```

Do not lowercase in `parseSlashCommand()`; that function is shared parsing, not builtin policy.

## Slash helper sketch

```ts
function normalizeSearchEngineArg(raw: string): SearchProviderId | "auto" | undefined {
  const value = raw.trim().toLowerCase();
  if (!value || value === "status") return undefined;
  if (["active", "native", "default"].includes(value)) return "auto";
  if (["chatgpt", "openai", "codex"].includes(value)) return "codex";
  if (["claude", "anthropic"].includes(value)) return "anthropic";
  if (["google", "gemini"].includes(value)) return "gemini";
  if (["ddg", "duck", "duckduckgo"].includes(value)) return "duckduckgo";
  return isSearchProviderPreference(value) ? value : undefined;
}
```

## Command behavior sketch

```ts
const current = runtime.settings.get("providers.webSearch");
const raw = command.args.trim();
if (!raw || raw.toLowerCase() === "status") {
  await runtime.output(formatSearchEngineStatus(current, runtime.session.model?.provider));
  return commandConsumed();
}
const next = normalizeSearchEngineArg(raw);
if (!next) return usage(searchEngineUsage(`Unknown search engine: ${raw}`), runtime);
runtime.settings.set("providers.webSearch", next);
setPreferredSearchProvider(next);
await runtime.notifyConfigChanged?.();
await runtime.output(`Search engine set to ${next}. Fallback remains DuckDuckGo.`);
return commandConsumed();
```

## Test harness note

The existing slash tests often mock `InteractiveModeContext`; this command is easier to test through `lookupBuiltinSlashCommand("searchengine")` or the adapted TUI dispatcher with a runtime containing:

- `settings.get` / `settings.set` spies
- `session.model.provider`
- `output` spy
- `notifyConfigChanged` spy

For dispatch coverage, use `executeBuiltinSlashCommand("/searchengine chatgpt", runtime)` and assert the editor clears / status output occurs.

## Non-MVP

- No `/searchengine off` until product decides whether disabling the `web_search` tool means tool deactivation, provider null, or per-turn refusal.
- No credential probing on status by default.
- No Exa removal.
- No `web_search` parameter schema changes.
