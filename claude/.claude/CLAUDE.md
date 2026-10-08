@~/.config/opencode/AGENTS.md

# Claude Code mapping

The skill index and policy above are shared with OpenCode. Read them with these substitutions:

- Task `explore` → built-in `Explore` agent.
- Task `scout` → `scout` agent (`~/.claude/agents/scout.md`).
- `websearch` / `webfetch` rules cover `WebSearch` and `WebFetch`: primary delegates them to `scout`.
- `ponytail` comes from the `ponytail@ponytail` Claude plugin (always-on; `/ponytail lite|full|ultra|off`). `caveman` comes from the `caveman@caveman` Claude plugin (always-on; `/caveman lite|full|ultra`, `stop caveman`).
