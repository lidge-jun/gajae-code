# 140 — independent JWC deploy slice

## Goal

Register and validate independent JWC deploy/CI so jawcode can release on its own.

## Tasks

1. Decide package target:
   - unscoped `jwc` only if ownership is available;
   - otherwise scoped package with `jwc` bin.
2. Add package dry-run CI.
3. Add install smoke CI.
4. Add release artifact CI.
5. Document install/update path.
6. Keep release tag job responsible for heavyweight native matrix.

## Release readiness

Standalone JWC is release-ready only when:

- package target is not ambiguous;
- package does not require unpublished dependencies;
- tarball includes scripts/bin/dist;
- postinstall is safe under CI and local mode;
- visible artifacts use jwc naming or a documented dual-name transition.

## Relationship to cli-jaw

Independent deploy is useful but not sufficient for cli-jaw integration. cli-jaw still needs its own no-global-jwc embedded smoke.
