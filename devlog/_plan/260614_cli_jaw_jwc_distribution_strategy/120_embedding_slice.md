# 120 — embedding slice

## Goal

Produce the minimal artifact and contract that lets cli-jaw load JWC functionality without a global `jwc` install.

## Implementation sequence

1. Freeze the public embedding facade.
2. Build a Node-compatible runtime artifact for the non-TUI path.
3. Add an import smoke in jawcode that exercises session creation or a dry handshake.
4. Add a cli-jaw-side smoke that proves `jwc` is not in `PATH`.
5. Record the artifact version/hash in cli-jaw integration docs.

## Acceptance criteria

- `jwc/sdk` or successor import is documented and test-covered.
- TUI-only Bun code is not pulled into cli-jaw server import path.
- cli-jaw can create or dry-run a JWC session without global `jwc`.
- rollback path is documented before default switch.

## Output

- artifact contract doc;
- focused import smoke;
- cli-jaw integration task list;
- no public default flip yet.
