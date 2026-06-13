# 040 — packaging matrix

## Candidate package channels

| Channel | Shape | Pros | Risks | Current decision |
|---|---|---|---|---|
| standalone npm package | package installs `jwc` bin | ordinary user path | unscoped `jwc` may be occupied; workspace deps must be removed/bundled | decide before CI publish |
| scoped npm package + `jwc` bin | e.g. scoped package, binary remains `jwc` | avoids unscoped name conflict | docs/update target rewrite | preferred if unscoped ownership is unavailable |
| GitHub release tarball | prebuilt binary/archive | no npm namespace dependency | update/install scripts needed | useful release artifact |
| cli-jaw vendored artifact | cli-jaw includes built JWC runtime | satisfies no-global-jwc invariant | version sync and bundle size | required for embedded path |
| cli-jaw package dependency | cli-jaw depends on published JWC package | simpler versioning | fails if package install is not reliable | only after standalone package is proven |

## Bundle policy

The first reliable embedded path should be boring and inspectable:

1. Build JWC runtime artifact in jawcode CI.
2. Consume that artifact in cli-jaw by version or vendored copy.
3. Smoke-test cli-jaw with no `jwc` in `PATH`.

Do not make cli-jaw depend on a globally installed `jwc`.

## Standalone package blocker

Legacy packaging analysis found the key blocker:

- `packages/jwc` currently imports/depends on workspace packages such as `@gajae-code/coding-agent`.
- npm users cannot install unpublished workspace dependencies.

Therefore the standalone slice must choose one:

| Option | Meaning | Use when |
|---|---|---|
| bundled standalone | package includes built coding-agent/runtime JS | fastest reliable install |
| publish workspace deps | publish required `@gajae-code/*` packages | only if scope ownership and naming are intentional |
| source checkout installer | installer clones repo/builds locally | not acceptable as primary user install |

Preferred P0: bundled standalone, then revisit workspace dependency publishing later.
