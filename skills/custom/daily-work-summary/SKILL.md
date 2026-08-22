---
name: daily-work-summary
description: Build a manager-ready daily work summary from GitHub commits and PRs for an organization, then ask the user why each work item was done before writing the final conversational update. Use when the user asks for a daily summary, manager update, standup update, or work summary based on GitHub activity.
---

# Daily Work Summary

Use this skill to turn a user's GitHub activity into a conversational manager update with user-provided reasons.

## Workflow

1. Identify organization and date from the request.
   - Organization is required.
   - Date defaults to today if not provided.
   - Accept natural date wording such as `today`, `yesterday`, or `YYYY-MM-DD`.

2. Collect evidence with the local binary.
   - Run:
     ```zsh
     gh-summary <org> [date] --no-ai
     ```
   - If the command is missing, tell the user `gh-summary` is not installed and stop.
   - If GitHub auth fails, report the `gh` error and stop.

3. Group evidence into work items.
   - Group overlapping commits and PRs as one item.
   - Group by repo and rough theme.
   - Do not include merge commits as separate work items when the PR already covers the same work.
   - Keep exact repo names.
   - Avoid low-level identifiers in user-facing questions unless needed for clarity.

4. Ask the user for reasons in one message.
   - Ask for a reason for each grouped item.
   - Short phrases are acceptable.
   - Example:
     ```txt
     I found these work items:

     1. Monorepo-Propfirm: OpenTelemetry preload and trace sampling changes
     2. forex-platform: uptime service CPU/resource tuning
     3. Hetzner-Kubernetes: Signoz update and ClickHouse storage increase

     What was the reason for each?
     ```

5. Write final manager-ready summary.
   - Output only the final summary text.
   - No greeting or starter sentence.
   - Conversational, professional, Slack-ready tone.
   - Mention repo names when useful.
   - Include the user's reasons where supplied.
   - If a reason is missing, describe only what changed; do not infer intent.
   - Do not mention exact versions, PR numbers, commit hashes, branch names, or URLs.
   - Do not include evidence, analysis, headings, or bullets unless the user asks.

## Summary Style

Use first-person phrasing:

```txt
I worked on the Monorepo-Propfirm OpenTelemetry setup to reduce telemetry noise and make the service preload behavior more consistent. I also tuned the forex-platform uptime service resources so the service has more appropriate CPU allocation.
```

Keep it concise. Prefer one short paragraph; use two if there are several unrelated work areas.
