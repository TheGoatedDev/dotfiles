# dotfiles

Public, idempotent macOS setup: shell configs (Stow), Homebrew (`Brewfile`), OpenCode, and agent skills (`skills.sh` + custom).

**Agents:** see [AGENTS.md](./AGENTS.md) for how the repo is wired.

## Quick start

```bash
git clone https://github.com/<you>/dotfiles.git ~/Projects/Personal/Dotfiles
cd ~/Projects/Personal/Dotfiles
./install --force   # first cutover from existing home files
```

Then:

```bash
mkdir -p ~/.config/secrets
cp env.example ~/.config/secrets/env && chmod 600 ~/.config/secrets/env
# edit secrets

cp gitconfig.local.example ~/.gitconfig.local   # name / email / signing key
cp zshenv.local.example ~/.zshenv.local         # kube, bitwarden sock, etc.
```

Open a new shell.

## Layout

| Path | Role |
|------|------|
| `manifest.yaml` | Stow packages + external `skills.sh` packages |
| `Brewfile` | Canonical Homebrew formulae/casks |
| `skills/custom/` | Your skills (symlinked into `~/.agents/skills`) |
| `zsh/`, `git/`, `ghostty/`, `opencode/` | Stow packages → `$HOME` |
| `install` | Idempotent apply (zsh) |

## Commands

```bash
./install              # safe: refuses non-stow conflicts
./install --force      # backup conflicts to ~/.dotfiles-backup/<ts>/
./install --reinstall        # brew reinstall formulae only (no sudo)
./install --reinstall-casks  # casks only (skips docker-desktop); Terminal + sudo -v
# Docker Desktop (privileged helpers) — fix/install only in Terminal:
#   brew install --cask --force docker-desktop
./install --skills-only
./install --check
./install --strict     # fail if secrets file missing
```

## Skills

- **External:** list under `skills.packages` in `manifest.yaml`; `./install --skills-only` runs `npx skills add`.
- **Custom:** edit under `skills/custom/<name>/`, re-run `./install --skills-only`.
- OpenCode skills dir is fully relinked to `~/.agents/skills/*`.

Skills on disk but not in `manifest.yaml` stay unmanaged until you add them there.

## Secrets

Never commit real keys. Only `env.example` is tracked. Live file: `~/.config/secrets/env`.

## OpenCode

Stowed under `~/.config/opencode` (config, AGENTS.md, plugins). `./install` runs `pnpm install` there for plugin deps.

Docs CLI: `ctx7` (pnpm global), not Context7 MCP.
