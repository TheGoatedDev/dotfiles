# ~/.zshenv — all zsh shells. Pure env only. Managed by dotfiles.

eval "$(/opt/homebrew/bin/brew shellenv zsh)"

export NVM_DIR="$HOME/.nvm"
export PNPM_HOME="$HOME/Library/pnpm"

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
