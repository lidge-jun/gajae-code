# 060 — CI and release tracks

## Track 1: jawcode CI

Purpose: prove the source repo can build, test, package, and release standalone JWC artifacts.

Required gates:

- workspace install with frozen lockfile
- repo checks using approved Bun commands
- `jwc --version` and `jwc --help`
- `jawcode` package/tarball dry run
- managed Bun safe-mode test
- `jawcode/sdk` Node import smoke
- release artifact naming JWC/Jawcode-first

## Track 2: cli-jaw CI

Purpose: prove cli-jaw can run JWC-backed functionality without a global `jwc`.

Required gates:

- install cli-jaw in an environment without `jwc` in `PATH`
- install or link dependency `jawcode`
- start cli-jaw server
- create a JWC-backed session through cli-jaw
- execute a minimal tool call or dry runtime handshake
- verify rollback/fallback still works for one release

## Track 3: integration bridge

Purpose: pin the package contract between repos.

Required gates:

- jawcode publishes or exposes package `jawcode`
- cli-jaw records the consumed `jawcode` version or local file/link target
- compatibility smoke runs against the exact package artifact
- release notes say which `jawcode` package version is embedded/consumed

## Branch protection warning

Renaming CI jobs/statuses to JWC/Jawcode names must be coordinated with GitHub branch protection. If branch protection requires old names, use one release of compatibility aliases before removal.
