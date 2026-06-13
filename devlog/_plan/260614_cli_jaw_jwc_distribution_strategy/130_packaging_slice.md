# 130 — packaging slice

## Goal

Make standalone JWC installable from a package or release artifact without relying on unpublished workspace packages.

## Preferred P0 path

Use a bundled standalone package:

- package exposes bin `jwc`;
- package includes built runtime output;
- package `files` includes required bin/dist/scripts;
- postinstall is safe, idempotent, and non-fatal for optional integrations;
- CI mode skips interactive or machine-mutating setup.

## Required tests

- package dry run includes expected files;
- install smoke in temporary directory;
- `jwc --version`;
- `jwc --help`;
- postinstall safe mode;
- no unresolved `@gajae-code/*` dependency in the published package unless that package is intentionally published too.

## Do not do yet

- do not publish to npm until package name is settled;
- do not rename all workspace scopes;
- do not make standalone packaging the only path cli-jaw can consume.
