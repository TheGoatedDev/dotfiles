@~/.config/opencode/AGENTS.md

# Claude Code mapping

The skill index and policy above are shared with OpenCode. Read them with these substitutions:

- Task `explore` → built-in `Explore` agent.
- Task `scout` → `scout` agent (`~/.claude/agents/scout.md`).
- Exa / webfetch / `websearch` rules also cover `WebSearch`, `WebFetch` and `mcp__exa__*`: primary delegates them to `scout`.
- `ponytail` is an OpenCode plugin; not available here. `caveman` comes from the `caveman@caveman` Claude plugin (always-on; `/caveman lite|full|ultra`, `stop caveman`).
