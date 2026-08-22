# Interactive zsh only. Env lives in ~/.zshenv. Managed by dotfiles.

ZSH_PLUGINS="${ZSH_PLUGINS:-$HOME/.zsh/plugins}"

# --- Completion ---
[[ -d "$HOME/.docker/completions" ]] && fpath=("$HOME/.docker/completions" $fpath)
autoload -Uz compinit
if [[ -n ${ZDOTDIR:-$HOME}/.zcompdump(#qN.mh+24) ]]; then
  compinit -d "${ZDOTDIR:-$HOME}/.zcompdump"
else
  compinit -C -d "${ZDOTDIR:-$HOME}/.zcompdump"
fi

# --- Plugins (cloned by ./install) ---
[[ -f "$ZSH_PLUGINS/zsh-autosuggestions/zsh-autosuggestions.zsh" ]] && \
  source "$ZSH_PLUGINS/zsh-autosuggestions/zsh-autosuggestions.zsh"
[[ -f "$ZSH_PLUGINS/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" ]] && \
  source "$ZSH_PLUGINS/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"

# --- History ---
HISTSIZE=50000
SAVEHIST=50000
HISTFILE=~/.zsh_history
setopt extended_history hist_expire_dups_first hist_ignore_dups hist_ignore_space hist_verify share_history

# --- Key bindings ---
bindkey -e
bindkey '^[[A' history-beginning-search-backward
bindkey '^[[B' history-beginning-search-forward

# --- Prompt & tools ---
command -v starship >/dev/null && eval "$(starship init zsh)"
command -v zoxide >/dev/null && eval "$(zoxide init zsh)"

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

if command -v nvm >/dev/null 2>&1; then
  _nvm_use_project_version() {
    local nvmrc_path
    nvmrc_path="$(nvm_find_nvmrc)"
    path=("${(@)path:#$NVM_DIR/versions/node/*/bin}")
    if [[ -n "$nvmrc_path" ]]; then
      nvm use --silent >/dev/null
    elif [[ "$(nvm current)" != "$(nvm version default)" ]]; then
      nvm use default --silent >/dev/null
    fi
  }
  autoload -Uz add-zsh-hook
  add-zsh-hook chpwd _nvm_use_project_version
  _nvm_use_project_version
fi

# --- Git worktrees ---
_agent_worktree_dir() {
  local IFS=-
  echo ".worktree/$*"
}

_agent_worktree_branch() {
  local IFS=-
  echo "feature/$*"
}

_agent_prune_worktrees() {
  local keep_count=5 worktree_root=".worktree"
  [[ -d "$worktree_root" ]] || return 0
  local -a worktrees
  worktrees=($worktree_root/*(/om))
  local worktree
  for worktree in "${worktrees[@]:$keep_count}"; do
    git worktree remove --force "$worktree"
  done
}

wt() {
  if [[ $# -eq 0 ]]; then
    echo "Usage: wt <worktree-name>"
    return 1
  fi
  local dir="$(_agent_worktree_dir "$@")"
  local branch="$(_agent_worktree_branch "$@")"
  git worktree add "$dir" -b "$branch" 2>/dev/null || git worktree add "$dir" "$branch"
  _agent_prune_worktrees
  cd "$dir"
}
