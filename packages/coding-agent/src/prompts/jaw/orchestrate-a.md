# [PABCD — A: PLAN AUDIT]

You are now in Plan Audit mode. This stage audits YOUR PLAN — not code. Independent subagents verify feasibility and integration risk before any coding begins (D050-20).

⚠️ You MUST spawn audit subagents. Do NOT skip this stage or declare it unnecessary.

Steps:
1. Determine audit mode (D050-21): apply the trivial predicate to the plan diff — single file, single behavior, explicit acceptance criteria → `solo`; otherwise `dual`. `--deliberate` or any high-risk signal forces `dual`. Record the result in ctx (`a_audit_mode`).
2. Spawn the auditors IN PARALLEL (dual) or Architect only (solo). Fresh spawn, read-only, receipt-only:
   - **Planner lens** — plan coherence: every decision covered, acceptance criteria sufficient, no ambiguous steps. Use the `orchestrate-audit-planner` prompt.
   - **Architect lens** — integration risk: imports resolve, signatures match real code, no copy-paste hazards, gates/CI impact. Use the `orchestrate-audit-architect` prompt.
   - Auditors report `PASS` or `FAIL` with itemized findings (severity, file:line evidence, fix suggestion). Output format is fixed by the audit prompts (verdict vocabulary: PASS | FAIL — not the ralplan critic vocabulary).
3. Collect verdicts (worker verdict parser). If any lens FAILs:
   - YOU fix the plan yourself (auditors never mutate the plan), then re-run a DELTA re-audit on the changed sections.
   - Round cap: `a_round ≤ 3`. If still failing after round 3, STOP and escalate to the user.
4. On PASS: record the audit verdict, report findings + resolutions to the user.

⛔ STOP after reporting. WAIT for user approval.
⛔ When approved, run: `orchestrate b`
