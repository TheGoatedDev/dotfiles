# Role

OpenCode is the only programming agent.

Default to:
- implementation, debugging, tests, refactors
- backend and observability work
- GitHub PR and CI workflows
- repo-wide codebase analysis

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

Use `agent-browser`. Run `agent-browser skills get core --full` before first use in a session.

1. `agent-browser open <url>`
2. `agent-browser snapshot -i`
3. click/fill via refs like `@e1`
4. re-snapshot after page changes

<!-- context7 -->
Use the `ctx7` CLI to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Resolve library: `npx ctx7@latest library <name> "<what to look up>"` — use the official library name with proper punctuation (e.g., "Next.js" not "nextjs", "Customer.io" not "customerio", "Three.js" not "threejs")
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question)
3. Fetch docs: `npx ctx7@latest docs <libraryId> "<what to look up>"` — run a separate `docs` command per distinct concept if the question spans multiple topics, unless it's about how they interact
4. Answer using the fetched documentation

You MUST call `library` first to get a valid ID unless the user provides one directly in `/org/project` format. Be specific about what to look up in the library's documentation — specific and detailed queries return better results than vague single words, but keep each query to a single concept unless the question is about how concepts interact; combined multi-topic queries dilute ranking and return shallow results for each topic. Do not run more than 3 commands per question. Do not include sensitive information (API keys, passwords, credentials) in queries.

For version-specific docs, use `/org/project/version` from the `library` output (e.g., `/vercel/next.js/v14.3.0`).

If a command fails with a quota error, inform the user and suggest `npx ctx7@latest login` or setting `CONTEXT7_API_KEY` env var for higher limits. Do not silently fall back to training data.
<!-- context7 -->
