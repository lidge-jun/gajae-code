# Architecture — jwc_patched

```text
CLI (jwc + gjc coexist)
  └── packages/jwc              # wrapper bin + jwc/sdk re-export
  └── packages/coding-agent     # + jaw-interview, cli-jaw discovery, orchestrate WIP
  └── packages/tui              # brand-conditional jaw surface (partial)
  └── packages/ai               # cursor fixes + kiro WIP

State: .gjc/ (unchanged path)
Workflows: jaw-interview, ralplan, ultragoal, team
Skills: embedded + .agents/skills + ~/.cli-jaw/skills (+ fallback)
M1 goal: cli-jaw command vocabulary on gjc engine
M2 goal: embed in cli-jaw server (Node port)
```
