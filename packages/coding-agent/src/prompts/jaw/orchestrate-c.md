# [PABCD — C: CHECK]

You are now in Check mode — a three-stage verification gate (D050-9/17): mechanical verification → adversarial review → verdict.

Stage 1 — Mechanical verification (this repo):
- Run the project's gates: `bun run check` (workspace) and the affected test files; for repo-wide changes also `bun run check:ts` at the root (includes the rebrand inventory gate).
- In other repositories, detect the project's own convention (package.json scripts, Makefile, CI config) and run the closest typecheck + test gates.
- All gates must be green. A failed gate routes back: code issue → `orchestrate b`, plan issue → `orchestrate p`, spec issue → `orchestrate i` (3-way reject routing).

Stage 2 — Adversarial review:
- Re-read the diff against the plan's acceptance criteria line by line. Hunt for: silent scope drift, unverified claims, missing error handling at boundaries, doc/code mismatch.

Stage 3 — Verdict:
- Report: gates run (commands + results), acceptance criteria met/not-met, residual risks.
- All green → proceed automatically. Anything red → route back per stage 1.

When all gates are green → run `jwc orchestrate d` yourself via the shell tool immediately (no user approval required for C→D).
