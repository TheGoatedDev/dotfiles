# Role

OpenCode is the only programming agent.

Default to:
- implementation, debugging, tests, refactors
- backend and observability work
- GitHub PR and CI workflows
- repo-wide codebase analysis

# Skills

Load the matching skill when the task fits. Skills live under `~/.agents/skills` (linked into OpenCode).
Source of truth for what should be installed: Dotfiles `manifest.yaml` `skills.packages` + `skills/custom/*`. Keep this list matched when those change.

## Process

- `caveman` — terse compressed communication (also always-on via `opencode-caveman` plugin; `/caveman lite|full|ultra|off`)
- `grill-with-docs` — design interview while writing ADRs/glossary
- `tropes-fyi` — human prose; avoid AI-writing tells
- `ponytail` — laziest solution that works (plugin `@dietrichgebert/ponytail`; `/ponytail lite|full|ultra`)

## Browser

- `agent-browser` — browser automation (pages, forms, screenshots)

# CLI tools

Prefer these over reinventing. Do not reach for tools not listed here unless the user asks.

| CLI | Use |
|-----|-----|
| `opencode` | this agent |
| `ctx7` | library docs: `ctx7 library <name> "q"` then `ctx7 docs <id> "q"` |
| `agent-browser` | browser automation (`skills get core --full` first use in session) |
| `gh` | GitHub PRs, issues, checks, releases |
| `git` | version control |
| `wrangler` | Cloudflare Workers / bindings / deploy |
| `pulumi` | infrastructure as code |
| `docker` | containers |
| `bun` / `pnpm` / `npm` / `node` | JS tooling (prefer project package manager) |
| `go` | Go toolchain |
| `uv` / `uvx` / `pipx` | Python tools |
| `rtk` | terminal helper when available |
| `ffmpeg` | media convert/probe |
| `act` | run GitHub Actions locally |
| `stow` | only when changing Dotfiles layout |

# Web

- **Search** → Exa MCP tools only. Built-in `websearch` is disabled.
- **Fetch a URL** → built-in `webfetch`.
- Do not set `OPENCODE_ENABLE_EXA` (that re-enables built-in search).

# MCP

Also available as MCP tools (not CLI): **exa** (web search — prefer this), **posthog**.

# Commits

When a feature or unit of work is complete and coherent on its own, make an atomic commit immediately — one logical change per commit. Do not batch unrelated finished units. Do not wait to be asked.

# Engineering

- Preserve the existing setup unless a targeted change is needed.
- Prefer root-cause diagnosis over workaround-first fixes.
- Make narrow edits.
- Follow existing project conventions.
- Use the project's package manager.
- Never expose secrets, API keys, or credentials.
- Never commit `.env` or credential files.
- Run focused verification after changes when available.

# Browser

Use `agent-browser` for browser automation. Run `agent-browser skills get core --full` before first use in a session.

1. `agent-browser open <url>`
2. `agent-browser snapshot -i`
3. click/fill via refs like `@e1`
4. re-snapshot after page changes

# Machine setup

Dotfiles: `~/Projects/Personal/Dotfiles`. Apply with `./install`. Do not hand-edit stowed targets under `$HOME` — edit the package in the repo.

<!-- context7 -->
Use the `ctx7` CLI to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Resolve library: `ctx7 library <name> "<what to look up>"` — official names with proper punctuation (e.g. "Next.js" not "nextjs")
2. Pick best match (ID `/org/project`) by name, description, snippet count, reputation, benchmark score
3. Fetch docs: `ctx7 docs <libraryId> "<what to look up>"` — one concept per call unless topics interact
4. Answer from fetched docs

Call `library` first unless the user gives `/org/project`. Max 3 ctx7 commands per question. No secrets in queries. Version pins: `/org/project/version` when listed.

If quota errors: tell the user to `ctx7 login` or set `CONTEXT7_API_KEY`. Do not silently fall back to training data.
<!-- context7 -->
