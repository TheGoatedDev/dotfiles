# zshenv — all zsh shells. Pure env only. Managed by dotfiles.

if [[ -x /opt/homebrew/bin/brew ]]; then
  eval "$(/opt/homebrew/bin/brew shellenv zsh)"
elif [[ -x /usr/local/bin/brew ]]; then
  eval "$(/usr/local/bin/brew shellenv zsh)"
fi

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# macOS pnpm default; override in .zshenv.local if needed
export PNPM_HOME="${PNPM_HOME:-$HOME/Library/pnpm}"

case ":$PATH:" in
  *":$PNPM_HOME/bin:"*) ;;
  *) export PATH="$PNPM_HOME/bin:$PATH" ;;
esac
case ":$PATH:" in
  *":$HOME/.bun/bin:"*) ;;
  *) export PATH="$HOME/.bun/bin:$PATH" ;;
esac
case ":$PATH:" in
  *":$HOME/.local/bin:"*) ;;
  *) export PATH="$HOME/.local/bin:$PATH" ;;
esac

[[ -f "$HOME/.config/secrets/env" ]] && source "$HOME/.config/secrets/env"
[[ -f "$HOME/.cargo/env" ]] && . "$HOME/.cargo/env"
[[ -f "$HOME/.zshenv.local" ]] && source "$HOME/.zshenv.local"
