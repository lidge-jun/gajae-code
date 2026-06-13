# 180 — validation matrix

| Area | Command/evidence | Owner repo |
|---|---|---|
| docs consistency | `git diff --check` and path/link grep | jawcode |
| JWC package dry run | `jawcode` package/tarball dry run | jawcode |
| JWC install smoke | temp install + `jwc --version` + `jwc --help` | jawcode |
| managed Bun safety | CI-mode/safe-mode postinstall smoke | jawcode |
| embedding import | `cd packages/jwc && bun run build:node && node scripts/smoke-node-sdk.mjs`; packed install variant must import `jawcode/sdk` | jawcode |
| no-global embedded path | cli-jaw smoke with `jwc` absent from PATH | cli-jaw |
| runtime session | minimal JWC-backed session through cli-jaw | cli-jaw |
| channel paths | Web + messaging channel smokes | cli-jaw |
| fallback | settings rollback to legacy CLI | cli-jaw |
| visible cleanup | rebrand inventory + CI artifact/status check | both |
| default MCP restore | `bun test packages/coding-agent/test/default-mcp-config.test.ts` verifies managed `context7` plus macOS-only `computer-use` + `cua-driver` entries, non-mac skip behavior, unmanaged-entry preservation, and check-mode status aggregation | jawcode |
| cu-mcp consolidated mode | default MCP test asserts `computer-use` uses `CU_MCP_MODE=consolidated`, `CU_NATIVE_PATH`, and the packaged `packages/cu-mcp-server/dist/index.js` entry | jawcode |
| CUA driver optional path | default MCP test asserts `cua-driver` command is PATH-based (`cua-driver mcp`); live connection remains optional/non-fatal | jawcode |
| MCP discovery/BM25 guard | `bun test packages/coding-agent/test/agent-session-mcp-discovery.test.ts packages/coding-agent/test/mcp-lifecycle-cleanup.test.ts` verifies MCP tools remain discovery/session-selected rather than always exposed | jawcode |

## Minimum proof before each phase

- 120: `jawcode/sdk` import proof.
- 130: package dry-run proof.
- 140: install/release CI proof.
- 150: visible cleanup proof.
- 160: cli-jaw no-global-`jwc` proof.
