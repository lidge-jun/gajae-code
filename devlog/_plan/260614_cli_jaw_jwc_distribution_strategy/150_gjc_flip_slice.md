# 150 — gjc flip slice

## Goal

Flip the user-visible contracts that would otherwise make a jwc release look like gjc.

## Required before public release/default promotion

| Item | Action |
|---|---|
| docs/examples | jwc-first wording |
| package bin | `jwc` primary |
| CI artifact names | `jwc-*` or dual `gjc-*` + `jwc-*` transition |
| CI status names | branch-protection-safe rename/dual status |
| coordinator MCP visible names | migration or compatibility aliases |

## Deferred

| Item | Reason |
|---|---|
| `@gajae-code/*` internal scope | high churn, not user-visible if package is bundled |
| `GJC_*` env removal | compatibility risk |
| `.gjc` state removal | migration risk |
| source internal constants | not required for product release |

## Acceptance criteria

- new public docs do not teach `gjc` as the primary product command;
- release artifacts are not only `gjc-*`;
- strict inventory either passes or records intentional compatibility exceptions;
- branch protection is updated or dual-status transition is active.
