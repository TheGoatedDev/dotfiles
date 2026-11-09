# Dotfiles — agent guide

Public, idempotent **macOS** setup repo. Edit files **here**, apply with `./install`, live config under `$HOME` is mostly **symlinks** (GNU Stow).

Human quickstart: [README.md](./README.md).  
Claude Code **skill index** (user-scope): [claude/.claude/CLAUDE.md](./claude/.claude/CLAUDE.md).

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
| `zsh/`, `git/`, `ghostty/`, `tmux/`, `claude/`, `launchd/` | Stow packages → `$HOME` (mirror home-relative paths). |
| `freecad/onshape.py` | Onshape mouse (TinkerCAD nav) + keys, written to FreeCAD `user.cfg` by install (not stowed; FreeCAD rewrites it). |
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
| `tmux` | `~/.config/tmux/tmux.conf`. TPM plugins cloned by install into `~/.config/tmux/plugins/` (not stowed). |
| `claude` | `~/.claude/CLAUDE.md` (skill index + policy). `settings.json` is **not** stowed (Claude writes to it). |
| `launchd` | `~/Library/LaunchAgents/com.tom.proton-pass-ssh-agent.plist` (Proton Pass SSH agent, all vaults → `~/.ssh/proton-pass-agent.sock`). Install bootstraps unloaded agents. Needs `pass-cli login`. |

Skills are not stowed as trees: install rebuilds `~/.claude/skills/*` → `~/.agents/skills/*` (links only; its own dirs like `synced/` are left alone). `skills add -a claude-code` copies new external skills straight into `~/.claude/skills`; relink leaves those real dirs alone.

## How to change things

| Goal | Do |
|------|----|
| Shell / PATH / aliases | Edit `zsh/.zshenv` or `zsh/.zshrc`, then `./install` or `stow -R zsh`. |
| tmux conf | Edit `tmux/.config/tmux/tmux.conf`, then `./install` or `stow -R tmux`. |
| Machine-only env (kube, SSH agent sock) | `~/.zshenv.local` (from example). Not in repo. |
| Git identity | `~/.gitconfig.local`. Tracked `.gitconfig` is scrubbed + `include`s local. |
| Skill index / policy | Edit `claude/.claude/CLAUDE.md` (stowed → `$HOME/.claude/CLAUDE.md`). Skills list only — see below. |
| Claude plugins | `CLAUDE_PLUGINS` in `install` (marketplace git URL pinned with `#tag`). |
| MCP servers | Prefer a Claude plugin that ships the server (posthog) in `CLAUDE_PLUGINS`; otherwise `claude mcp add -s user` in `claude_setup` (rea, until its npm release ships the plugin manifest). |
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
2. Ensure `stow`; clone/update zsh plugins under `~/.zsh/plugins`, tmux plugins under `~/.config/tmux/plugins`, FreeCAD addons (`FREECAD_ADDON_REPOS`) into FreeCAD's `Mod` dir; Onshape keymap `freecad/onshape.py` via `freecadcmd` (skipped while FreeCAD runs)
3. Stow each package in `manifest.yaml`
4. Warn/check secrets file
5. Register Claude plugins (incl. their MCP servers); deny rules; RTK Claude hook (`rtk init -g --hook-only`)
6. External skills from `manifest.yaml` `skills.packages` (`-a claude-code`; skip if already present)
7. Symlink `skills/custom/*` → `~/.agents/skills/`
8. Relink `~/.claude/skills/` → `~/.agents/skills/`

## Stack assumptions

- **Shell:** zsh; plugins via git clones (not full Oh My Zsh).
- **Agent:** Claude Code only. Skills in `~/.agents/skills`, explore via built-in `Explore`. No OpenCode, no Codex.
- **Claude plugins:** `CLAUDE_PLUGINS` in `install` (marketplace git URL pinned with `#tag`). caveman always-on via `caveman@caveman`, ponytail always-on via `ponytail@ponytail`; `impeccable@impeccable`; `posthog` and `linear` from `claude-plugins-official` (SHA-pinned upstream, each brings its MCP server); `rea@rea` from `main` (tags lack `.claude-plugin/`; marketplace.json pins the npm version) gives the skill; `install` adds the `rea` MCP pinned to the same npm version (Hopper auto-found in `~/Applications`). Prefer a plugin over a skills.sh package when it ships only what you want. The `caveman` skill comes from the plugin, not `skills.packages`. Unwanted plugin parts (cavecrew) are hidden via `CLAUDE_DENY` → `permissions.deny` merged into `~/.claude/settings.json`; same merge sets empty `attribution` (no Claude co-author/PR footer).
- **Docs lookup:** `find-docs` skill (`ctx7` CLI); Context7 is not an MCP server here.
- **Web:** built-in `websearch` for search, built-in `webfetch` for URLs.

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

- Prefer small commits: one logical change (Brewfile vs claude vs zsh).
- After config edits that affect the live machine, run `./install` (or targeted stow) and sanity-check `readlink` on a few targets.
- Do not “fix” live `~/.claude/CLAUDE.md` and forget the package under `claude/` — the package is source of truth.
- **CLAUDE.md = skill index, not a manual.** List installed skills with a one-line trigger each. Do **not** put Role/persona text, CLI recipes, browser steps, ctx7 workflows, or other tool how-tos there — that belongs in each skill’s `SKILL.md`; load the skill when the task matches. Before removing instructions from CLAUDE.md, ensure a skill covers them (prefer skills.sh packages). Missing capability → use `find-skills`, then pin the winner under `manifest.yaml` `skills.packages` (do not only install locally).
- **Keep the skill index in sync.** Skills add/remove/rename must update `claude/.claude/CLAUDE.md` in the same change. That file is stowed to `$HOME/.claude/CLAUDE.md` — do not edit the home path separately. List must match `manifest.yaml` `skills.packages` + `skills/custom/*` (+ plugin skills like ponytail/caveman if listed). Drop entries for anything removed.
- **No machine-layout paths in tracked files.** Do not hardcode clone locations (e.g. `~/Projects/...`), hostnames, or per-box tool paths. Use `$HOME` / install defaults; put machine-only env in `$HOME/.zshenv.local` (untracked).
