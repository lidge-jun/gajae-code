# 020_prompt — 프롬프팅 / jaw 아이덴티티 (gjc_origin)

시스템 프롬프트는 `packages/coding-agent/src/prompts/` 모듈형 `.md` 조립. `createAgentSession({ systemPrompt })`로 문자열 배열 또는 함수형 오버레이 가능.

- 기본 아이덴티티: gjc / Gajae-Code 어휘
- `deep-interview` SKILL에 `language.instruction` 사용자 언어 추종 패턴
- `prompts/agents/` — planner/architect/critic/executor 등 역할 프롬프트
