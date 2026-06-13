# 150 — legacy identity cleanup slice

## Goal

Clean the user-visible contracts that would otherwise make a Jawcode/JWC release look like the upstream identity it forked from.

## Required before public release/default promotion

| Item | Action |
|---|---|
| docs/examples | Jawcode/JWC-first wording |
| package bin | `jwc` primary |
| package name | `jawcode` |
| package imports | `jawcode/sdk` |
| CI artifact names | JWC/Jawcode names, with compatibility aliases only if branch protection requires them |
| CI status names | branch-protection-safe rename/compatibility status |
| coordinator MCP visible names | migration or compatibility aliases |

## Deferred

| Item | Reason |
|---|---|
| `@gajae-code/*` internal scope | high churn, not user-visible if package is bundled |
| legacy env removal | compatibility risk |
| legacy state removal | migration risk |
| source internal constants | not required for product release |

## Acceptance criteria

- new public docs teach `npm install -g jawcode` and `jwc`;
- release artifacts are JWC/Jawcode named or have documented compatibility aliases;
- strict inventory either passes or records intentional internal compatibility exceptions;
- branch protection is updated or compatibility-status transition is active.
