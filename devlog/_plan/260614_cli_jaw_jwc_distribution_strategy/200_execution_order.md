# 200 — execution order

## Recommended order

1. **Doc closeout**
   - point root docs at this consolidated plan;
   - keep `_legacy/` as historical source.
2. **120 embedding contract**
   - freeze `jwc/sdk` or successor;
   - build/import smoke for non-TUI runtime.
3. **130 standalone package**
   - bundled package;
   - postinstall guard;
   - tarball/install smoke.
4. **140 independent deploy**
   - package name decision;
   - CI dry run/install smoke;
   - release artifact path.
5. **150 visible flip**
   - docs/bin/artifacts/statuses/MCP names;
   - compatibility aliases where required.
6. **160 cli-jaw integration**
   - consume JWC artifact;
   - resident runtime service;
   - no-global-jwc smoke;
   - fallback and staged default switch.

## Why this order

Embedding first proves cli-jaw can own the product goal. Packaging second proves standalone JWC is real. Deployment and flip come after those facts, so release docs do not advertise a path that cannot be installed or embedded.

## First implementation PR stack

1. jawcode: embedding facade smoke.
2. jawcode: bundled standalone package dry run.
3. jawcode: postinstall safe-mode.
4. cli-jaw: consume artifact behind explicit setting.
5. cli-jaw: no-global-jwc smoke.
6. both: visible jwc artifact/status transition.
