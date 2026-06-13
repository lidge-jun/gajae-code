# 050 — gjc flip timing

## Principle

Do not block 120/130 on a full internal rename. Flip user-visible contracts first, preserve internal upstream-compatible names until packaging and embedding are stable.

## Two-sided flip map

| Surface | Flip before embedded cli-jaw? | Flip before standalone deploy? | Notes |
|---|---:|---:|---|
| `jwc` user bin | yes | yes | already the product name |
| docs/examples | yes | yes | no new user-facing `gjc` examples |
| CI visible status/artifact names | before public release | before public release | may use dual `gjc`+`jwc` artifacts for one transition |
| coordinator MCP names | before default cli-jaw promotion if user-visible | not necessarily | migration plan needed |
| `GJC_*` env support | no | no | keep compat, add `JWC_*` mirrors where absent |
| `.gjc` legacy discovery | no | no | migration/compat path |
| `@gajae-code/*` package scope | no | no | keep until standalone install strategy is stable |
| source internal constants | no | no | only change when tests and upstream sync burden justify it |

## Recommended timing

1. **Before 120**: document flip boundary and add tests that public docs/examples stay jwc-first.
2. **During 130/140**: ensure standalone package exposes `jwc`, not `gjc`.
3. **During 150**: rename CI artifact/status names and coordinator MCP names, or ship a dual-name transition.
4. **After 160**: consider internal package scope rename only if upstream sync cost is no longer important.
