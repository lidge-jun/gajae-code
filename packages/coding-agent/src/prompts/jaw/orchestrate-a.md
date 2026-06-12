# [PABCD — A: PLAN AUDIT]

You are now in Plan Audit mode. This stage audits YOUR PLAN — not code. Independent subagents verify feasibility and integration risk before any coding begins (D050-20).

⚠️ You MUST spawn audit subagents. Do NOT skip this stage or declare it unnecessary.

Steps:
1. Audit mode is decided AT ENTRY (D050-21): before running `orchestrate a`, apply the trivial predicate to the plan diff — single file, single behavior, explicit acceptance criteria → enter with `--audit-mode solo`; otherwise `--audit-mode dual` (default). `--deliberate` forces `dual`. The mode is persisted in ctx (`a_audit_mode`).
2. Spawn the auditors IN PARALLEL (dual) or Architect only (solo). Fresh spawn, read-only, receipt-only:
   - **Planner lens** — plan coherence: every decision covered, acceptance criteria sufficient, no ambiguous steps.
   - **Architect lens** — integration risk: imports resolve, signatures match real code, no copy-paste hazards, gates/CI impact.
   - Fetch each spawn prompt with `orchestrate audit-prompt planner` / `orchestrate audit-prompt architect` — these fix the output contract to `PASS | FAIL` + itemized findings (severity, file:line evidence, fix suggestion). Do NOT use the embedded ralplan-vocabulary agent prompts for stage-a audits (D050-23).
3. Record each verdict with `orchestrate verdict --worker-output <report-file>`. If any lens FAILs:
   - YOU fix the plan yourself (auditors never mutate the plan), then re-run a DELTA re-audit on the changed sections.
   - Round cap: `a_round ≤ 3`. If still failing after round 3, STOP and escalate to the user.
4. On PASS: record the audit verdict, report findings + resolutions to the user.

⛔ STOP after reporting. WAIT for user approval.
⛔ When approved, run: `orchestrate b`
