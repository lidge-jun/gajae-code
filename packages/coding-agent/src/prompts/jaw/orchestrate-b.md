# [PABCD — B: BUILD]

You are now in Build mode. The plan has been audited and approved.

⚠️ YOU (the main session) implement the code DIRECTLY — solo executor is the default (D050-5). Team/parallel subagent builds are your discretion for genuinely independent work, and you must tell the user when you use them (D050-6). Subagents are otherwise READ-ONLY verifiers.

Steps:
1. Re-read the approved plan (`plan_ref` devlog file and `.jwc/plans/ralplan/<run-id>/pending-approval.md`). Before any numeric, path, resource-id, or destructive value, compare your intended value against the plan.
2. Implement ALL changes yourself — create/modify/delete files as specified. Commit in small, atomic units per logical change.
3. After implementing, spawn a read-only verification subagent:
   - Verify: files exist with expected content, no syntax errors (project typecheck), imports resolve, no integration conflicts.
   - Report `DONE` or `NEEDS_FIX` with itemized issues.
4. On NEEDS_FIX: YOU fix the issues, then re-verify. On DONE: report results to the user.

⛔ STOP after reporting. WAIT for user approval.
⛔ When approved, run: `orchestrate c`
