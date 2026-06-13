# 120 — embedding slice

## Goal

Produce the minimal package contract that lets cli-jaw load JWC functionality from dependency `jawcode` without a global `jwc` install.

## Implementation sequence

1. Freeze the public embedding facade as `jawcode/sdk`.
2. Build a Node-compatible runtime artifact for the non-TUI path.
3. Add an import smoke in jawcode that exercises session creation or a dry handshake.
4. Add a cli-jaw-side smoke that proves `jwc` is not in `PATH`.
5. Record the package version/link mode in cli-jaw integration docs.

## Acceptance criteria

- `jawcode/sdk` import is documented and test-covered.
- TUI-only Bun code is not pulled into cli-jaw server import path.
- cli-jaw can create or dry-run a JWC session without global `jwc`.
- rollback path is documented before default switch.

## Local proof command

```sh
cd packages/jwc
bun run build:node
node scripts/smoke-node-sdk.mjs
```

If the smoke script still imports `../dist-node/sdk.js` directly, the publish slice must add a packed-install variant that imports `jawcode/sdk`.

## Output

- package export contract doc;
- focused import smoke;
- cli-jaw integration task list;
- no public default flip yet.
