# Skills

Load the matching skill when the task fits. Skills live under `~/.agents/skills` (linked into OpenCode).
Source of truth for what should be installed: Dotfiles `manifest.yaml` `skills.packages` + `skills/custom/*`. Keep this list matched when those change.

## Process

- `caveman` — terse compressed communication (also always-on via `opencode-caveman` plugin; `/caveman lite|full|ultra|off`)
- `grill-me` — relentless design interview until decisions lock
- `grilling` — stress-test a plan/decision/idea (mattpocock grill triggers)
- `grill-with-docs` — design interview while writing ADRs/glossary
- `tropes-fyi` — human prose; avoid AI-writing tells
- `ponytail` — laziest solution that works (plugin `@dietrichgebert/ponytail`; `/ponytail lite|full|ultra`)

## Docs / discovery

- `find-docs` — current library/API docs (prefer over training data)
- `find-skills` — discover skills on skills.sh when a capability is missing

## Browser

- `agent-browser` — browser automation (pages, forms, screenshots)

# Policy

- Atomic commits when a unit of work is done; do not wait to be asked.
- Narrow edits; follow project conventions; never commit secrets or `.env`.
- Web search → Exa MCP only (built-in `websearch` off). Fetch URLs → built-in `webfetch`.
- Dotfiles repo is source of truth for stowed config; apply with `./install`. Do not hand-edit stowed `$HOME` targets.
