# 190 — risks and stop conditions

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| unscoped `jwc` package unavailable | npm publish blocked | scoped package with `jwc` bin |
| JWC package depends on unpublished workspace deps | user install fails | bundle standalone or publish deps intentionally |
| cli-jaw shells out to global `jwc` | violates product goal | no-global-jwc smoke |
| TUI-only Bun paths leak into cli-jaw server | Node import failure | split embedding artifact from TUI CLI |
| CI status rename breaks branch protection | blocked merges | dual status transition |
| full namespace rename before stability | huge churn | defer internal scope flip |

## Stop conditions

Stop implementation and re-plan if any are true:

- package target cannot be legally/operationally used;
- embedded artifact pulls in unsupported runtime-only dependencies;
- no-global-jwc smoke cannot be made deterministic;
- cli-jaw session ownership conflicts with JWC state ownership;
- branch protection cannot be updated and dual CI status is not feasible.
