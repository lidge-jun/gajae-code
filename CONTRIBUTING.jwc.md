# Contributing to Jawcode (jwc)

> **upstream gajae-code** 기여는 [Yeachan-Heo/gajae-code](https://github.com/Yeachan-Heo/gajae-code) 정책을 따른다.
> 본 문서는 **jawcode 포크**(jwc M1 · cli-jaw M2)용 최소 안내다. beta v0.1: [structure/status.md](structure/status.md).

## Before you change code

1. Read [AGENTS.md](AGENTS.md) — coding-agent 계약과 jwc 기준 문서 정본 가이드.
2. Read [structure/conventions.md](structure/conventions.md) — rebase, `.jwc/`, cite, struct_har 갱신.
3. Primary product surface: `packages/coding-agent/`. Public bin: `packages/jwc` → `jwc`.

## Workflow surface (fork)

- Bundled skills: `jaw-interview`, `ralplan`, `ultragoal`, `team` only — do not add default workflow skills without product decision ([AGENTS.md](AGENTS.md)).
- Native orchestration: `jwc orchestrate` (050 band). Planning/execution gates: `jaw-interview` / `ralplan` until explicit user approval.

## Verification (typical)

```sh
bun install
bun run install:defaults
# after workflow-definition or rebrand surface changes:
bun scripts/check-visible-definitions.ts
bun scripts/verify-g002-gates.ts
bun scripts/rebrand-inventory.ts --strict
bun test packages/coding-agent/test/default-gjc-definitions.test.ts
```

Use `bun check` / package tests for focused changes — do not run raw `tsc` ([AGENTS.md](AGENTS.md)).

## Documentation

- Patched SoT: [structure/](structure/README.md) · map: [structure/INDEX.md](structure/INDEX.md).
- Fork diff snapshots: [struct_har/](struct_har/README.md). Gaps: [struct_har/chase/](struct_har/chase/README.md).
- 99 band work: [devlog/_plan/260612_jawcode_fork/99.00.00_moc_stabilization.md](devlog/_plan/260612_jawcode_fork/99.00.00_moc_stabilization.md).

When you change HARD-EDIT/NEW fork files, update [structure/fork-delta.md](structure/fork-delta.md) in the same change set.

### Jawdev documentation model

`jawdev` is the Jawcode development-documentation discipline for keeping product truth, fork comparison, and implementation history separate:

- `structure/` is the maintained source of truth for current architecture, contracts, conventions, readiness, and navigation.
- `struct_har/` is the comparison + harness layer: regenerated `gjc_origin` ↔ `jwc_patched` snapshots, OMP reference facts, chase gap indexes, and the scripts under `struct_har/_scripts/` that refresh those facts.
- `devlog/` is written in the Jawdev logic style: plan folders under `devlog/_plan/`, MOC/phase numbering, concrete file-level plans, decisions, evidence, and historical implementation context. It is not the canonical current-state map; promote stable rules back into `structure/` or `AGENTS.md`.

## Commits & upstream

- Do **not** commit unless explicitly asked.
- Upstream mirror: `devlog/_upstream_gjc/` (gitignored). Rebase: [structure/gitstructure.md](structure/gitstructure.md).

## Questions

Use GitHub issues or project Discord linked from [README.md](README.md) for upstream gajae-code; for jwc-specific scope, cite `structure/` + devlog MOC in the issue body.