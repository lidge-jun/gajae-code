# 070 — decision register

## Decisions

| ID | Decision | Status |
|---|---|---|
| D-070-1 | cli-jaw and jawcode remain separate repos for now | accepted |
| D-070-2 | cli-jaw integrated mode must not require global `jwc` | accepted |
| D-070-3 | `jwc/sdk` or a successor embedding facade is the cli-jaw contract | accepted |
| D-070-4 | standalone jwc deploy and cli-jaw embedded deploy are separate tracks | accepted |
| D-070-5 | full internal `@gajae-code/*` rename is not a pre-120 blocker | accepted |
| D-070-6 | visible gjc contracts must be flipped or dual-published before public release/default promotion | accepted |

## Open decisions

| ID | Question | Needed before |
|---|---|---|
| Q-070-1 | exact npm package name if unscoped `jwc` cannot be owned | 140 publish |
| Q-070-2 | JWC artifact format consumed by cli-jaw: bundled JS, tarball, package dep, or vendored subtree | 120 implementation |
| Q-070-3 | CI artifact/status transition: hard rename vs dual-name bridge | 150 implementation |
| Q-070-4 | fallback vendor CLI retention window after cli-jaw defaults to JWC | 160 release |

## Default answers until changed

- Use bundled standalone for the first reliable package.
- Use a versioned JWC artifact for cli-jaw rather than global binary lookup.
- Use dual CI/status names for one transition if branch protection is unknown.
- Keep legacy env/path compatibility while exposing jwc-first docs and bin.
