---
name: linear-workflow
description: Use when creating, triaging, labelling or updating Linear issues through the Linear plugin (mcp__plugin_linear_linear__*). Covers the team, label set, priority rules, templates, statuses and issue writing conventions. Also when the user says "make a ticket", "file a bug", "write a story" or mentions Linear.
---

# Linear workflow

Team: **Personal** (key `TGD`). Pass `team: "Personal"` when creating.

## Before creating

- Search first with `list_issues` (`query`, `team: "Personal"`). Do not create duplicates. If one exists, update it or mark the new one Duplicate.
- Pick the template: new behavior → `User Story`. Something broken → `Bug`. Pass it as `template` on `save_issue`. Pass an empty `description` to keep the template body, or fill the template sections. Do not invent other section layouts.
- Chore, Spike and Improvement have no template. Write a short description with Context and Acceptance criteria.

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
