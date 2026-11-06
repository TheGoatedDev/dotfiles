# Skills

Load the matching skill when the task fits. Skills live under `~/.agents/skills` (linked into `~/.claude/skills`).
Source of truth for what should be installed: Dotfiles `manifest.yaml` `skills.packages` + `skills/custom/*` + `CLAUDE_PLUGINS` in `install` (plugin skills are namespaced `plugin:skill`). Keep this list matched when those change.

## Process

- `caveman` — terse compressed communication (Claude plugin `caveman@caveman`, always-on; `/caveman lite|full|ultra`, `stop caveman`)
- `grilling` — stress-test a plan/decision/idea (mattpocock grill triggers)
- `grill-with-docs` — design interview while writing ADRs/glossary
- `domain-modeling` — sharpen domain model; CONTEXT.md + ADRs
- `writing-whip` — kill AI writing tropes/behaviours at generation; replies, docs, outbound copy (tropes.fyi/whip)
- `ponytail` — laziest solution that works (Claude plugin `ponytail@ponytail`, always-on; `/ponytail lite|full|ultra|off`)

## Secrets

- `proton-pass` — Proton Pass via `pass-cli` (`run`/`inject`/`pass://`; never dump secrets)

## Docs / discovery

- `find-docs` — current library/API docs (prefer over training data)
- `find-skills` — discover skills on skills.sh when a capability is missing

## Design

- `impeccable` — design craft (Claude plugin `impeccable@impeccable`; `/impeccable polish|audit|critique|…`); PRODUCT.md/DESIGN.md
- `web-design-guidelines` — audit UI vs Vercel Web Interface Guidelines

## Platforms

- `posthog:*` — PostHog analytics, flags, experiments, errors (Claude plugin `posthog@claude-plugins-official`; bundles PostHog MCP)

## Accessibility

- `wcag-audit` — WCAG 2.2 AA page/HTML audit + contrast numbers (static; published eval)
- `a11y-planner` — design accessibility before coding
- `a11y-critic` — review a11y plan or implementation
- `a11y-test` — Playwright keyboard + axe-core loop
- `perspective-audit` — deep review when planner/critic escalate perspectives

# Policy

- Confirmed bug → failing test that reproduces it, then the fix. No fix without that test.
- Atomic commits when a unit of work is done; do not wait to be asked.
- Narrow edits; follow project conventions; never commit secrets or `.env`.
- Unknown local files/symbols → built-in `Explore` agent. Skip if path already known.
- Dotfiles repo is source of truth for stowed config; apply with `./install`. Do not hand-edit stowed `$HOME` targets.

# References

- Personal Obsidian vault at `~/Obsidian`. Use when looking up personal notes or knowledge not in the current project.
