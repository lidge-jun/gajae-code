# jwc dogfood local skill template

Issue #93 requested a gaebal-gajae/operator dogfood skill. The live issue has no comment approving a fifth bundled default workflow skill, so this stays a local template instead of changing the default workflow surface. Operators can copy it into a user or project override when they want jwc-first session guidance:

```sh
mkdir -p ~/.jwc/skills/gjc-dogfood
cp docs/gjc-dogfood-skill-template.md ~/.jwc/skills/gjc-dogfood/SKILL.md
```

For a single project, copy it to `<project>/.jwc/skills/gjc-dogfood/SKILL.md` instead. Do not commit that project `.jwc` copy unless the project explicitly wants a local override.

---
name: gjc-dogfood
description: Use when running or reviewing work through jwc sessions, dogfooding Gajae-Code, or migrating an operator workflow from OMX to jwc.
---

# jwc Dogfood Operator Workflow

Use jwc first for coding, review, planning, and follow-up sessions. Treat OMX as a fallback only when jwc is unavailable, broken, or missing a required capability.

## Locate and launch jwc

- Installed CLI: run `command -v jwc` and then launch with `jwc --tmux`.
- Repository checkout: from the gajae-code repo, prefer `bun packages/coding-agent/src/cli.ts --tmux` when testing source changes before install.
- Worktree isolation: for branch-specific work, launch from or point at the branch worktree with `jwc --tmux --worktree <path>`.
- Name sessions explicitly with the project and issue, for example `gajae-code-93-dogfood-skill`, so tmux panes, logs, and exports remain traceable.

## Start the session

- Put git operations inside the jwc session: fetch, branch/worktree setup, focused commits, pushes, and PR creation should be visible in-session.
- Submit the initial prompt with the issue URL, target branch, acceptance criteria, verification limits, and any existing plan/spec link.
- Verify the prompt was accepted: the TUI should show the user prompt, an active assistant turn, or a tool/action request. If the session silently idles, resend once with a shorter prompt and capture the failure.
- Verify working state before leaving the session unattended: confirm the target cwd/worktree, branch, and issue scope are visible in the transcript or command output.

## During work

- Keep session names and branch names issue-scoped.
- Prefer jwc workflow skills only when they fit: `deep-interview` for unclear requirements, `ralplan` for planning, `ultragoal` for durable ledgers, and `team` for coordinated tmux execution.
- Keep evidence in the session: issue reads, focused tests/checks, screenshots only when visual behavior matters, and PR URLs.
- When jwc is weaker than OMX, finish the urgent work with the smallest safe fallback and file a gajae-code follow-up issue with the missing capability, exact command/session context, expected behavior, and evidence.

## Fallback policy

Use OMX or another operator path only when:

- `jwc` cannot be located or launched after checking installed and repo-local commands;
- authentication, model routing, tmux, or prompt submission is broken;
- jwc lacks a required capability that OMX already has;
- an urgent production/review deadline would be missed by debugging jwc first.

Record the fallback reason and create or link the gajae-code issue that would make jwc sufficient next time.

## Evidence checklist

Report:

- project, issue, branch/worktree, and session name;
- whether jwc was installed or repo-local;
- prompt acceptance and working-state evidence;
- git operations performed in-session;
- focused verification commands and results;
- PR/issue URLs;
- follow-up gajae-code issues for any jwc gap or fallback.
