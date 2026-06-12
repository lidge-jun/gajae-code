# Prompt flow — gjc_origin

1. Load `prompts/system/*.md` modules
2. Merge role prompts from `prompts/agents/`
3. `buildSystemPrompt()` / session hook
4. deep-interview injects language.instruction
5. AGENTS.md directory context via sdk
