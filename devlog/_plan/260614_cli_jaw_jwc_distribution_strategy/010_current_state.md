# 010 — current state

## Legacy relocation

Moved under this folder:

- `_legacy/260612_jawcode_fork`
- `_legacy/260613_github_deploy`
- `_legacy/260613_packaging`
- `_legacy/260614_deploy_fork_packaging_bridge`

The legacy files remain useful for evidence, but they should not be treated as the current execution map when they disagree with this folder.

## Current progress

| Area | State | Evidence |
|---|---|---|
| jwc fork/rebrand | roughly through 110 | legacy fork docs contain 100/110 Node/import surface planning and 150 promotion preparation |
| resident runtime concept | already established | `_legacy/260612_jawcode_fork/phase1/03_roadmap_phases.md` defines cli-jaw in-process `JawRuntime` |
| cli-jaw import surface | already named | `README.jwc.md` defines `jwc/sdk` as the single embedding surface |
| packaging | not deploy-ready | `_legacy/260612_jawcode_fork/phase1/063.1_plan_package_scope_migration.md` notes `packages/jwc` still depends on workspace `@gajae-code/coding-agent` |
| GitHub deploy | blocked by packaging/identity | `_legacy/260614_deploy_fork_packaging_bridge/README.md` classified postinstall and package target as shared blockers |
| gjc flip | partially deferred | `_legacy/260612_jawcode_fork/150.1_parity_gap_matrix.md` lists visible bins, CI artifacts/statuses, coordinator MCP names |

## Reclassification before 120

120 must not mean "start coding against old assumptions." It means:

1. freeze the embedding contract cli-jaw will consume;
2. decide how cli-jaw gets that code without global `jwc`;
3. keep standalone jwc deploy independent;
4. postpone broad namespace churn until visible contracts are stable.
