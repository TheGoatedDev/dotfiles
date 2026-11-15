---
name: linear-workflow
description: Use when creating, triaging, labelling or updating Linear issues through the Linear plugin (mcp__plugin_linear_linear__*). Covers the team, label set, priority rules, templates, statuses and issue writing conventions. Also when the user says "make a ticket", "file a bug", "write a story" or mentions Linear.
---

# Linear workflow

Team: **Personal** (key `TGD`). Pass `team: "Personal"` when creating.

## Before creating

- Search first with `list_issues` (`query`, `team: "Personal"`). Do not create duplicates. If one exists, update it or mark the new one Duplicate.
- Grill before writing. Load the `grilling` skill and interview the user in rounds until the design tree is empty: scope, behavior, edge cases, failure modes, dependencies, done-ness. Look up facts (code, existing issues, docs) yourself. Skip only when the user says "quick ticket" or "no grill".
- Pick the template: new behavior → `User Story`. Something broken → `Bug`. Pass it as `template` on `save_issue` and fill its sections, then append the sections from "Expanded body" below.
- Chore, Spike and Improvement have no template. Use the "Expanded body" sections alone.

## Labels

Exactly one label from the single-select **Type** group on every issue:

| Label | Use for |
|-------|---------|
| `Feature` | New capability (User Story template) |
| `Bug` | Broken behavior (Bug template) |
| `Improvement` | Change to existing behavior |
| `Chore` | Maintenance, refactor, cleanup, deps |
| `Spike` | Time-boxed research or investigation |

Plus `Security` (standalone) when the issue touches security, privacy or PII.

- Never create new labels. If one seems missing, ask the user.
- Use `addLabels`/`removeLabels`. `labels` replaces the full set.

## Fields

- **Priority**: built-in field only. Leave it empty (No priority) on create unless the user states one. It is set at triage.
- **Estimate**: never set. The team does not estimate. Do not suggest it.
- **Blocked**: use a `blockedBy` relation, not a label.
- **Decisions**: record in a comment.

## Statuses

Backlog → Todo → In Progress → In Review → Ready for Release → Done. Off-path: Canceled, Duplicate.

- New issues go to Backlog unless the user says otherwise.
- Move to In Progress when work starts, In Review when a PR is open.
- An archived issue cannot be modified. Ask before unarchiving.

## Expanded body

Every resolved branch of the grill goes in the ticket. Nothing the user decided stays only in chat. Add these sections after any template sections; drop one only when it is truly empty, and say "None" rather than omit Open questions.

- **Context**: the problem, who hits it, why now. Link related issues.
- **Goal**: one or two sentences on the outcome.
- **Scope** and **Out of scope**: explicit lists. Every "not now" from the grill goes in Out of scope.
- **Decisions**: each settled question, the choice, the reason, and the rejected options.
- **Behavior and edge cases**: inputs, states, empty/error/limit cases, what happens in each.
- **Risks and dependencies**: what could break, what this waits on. Real blockers also get a `blockedBy` relation.
- **Acceptance criteria**: checklist, one testable item per behavior and edge case above.
- **Open questions**: anything unresolved, or "None".

## Writing issues

- Title: short and descriptive, not "As a user, I want…". The story sentence goes in the body.
- Body: short sentences for a human reader. Same term for the same thing throughout.
- Acceptance criteria: plain checklist, not Given/When/Then.
- Put plans, file lists, commands and logs in the collapsible section at the end:

```
+++ Agent notes

Details for agents.

+++
```

- Bugs: quote the exact error. The fix starts with a failing test that reproduces the bug.
