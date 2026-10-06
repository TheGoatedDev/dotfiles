---
name: proton-pass
description: Use when reading, injecting, or running with Proton Pass secrets via pass-cli — logins, passwords, API keys, TOTP, vault/item lookup, pass:// references. Also when the user mentions Proton Pass, pass-cli, or proton-pass-cli.
---

# Proton Pass CLI

Binary is `pass-cli` (Homebrew formula `proton-pass-cli`). Docs: https://protonpass.github.io/pass-cli/

If missing: `brew install proton-pass-cli`, then `pass-cli --version`.

## Hard rules

- Never print secret values, TOTP secrets, PATs, or `--show-secrets` output in chat, logs, commits, or files the user did not name.
- Never write tokens into this skill, git, or tracked config. Token lives in `~/.config/secrets/env` as `PROTON_PASS_PERSONAL_ACCESS_TOKEN`.
- Prefer not putting the secret in the model context at all.

Need | Command
--- | ---
A process needs the secret | `pass-cli run` with `pass://` in the env. Default.
A named local file needs the secret | `pass-cli inject` to that path (`--out-file`, mode 0600).
The task truly needs one value here | `pass-cli item view --field <name>` only. Quote the field, not the rest.

## Session

```bash
pass-cli info --output json
```

Exit 0: use that session. Non-zero: login.

Agent PAT (preferred for this agent):

```bash
export PROTON_PASS_SESSION_DIR="${TMPDIR:-/tmp}/pass-agent-opencode"
PROTON_PASS_PERSONAL_ACCESS_TOKEN="$PROTON_PASS_PERSONAL_ACCESS_TOKEN" pass-cli login
pass-cli info --output json
```

Web login (`pass-cli login`) is the owner's job in a real terminal. Do not open a browser login from the agent unless the user asks.

Agent sessions last 2 hours. On auth errors: `pass-cli logout --force`, login again, retry. Do not create or renew agents unless the user asks; token is shown once.

## Agent audit reason

When the session is an agent (PAT with agent flag), set a non-empty reason ≤300 chars on every audited command:

```bash
PROTON_PASS_AGENT_REASON="why this item is needed" pass-cli item view \
  --vault-name "Vault" --item-title "Item" --field password
```

Audited: `item view`, `item create` (all kinds), `item update`, `item trash`, `item untrash`, `item move`, `vault update`.

Reason must be concrete (which app, which action). Not "need password".

Owner (web) sessions do not require the reason. Still do not dump secrets.

## Discover

```bash
pass-cli vault list --output json
pass-cli share list --output json
pass-cli item list --vault-name "Name" --output json
pass-cli item list --output json
```

Do not pass `--show-secrets`. Titles, ids, types only until a field is required.

Item types: `note`, `login`, `alias`, `credit-card`, `identity`, `ssh-key`, `wifi`, `custom`.

## Secret references

`pass://<vault>/<item>/<field>`

Vault and item may be name or id. Field required. Names with spaces are fine.

```bash
export API_KEY='pass://Work/Stripe/password'
pass-cli run -- ./deploy.sh
```

Inject templates use `{{ pass://Work/Stripe/password }}`:

```bash
pass-cli inject -i config.yaml.template -o config.yaml --file-mode 0600
```

Common login fields: `username`, `password`, `email`, `url`, `note`, `totp`.

TOTP: `pass://Work/GitHub/totp` is the current code; `?totp=uri` is the raw `otpauth://` URI. Never paste the URI into chat.

Duplicate names: use share id + item id.

## View one field

```bash
PROTON_PASS_AGENT_REASON="..." pass-cli item view \
  --vault-name "Vault" --item-title "Title" --field password --output json
```

Or `pass-cli item view "pass://SHARE_ID/ITEM_ID/password"`.

Flags: `--vault-name` / `--share-id`, `--item-title` / `--item-id`. Not `--item-name`.

## Owner-only (ask first)

Do not run unless the user explicitly wants it: `agent create|delete|renew`, `agent access grant|revoke`, `vault create|delete|share|transfer`, `item delete`, invites, PAT create.

Setup an agent for this machine (user runs):

```bash
pass-cli agent create opencode --expiration 3m --vault "VaultName"
```

Save `token` into `~/.config/secrets/env`. Never commit it. Inspect later with `pass-cli agent monitor opencode`.

## Flags

`pass-cli <command> --help` wins over this file. Full docs: https://protonpass.github.io/pass-cli/
