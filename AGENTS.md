# Dotfiles — agent guide

Public, idempotent **macOS** setup repo. Edit files **here**, apply with `./install`, live config under `$HOME` is mostly **symlinks** (GNU Stow).

Human quickstart: [README.md](./README.md).  
OpenCode **runtime** persona / skills / CLIs: [opencode/.config/opencode/AGENTS.md](./opencode/.config/opencode/AGENTS.md).

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
| `manifest.yaml` | Documents stow packages + skills paths (human + install defaults). |
| `Brewfile` | Canonical Homebrew formulae/casks/vscode extensions to **ensure**. Does not uninstall extras on the machine. |
| `zsh/`, `git/`, `ghostty/`, `opencode/` | Stow packages → `$HOME` (mirror home-relative paths). |
| `skills-lock.json` | External skills pins for [skills.sh](https://skills.sh) / `npx skills`. |
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

OpenCode **skills** are not stowed as trees: install rebuilds `~/.config/opencode/skills/*` → `~/.agents/skills/*`.

## How to change things

| Goal | Do |
|------|----|
| Shell / PATH / aliases | Edit `zsh/.zshenv` or `zsh/.zshrc`, then `./install` or `stow -R zsh`. |
| Machine-only env (kube, SSH agent sock) | `~/.zshenv.local` (from example). Not in repo. |
| Git identity | `~/.gitconfig.local`. Tracked `.gitconfig` is scrubbed + `include`s local. |
| OpenCode config / plugins list | Edit `opencode/.config/opencode/opencode.json`. Pin plugins with `@pkg@version`. |
| OpenCode runtime rules | Edit `opencode/.config/opencode/AGENTS.md`. |
| Local OpenCode plugin file | `opencode/.config/opencode/plugins/*.ts`, then `./install` (runs `pnpm install` in config dir). |
| Homebrew set | Edit `Brewfile` only. `brew bundle --no-upgrade` via install. Leaving something out of the Brewfile does **not** uninstall it. |
| External skill | `npx skills add <source> -g -y -s <name> -a opencode`, then copy updated `~/.agents/.skill-lock.json` → `skills-lock.json` if you want it pinned for others. |
| Custom skill | Add `skills/custom/<name>/SKILL.md`, `./install --skills-only`. |
| Secrets | Edit `~/.config/secrets/env` only. Update `env.example` keys (empty values) if you add a new var name. |

## `./install` contract

```bash
./install              # safe: refuse non-stow conflicts
./install --force      # backup conflicts → ~/.dotfiles-backup/<timestamp>/
./install --reinstall        # brew reinstall formulae only (no sudo)
./install --reinstall-casks  # casks only; real Terminal + sudo -v (hidden password)
./install --skills-only
./install --check      # dry / drift oriented
./install --strict     # fail if secrets file missing
```

Rough order (full install):

1. Ensure Homebrew; `brew bundle --file=Brewfile --no-upgrade`
2. Ensure `stow`; clone/update zsh plugin git repos under `~/.zsh/plugins`
3. Stow each package in `manifest.yaml`
4. Warn/check secrets file
5. `pnpm install` in `~/.config/opencode` if `package.json` present
6. External skills from `skills-lock.json` (OpenCode agent only; skip if already present)
7. Symlink `skills/custom/*` → `~/.agents/skills/`
8. Relink all of `~/.config/opencode/skills/` → `~/.agents/skills/`

## Stack assumptions

- **Shell:** zsh; plugins via git clones (not full Oh My Zsh).
- **Agent:** OpenCode only (no Claude Code / Codex in this setup).
- **Docs lookup:** `ctx7` CLI + `find-docs` skill; Context7 is not an MCP server here.
- **Web:** built-in `websearch` off; **Exa MCP** for search; built-in `webfetch` for URLs.
- **Plugins (npm, pinned in opencode.json):** `@dietrichgebert/ponytail`, `opencode-caveman`.

## Public / safety

- Repo is **public**. Treat every commit as world-readable.
- Never commit: API keys, OAuth tokens, `~/.config/secrets/env`, `*.local`, real signing keys, private host paths you care about.
- Scrub before adding new stow’d files that might contain personal data.

## Intentionally not managed here

- Most GUI apps (Raycast, Steam, etc.) may stay installed but are **out of the Brewfile**.
- Third-party skills present on disk but missing from `skills-lock.json` are unmanaged until you pin them.
- Cursor/VS Code user settings beyond the `vscode "..."` Brewfile lines.
- Non-zsh tools’ env (only zsh is guaranteed by this repo).

## When working in this repo

- Prefer small commits: one logical change (Brewfile vs opencode vs zsh).
- After config edits that affect the live machine, run `./install` (or targeted stow) and sanity-check `readlink` on a few targets.
- Do not “fix” live `~/.config/opencode` and forget the package under `opencode/` — the package is source of truth.
