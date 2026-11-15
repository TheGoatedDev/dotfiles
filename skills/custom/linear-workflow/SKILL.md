---
name: linear-workflow
description: Use when creating, triaging, labelling or updating Linear issues through the Linear plugin (mcp__plugin_linear_linear__*). Covers the team, label set, priority rules, templates, statuses and issue writing conventions. Also when the user says "make a ticket", "file a bug", "write a story" or mentions Linear.
---

# Linear workflow

Team: **Personal** (key `TGD`). Pass `team: "Personal"` when creating.

## Before creating

1. Search first with `list_issues` (`query`, `team: "Personal"`). Do not create duplicates. If one exists, update it or mark the new one Duplicate.
2. Grill. Load the `grilling` skill and interview the user in rounds. Look up facts (code, existing issues, docs) yourself.
   - Feature, Bug, Improvement: up to 3 rounds. Continue past 3 only if the user says "keep going".
   - Chore, Spike: 1 round.
   - Skip when the user says "quick ticket" or "no grill".
   - Anything still unresolved goes in Open questions.
3. Check the slice (see "Vertical slices"). Propose a split if needed.
4. Show the full draft, or the split plan, to the user. Create nothing until they confirm.
5. Create with the template for the type (see "Templates").

Every decision from the grill goes in the Decisions section with its reason and rejected options. Do not post the Q&A transcript as a comment.

## Templates

Source of truth: `templates/*.md` next to this file. The Linear workspace templates are copies the user pastes in. When they differ, follow the repo file and tell the user.

| Type label | Linear template | File |
|------------|-----------------|------|
| `Feature` | `User Story` | `templates/user-story.md` |
| `Bug` | `Bug` | `templates/bug.md` |
| `Improvement` | `Improvement` | `templates/improvement.md` |
| `Chore` | `Chore` | `templates/chore.md` |
| `Spike` | `Spike` | `templates/spike.md` |

- Pass the template name as `template` on `save_issue` and fill every section. If the Linear template does not exist yet, use the repo file as the description and set the label with `addLabels`.
- Keep section order and headings. Do not invent other layouts.
- Write "None." in Open questions rather than deleting it. Drop another section only when it is truly empty.

## Vertical slices

- Every Feature, Improvement and Bug must be a vertical slice: a working change through every layer it touches (UI, API, data), demoable and shippable alone.
- Never write layer-only tickets ("add DB column", "build endpoint").
- Chores and Spikes are exempt. When one unblocks a slice, link it with a `blocks` relation. Pure maintenance needs no link.
- Propose a split when there are more than about 6 acceptance criteria, or when parts could ship on their own. Never split without the user's OK.
- Split shape: a parent issue keeps the story, Context and shared Decisions; each slice is a sub-issue (`parentId`) with its own template body. Use a project only when the work spans several parent issues or several weeks.

## Expanding an existing issue

When asked to expand an issue (e.g. "expand TGD-12"): read it with `get_issue` and `list_comments`, grill on the gaps against its type's template, show the draft, then update with `patch`. Keep facts already in the body.

## Labels

Exactly one label from the single-select **Type** group on every issue:

| Label | Use for |
|-------|---------|
| `Feature` | New capability |
| `Bug` | Broken behavior |
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
