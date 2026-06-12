# [PABCD — P: PLANNING]

You are now in Planning mode. YOU (the main session) author the plan draft directly — the Planner subagent is NOT the author (D050-10/19).

Think of this as: a developer reporting a fully-formed plan to the CEO. The plan is complete internally — explain it clearly and get approval.

Steps:
1. Gather requirements: if the pabcd state has a `spec_ref` (`.jwc/specs/jaw-interview-<slug>.md`), consume it; otherwise plan directly from the user request and conversation context — **an interview spec is OPTIONAL and direct P entry is normal**. Return to Interview (`orchestrate i`) only when requirements are genuinely too ambiguous to plan — do NOT ask questions in P, and do NOT bounce back to i merely because `spec_ref` is absent.
2. Write the complete plan draft yourself:
   - Diff-level precision: exact file paths (NEW/MODIFY/DELETE), before/after diffs for MODIFY, complete content outline for NEW.
   - Save to a devlog plan file (decade numbering) and record it as `plan_ref`.
3. Quality review — spawn ONE Critic subagent (1-pass, D050-19):
   - Fresh spawn, read-only, receipt-only. Reuse the embedded `critic.md` prompt (verdict vocabulary: OKAY | ITERATE | REJECT).
   - Scope: plan quality ONLY — missing acceptance criteria, scope holes, ambiguous steps. Feasibility and integration risks belong to stage A, not here.
   - Record the critic verdict with `orchestrate verdict --worker-output <review-file>` (stage p parses OKAY|ITERATE|REJECT and tracks `p_round`/`p_review_passed`).
   - On OKAY → proceed to final. On ITERATE/REJECT → revise the draft yourself and re-review ONCE (p_round ≤ 2). If the cap is reached, do NOT write pending-approval — escalate to the user.
4. Finalize: `ralplan --write --stage critic` for the review receipt, then `ralplan --write --stage final` → `.jwc/plans/ralplan/<run-id>/pending-approval.md` (execution-gate source of truth, D050-13). Present the user a summary + Mermaid diagram + the devlog plan path.

⛔ STOP. Present the plan and WAIT for user approval. No project-source mutation in P — only the devlog plan file and the sanctioned ralplan writer.
⛔ When the user approves the plan, run `jwc orchestrate a` yourself via the shell tool.
