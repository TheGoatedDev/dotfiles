# Dotfiles — agent guide

Public, idempotent **macOS** setup repo. Edit files **here**, apply with `./install`, live config under `$HOME` is mostly **symlinks** (GNU Stow).

Human quickstart: [README.md](./README.md).  
OpenCode **skill index** (user-scope): [opencode/.config/opencode/AGENTS.md](./opencode/.config/opencode/AGENTS.md).

## Mental model

```
this repo  →  ./install  →  $HOME (stow links, brew, skills)
```

1. Change the source package in this repo.
2. Run `./install` (or `./install --force` / `--skills-only` as needed).
3. Do **not** hand-edit managed paths under `$HOME` — edits go to the wrong place or get overwritten.

**Secrets never go in git.** Only `*.example` templates are tracked.

## Layout

| Path | Role |
|------|------|
| `install` | Idempotent apply (zsh). Main entrypoint. |
| `manifest.yaml` | Stow packages + [skills.sh](https://skills.sh) package list (`skills.packages`). |
| `Brewfile` | Canonical Homebrew formulae/casks/vscode extensions to **ensure**. Does not uninstall extras on the machine. |
| `zsh/`, `git/`, `ghostty/`, `opencode/`, `tmux/`, `claude/` | Stow packages → `$HOME` (mirror home-relative paths). |
| `skills/custom/` | First-party skills; install symlinks into `~/.agents/skills/`. |
| `env.example` | Template → `~/.config/secrets/env` (chmod 600). |
| `gitconfig.local.example` | Template → `~/.gitconfig.local` (name/email/signing). |
| `zshenv.local.example` | Template → `~/.zshenv.local` (machine-only env). |

## Stow packages

| Package | Lands at (examples) |
|---------|---------------------|
| `zsh` | `~/.zshenv`, `~/.zshrc` |
| `git` | `~/.gitconfig`, `~/.config/git/ignore` |
| `ghostty` | `~/.config/ghostty/config` |
| `opencode` | `~/.config/opencode/*` (json, AGENTS.md, plugins, package.json). No stowed `.gitignore` — pnpm may write lockfiles/local ignores under that dir. |
| `tmux` | `~/.config/tmux/tmux.conf`. TPM plugins cloned by install into `~/.config/tmux/plugins/` (not stowed). |
| `claude` | `~/.claude/CLAUDE.md` (imports the OpenCode AGENTS.md + tool mapping), `~/.claude/agents/*`. `settings.json` is **not** stowed (Claude writes to it). |

Skills are not stowed as trees: install rebuilds `~/.config/opencode/skills/*` and `~/.claude/skills/*` → `~/.agents/skills/*` (Claude: links only; its own dirs like `synced/` are left alone).

## How to change things

| Goal | Do |
|------|----|
| Shell / PATH / aliases | Edit `zsh/.zshenv` or `zsh/.zshrc`, then `./install` or `stow -R zsh`. |
| tmux conf | Edit `tmux/.config/tmux/tmux.conf`, then `./install` or `stow -R tmux`. |
| Machine-only env (kube, SSH agent sock) | `~/.zshenv.local` (from example). Not in repo. |
| Git identity | `~/.gitconfig.local`. Tracked `.gitconfig` is scrubbed + `include`s local. |
| OpenCode config / plugins list | Edit `opencode/.config/opencode/opencode.json`. Pin plugins with `@pkg@version`. |
| OpenCode skill index | Edit `opencode/.config/opencode/AGENTS.md` (stowed → `$HOME/.config/opencode/AGENTS.md`). Skills list only — see below. Claude Code imports it via `~/.claude/CLAUDE.md`. |
| Claude Code instructions / subagents | `claude/.claude/CLAUDE.md` (tool mapping only), `claude/.claude/agents/*.md`. Keep subagents in step with `opencode.json` `agent`. |
| MCP servers | `opencode.json` `mcp` **and** `CLAUDE_MCP_SERVERS` in `install` (registered with `claude mcp add -s user`). |
| Local OpenCode plugin file | `opencode/.config/opencode/plugins/*.ts`, then `./install` (runs `pnpm install` in config dir). |
| Homebrew set | Edit `Brewfile` only. `brew bundle --no-upgrade` via install. Leaving something out of the Brewfile does **not** uninstall it. |
| External skill | Add under `skills.packages` in `manifest.yaml` (`source: [name, …]`), then `./install --skills-only`. |
| Custom skill | Add `skills/custom/<name>/SKILL.md`, `./install --skills-only`. |
| Secrets | Edit `~/.config/secrets/env` only. Update `env.example` keys (empty values) if you add a new var name. |

## `./install` contract

```bash
./install              # safe: refuse non-stow conflicts
./install --force      # backup conflicts → ~/.dotfiles-backup/<timestamp>/
./install --reinstall        # brew reinstall formulae only (no sudo)
./install --reinstall-casks  # casks only; skips docker-desktop (too privileged for reinstall)
# Docker: brew install --cask --force docker-desktop  (real Terminal, sudo)
./install --skills-only
./install --check      # dry / drift oriented
./install --strict     # fail if secrets file missing
```

Rough order (full install):

1. Ensure Homebrew; `brew bundle --file=Brewfile --no-upgrade`
2. Ensure `stow`; clone/update zsh plugins under `~/.zsh/plugins` and tmux plugins under `~/.config/tmux/plugins`
3. Stow each package in `manifest.yaml`
4. Warn/check secrets file
5. `pnpm install` in `~/.config/opencode` if `package.json` present
6. External skills from `manifest.yaml` `skills.packages` (OpenCode only; skip if already present)
7. Symlink `skills/custom/*` → `~/.agents/skills/`
8. Relink all of `~/.config/opencode/skills/` → `~/.agents/skills/`
9. Relink `~/.claude/skills/` → `~/.agents/skills/`; register Claude MCP servers + plugins; RTK Claude hook (`rtk init -g --hook-only`)

## Stack assumptions

- **Shell:** zsh; plugins via git clones (not full Oh My Zsh).
- **Agents:** OpenCode (primary) and Claude Code share skills (`~/.agents/skills`), the skill index/policy, subagents (explore/scout) and MCP servers. No Codex.
- **Claude plugins:** `CLAUDE_PLUGINS` in `install` (marketplace git URL pinned with `#tag`). caveman always-on via `caveman@caveman`; its `caveman` skill replaces the `~/.agents/skills` link (`CLAUDE_SKILLS_SKIP`). Unwanted plugin parts (cavecrew) are hidden via `CLAUDE_DENY` → `permissions.deny` merged into `~/.claude/settings.json`.
- **OpenCode-only:** ponytail plugin, per-agent permission denies. Claude Code cannot deny tools to the primary only, so the delegation rules are instruction-only there.
- **Docs lookup:** `find-docs` skill (`ctx7` CLI); Context7 is not an MCP server here.
- **Web:** built-in `websearch` off; **Exa MCP** for search; built-in `webfetch` for URLs.
- **Plugins (npm, pinned in opencode.json):** `@dietrichgebert/ponytail`, `opencode-caveman`.

## Public / safety

- Repo is **public**. Treat every commit as world-readable.
- Never commit: API keys, OAuth tokens, `~/.config/secrets/env`, `*.local`, real signing keys, private host paths you care about.
- Scrub before adding new stow’d files that might contain personal data.

## Intentionally not managed here

- Most GUI apps (Raycast, Steam, etc.) may stay installed but are **out of the Brewfile**.
- Third-party skills on disk but missing from `manifest.yaml` `skills.packages` are unmanaged until you add them there.
- Cursor/VS Code user settings beyond the `vscode "..."` Brewfile lines.
- Non-zsh tools’ env (only zsh is guaranteed by this repo).

## When working in this repo

- Prefer small commits: one logical change (Brewfile vs opencode vs zsh).
- After config edits that affect the live machine, run `./install` (or targeted stow) and sanity-check `readlink` on a few targets.
- Do not “fix” live `~/.config/opencode` and forget the package under `opencode/` — the package is source of truth.
- **OpenCode AGENTS.md = skill index, not a manual.** List installed skills with a one-line trigger each. Do **not** put Role/persona text, CLI recipes, browser steps, ctx7 workflows, or other tool how-tos there — that belongs in each skill’s `SKILL.md`; load the skill when the task matches. Before removing instructions from OpenCode AGENTS, ensure a skill covers them (prefer skills.sh packages). Missing capability → use `find-skills`, then pin the winner under `manifest.yaml` `skills.packages` (do not only install locally).
- **Keep the skill index in sync.** Skills add/remove/rename must update `opencode/.config/opencode/AGENTS.md` in the same change. That file is stowed to `$HOME/.config/opencode/AGENTS.md` — do not edit the home path separately. List must match `manifest.yaml` `skills.packages` + `skills/custom/*` (+ plugin skills like ponytail/caveman if listed). Drop entries for anything removed.
- **No machine-layout paths in tracked files.** Do not hardcode clone locations (e.g. `~/Projects/...`), hostnames, or per-box tool paths. Use `$HOME` / install defaults; put machine-only env in `$HOME/.zshenv.local` (untracked).
