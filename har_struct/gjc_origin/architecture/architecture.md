# Architecture — gjc_origin

```text
CLI (gjc)
  └── packages/coding-agent   # agent core, sdk, gjc-runtime
  └── packages/tui            # Bun TUI
  └── packages/ai             # providers (incl. cursor)
  └── packages/utils          # dirs, APP_NAME=gjc
  └── crates/*                # Rust extensions

State: .gjc/
Workflows: deep-interview, ralplan, ultragoal, team
Skills: embedded + ~/.gjc/agent/skills + .gjc/skills
```
