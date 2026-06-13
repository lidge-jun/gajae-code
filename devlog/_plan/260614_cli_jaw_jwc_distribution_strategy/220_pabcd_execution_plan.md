# 220 — repeated PABCD execution plan through 150

## Goal

Implement the distribution strategy through the 150 visible-cleanup slice using
small, independently verifiable PABCD cycles.

## Cycle 0 — clean current MCP/CUA restore work

### Intent

Finish and commit the existing dirty MCP/CUA restore changes before package
surface work starts.

### Files

| Action | Path |
|---|---|
| MODIFY | `packages/coding-agent/src/defaults/jwc-defaults.ts` |
| MODIFY | `packages/coding-agent/src/cli/setup-cli.ts` |
| MODIFY | `packages/coding-agent/test/default-mcp-config.test.ts` |
| MODIFY | `structure/21_extensibility.md` |
| MODIFY | `devlog/_plan/260614_cli_jaw_jwc_distribution_strategy/180_validation_matrix.md` |
| MODIFY | `devlog/_plan/260614_cli_jaw_jwc_distribution_strategy/211_computer_use_mcp_default_restore_plan.md` |

### Required corrections

- Keep `211` active and indexed.
- Make Computer Use/CUA managed defaults macOS-only.
- Keep Context7 as cross-platform managed default.
- Preserve unmanaged MCP entries on every platform.
- Treat any unrelated `_cli-jaw-entry.ts` dirty state as a separate blocker:
  do not stage or fix it inside the MCP/CUA restore commit.

### Verification

```bash
bun test packages/coding-agent/test/default-mcp-config.test.ts packages/coding-agent/test/agent-session-mcp-discovery.test.ts packages/coding-agent/test/mcp-lifecycle-cleanup.test.ts packages/coding-agent/test/acp-builtins.test.ts
git diff --check
```

Full package typecheck is expected to remain blocked until the separate
`_cli-jaw-entry.ts` barrel/export cleanup is handled.

## Cycle 1 — 120 embedding foundation

### Intent

Make `jawcode/sdk` a package-facing embedding contract that can be loaded by
Node without pulling in TUI-only Bun runtime paths.

### Files

| Action | Path |
|---|---|
| MODIFY | `packages/jwc/src/sdk.ts` |
| MODIFY | `packages/jwc/src/index.ts` |
| MODIFY | `packages/jwc/scripts/build-node.ts` |
| MODIFY | `packages/jwc/scripts/smoke-node-sdk.mjs` |
| NEW/MODIFY | `packages/jwc/scripts/smoke-packed-sdk.mjs` |
| MODIFY | `devlog/_plan/260614_cli_jaw_jwc_distribution_strategy/120_embedding_slice.md` |

### Verification

```bash
bun --cwd=packages/jwc run build:node
node packages/jwc/scripts/smoke-node-sdk.mjs
```

## Cycle 2 — 130 package surface and Bun dependency launcher

### Intent

Make the standalone package installable as `jawcode` with command `jwc`, using
an npm-managed Bun runtime dependency rather than requiring the user to install
Bun manually.

### Files

| Action | Path |
|---|---|
| MODIFY | `packages/jwc/package.json` |
| MODIFY | `packages/jwc/bin/jwc.js` |
| NEW | `packages/jwc/scripts/resolve-bun-runtime.cjs` |
| NEW | `packages/jwc/scripts/verify-runtime.cjs` |
| MODIFY | `packages/jwc/scripts/build-node.ts` |
| MODIFY | `devlog/_plan/260614_cli_jaw_jwc_distribution_strategy/080_bun_distribution_contract.md` |
| MODIFY | `devlog/_plan/260614_cli_jaw_jwc_distribution_strategy/130_packaging_slice.md` |

### Package contract

- package name: `jawcode`
- user bin: `jwc`
- package dependency: `bun@1.3.14`
- package files include `bin`, `dist`, `dist-node`, `scripts`
- exports point at distributable artifacts, not source TypeScript
- launcher resolves package-local Bun first, compatible system Bun second, then
  fails with a clear remediation message.

### Verification

```bash
bun --cwd=packages/jwc run bundle
bun --cwd=packages/jwc run build:node
cd packages/jwc && npm pack --dry-run
```

## Cycle 3 — 140 public push and CI tracking

### Intent

Push each completed slice publicly and track CI failures immediately.

### Verification

```bash
git push fork agent
gh run list --limit 5
gh run watch <run-id> --exit-status
```

Do not publish to npm in this cycle.

## Cycle 4 — 150 visible cleanup

### Intent

Remove or compatibility-alias visible legacy identity on public/current release
surfaces, including CI names, docs, issue templates, package metadata, and MCP
visible defaults.

### Files

| Action | Path |
|---|---|
| MODIFY | `.github/workflows/ci.yml` |
| MODIFY | `.github/workflows/dev-ci.yml` |
| MODIFY | `.github/ISSUE_TEMPLATE/*.yml` |
| MODIFY | `README.md` |
| MODIFY | `README.jwc.md` |
| MODIFY | `structure/*.md` as required |
| MODIFY | `scripts/rebrand-inventory.ts` if inventory rules need updates |

### Verification

```bash
bun scripts/rebrand-inventory.ts --strict
bun scripts/check-visible-definitions.ts
bun scripts/verify-g002-gates.ts
git diff --check
```

## Stop point

Stop after 150 passes locally, has been pushed, and the relevant CI run is
tracked to completion or a concrete failure is documented for the next cycle.
160 cli-jaw integration remains the next goal.
