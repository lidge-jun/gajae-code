# 180 — validation matrix

| Area | Command/evidence | Owner repo |
|---|---|---|
| docs consistency | `git diff --check` and path/link grep | jawcode |
| JWC package dry run | package/tarball dry run | jawcode |
| JWC install smoke | temp install + `jwc --version` + `jwc --help` | jawcode |
| postinstall safety | CI-mode/safe-mode postinstall smoke | jawcode |
| embedding import | Node-compatible `jwc/sdk` smoke | jawcode |
| no-global embedded path | cli-jaw smoke with `jwc` absent from PATH | cli-jaw |
| runtime session | minimal JWC-backed session through cli-jaw | cli-jaw |
| channel paths | Web + messaging channel smokes | cli-jaw |
| fallback | settings rollback to legacy CLI | cli-jaw |
| visible flip | rebrand inventory + CI artifact/status check | both |

## Minimum proof before each phase

- 120: embedding import proof.
- 130: package dry-run proof.
- 140: install/release CI proof.
- 150: visible flip proof.
- 160: cli-jaw no-global-jwc proof.
