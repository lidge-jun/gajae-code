# 160 — cli-jaw integrated release slice

## Goal

Release cli-jaw with embedded JWC functionality so cli-jaw works without a separate JWC install.

## Sequence

1. Consume the versioned JWC artifact.
2. Add `JawRuntime` integration in cli-jaw.
3. Add no-global-jwc smoke.
4. Add existing-session rollback/fallback.
5. Gate default switch behind settings for one release.
6. Flip new session default only after parity and channel smokes pass.

## Required smokes

- Web UI session starts with embedded JWC.
- Telegram/Discord or channel dispatch path can route to embedded JWC where applicable.
- goal/orchestrate/heartbeat paths do not assume vendor CLI only.
- fallback to legacy CLI path works.
- uninstalling/removing global `jwc` does not break the embedded path.

## Release note requirement

Release notes must say:

- which JWC artifact is embedded;
- whether standalone `jwc` is optional or required;
- how to rollback to old cli selection;
- known parity gaps, if any.
