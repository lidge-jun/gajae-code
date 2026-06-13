# 060 — CI and release tracks

## Track 1: jawcode CI

Purpose: prove the source repo can build, test, package, and release standalone JWC artifacts.

Required gates:

- workspace install with frozen lockfile
- repo checks using approved Bun commands
- `jwc --version` and `jwc --help`
- package/tarball dry run
- embedded-runtime artifact build
- postinstall safe-mode test
- release artifact naming jwc-first

## Track 2: cli-jaw CI

Purpose: prove cli-jaw can run JWC-backed functionality without a global `jwc`.

Required gates:

- install cli-jaw in an environment without `jwc` in `PATH`
- start cli-jaw server
- create a JWC-backed session through cli-jaw
- execute a minimal tool call or dry runtime handshake
- verify rollback/fallback still works for one release

## Track 3: integration bridge

Purpose: pin the artifact contract between repos.

Required gates:

- jawcode publishes or exposes a versioned artifact
- cli-jaw records the consumed version
- compatibility smoke runs against the exact artifact
- release notes say whether embedded JWC is bundled, vendored, or package-resolved

## Branch protection warning

Renaming CI jobs/statuses from `gjc-*` to `jwc-*` must be coordinated with GitHub branch protection. If branch protection requires old names, use one release of dual statuses before removal.
