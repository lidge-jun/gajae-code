# 200 — execution order

## Recommended order

1. **Doc closeout**
   - point root docs at this consolidated plan;
   - keep `_legacy/` as historical source.
2. **120 embedding contract**
   - freeze `jawcode/sdk`;
   - build/import smoke for non-TUI runtime.
3. **130 standalone package**
   - package `jawcode`, bin `jwc`;
   - managed Bun provisioning;
   - postinstall guard;
   - tarball/install smoke.
4. **140 independent deploy**
   - package publish readiness for `jawcode`;
   - CI dry run/install smoke;
   - release artifact path.
5. **150 visible cleanup**
   - docs/bin/artifacts/statuses/MCP names;
   - macOS-only Computer Use/CUA MCP defaults;
   - compatibility aliases where required.
6. **160 cli-jaw integration**
   - consume package dependency `jawcode`;
   - resident runtime service;
   - no-global-`jwc` smoke;
   - fallback and staged default switch.

## Why this order

Embedding first proves cli-jaw can own the product goal. Packaging second proves standalone JWC is real. Deployment and cleanup come after those facts, so release docs do not advertise a path that cannot be installed or embedded.

## First implementation PR stack

1. jawcode: `jawcode/sdk` embedding facade smoke.
2. jawcode: `jawcode` package dry run with `jwc` bin and managed Bun.
3. jawcode: postinstall safe-mode.
4. cli-jaw: consume package dependency behind explicit setting.
5. cli-jaw: no-global-`jwc` smoke.
6. jawcode: macOS-only Computer Use/CUA default restore and package validation.
7. both: visible JWC/Jawcode artifact/status transition.

## Active folder hygiene

The active range for this strategy is `000` through `220`. `211` is intentionally active because MCP/Computer Use/CUA packaging is part of the 150 release surface. Follow-up feature plans that are not part of distribution strategy belong in a separate plan folder or under `_legacy/` once implemented, so this folder remains a blocker-free release map.
