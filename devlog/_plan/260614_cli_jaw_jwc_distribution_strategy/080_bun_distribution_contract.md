# 080 — Bun distribution contract

## Decision

Standalone JWC must not require the user to install Bun manually before `jwc` can run.

Target UX:

```sh
npm install -g jawcode
jwc --version
jwc --help
```

## Current code facts

| Fact | Evidence |
|---|---|
| package currently requires Bun | `packages/jwc/package.json` has `engines.bun >=1.3.14` |
| current user bin is already `jwc` | `packages/jwc/package.json` `bin.jwc = bin/jwc.js` |
| current package is not publish-ready | `packages/jwc/package.json` `name = jwc`, `files = ["bin","dist"]`, `exports` point at `src/*.ts` |
| Node-compatible SDK bundle exists as a target | `packages/jwc/scripts/build-node.ts` writes `dist-node/sdk.js` |

## Distribution model

| Runtime path | Bun requirement | Package behavior |
|---|---|---|
| standalone TUI/CLI | needs Bun-compatible runtime | package provisions managed Bun or bundles a platform runtime |
| cli-jaw embedding | should be Node-compatible | cli-jaw imports `jawcode/sdk` from distributable `dist-node` |
| local dev | may use system Bun | `file:`/link dependency can use repo-local build scripts |

## P0 managed Bun strategy

1. Add a safe postinstall path that resolves a pinned Bun version.
2. In CI/safe mode, do not mutate the machine; instead assert that the package can skip provisioning cleanly.
3. On local install, install or reuse a package-managed Bun runtime under a deterministic cache directory.
4. `bin/jwc.js` resolves runtime in this order:
   - package-managed Bun;
   - system Bun if compatible;
   - clear remediation error.
5. The `jawcode` package must include all scripts needed by postinstall in `files`.

## File-level implementation plan

| File | Change |
|---|---|
| `packages/jwc/package.json` | rename package to `jawcode`; keep `bin.jwc`; include `dist-node` and `scripts` in `files`; add `postinstall` guard |
| `packages/jwc/bin/jwc.js` | replace Bun shebang assumption with Node launcher that resolves package-managed Bun, compatible system Bun, then errors clearly |
| `packages/jwc/scripts/postinstall-guard.cjs` | CommonJS entry used by npm; exits cleanly in CI/safe mode; calls provisioning script otherwise |
| `packages/jwc/scripts/provision-bun.cjs` | download/reuse pinned Bun runtime under deterministic cache; non-fatal optional setup errors |
| `packages/jwc/scripts/verify-managed-bun.cjs` | local/CI smoke that proves resolver behavior without invoking network in safe mode |

## Environment contract

| Env | Meaning |
|---|---|
| `CI=true` | never download or prompt; verify skip path only |
| `JWC_SAFE=1` | same safe-mode behavior for local/package tests |
| `JWC_BUN_PATH=/abs/path/to/bun` | explicit override for development and CI fixtures |
| `JWC_SKIP_BUN_INSTALL=1` | skip provisioning and require system/override runtime |

Pinned version source: start from `packages/jwc/package.json` `engines.bun` (`>=1.3.14`). Implementation may pin an exact version in package metadata, but it must not drift from the documented minimum without updating this file.

## Verification

- `npm pack --dry-run` includes `bin`, `dist`, `dist-node`, and provisioning scripts.
- temp global install smoke can run `jwc --version` without preinstalled Bun.
- CI safe-mode install does not download or prompt.
- cli-jaw package dependency smoke imports `jawcode/sdk` under Node.
