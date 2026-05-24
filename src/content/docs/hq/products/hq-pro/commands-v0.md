---
title: Team Commands (v0)
description: In-HQ slash commands for team invites and bidirectional sync.
---

Team Commands v0 provides the day-to-day team management experience — inviting members and syncing content — using Claude Code slash commands that work with plain GitHub git.

## Why "v0"?

This is the **pragmatic reality layer** — it works with GitHub git directly, without requiring the full HQ Cloud API. Teams can function with just:
- A GitHub org with the HQ Team Sync App installed
- `team.json` in the company directory
- The `gh` CLI for authentication

## /invite

Send a team invitation to a new member.

```
/invite alice@acme.com
```

What happens:
1. Discovers teams from `companies/*/team.json`
2. Sends GitHub org invitation via the HQ Team Sync App
3. Generates an `hq_` invite token
4. Outputs a share-ready message block the admin can send
5. Falls back to manual instructions if the API call fails

## /sync

Bidirectional content sync with the team repository.

```
/sync                    # Sync all teams
/sync --team acme        # Sync specific team
/sync --dry-run          # Preview without changes
```

What happens:
1. Authenticates via `gh` CLI (OS keychain credentials)
2. `git pull` to get latest team content
3. `git push` to share local changes
4. Reports what files changed in each direction

### Conflict Resolution

When merge conflicts occur, `/sync` offers three options:
- **Keep local** — Your version wins
- **Keep remote** — Team version wins
- **Manual** — Opens the conflict for manual resolution

The sync **never silently overwrites** — conflicts always require explicit user choice.

## Pre-Sync PII/Secrets Scan

Before pushing changes, `/sync` scans staged content for:
- API keys and tokens (pattern matching)
- Passwords and secrets
- `.env` file contents
- Private keys

If sensitive content is detected, the push is **blocked** until the user confirms or removes the content.

## Command Symlinks

Team repositories can distribute Claude Code commands. After sync:

1. Scans `companies/{slug}/.claude/commands/` for command files
2. Creates symlinks in `.claude/commands/` at the HQ root
3. Warns on naming collisions with existing commands
4. Removes symlinks when commands are deleted from the team repo

This means team-distributed commands show up in the user's `/` command list automatically.

## Auth Model

v0 uses the `gh` CLI and OS keychain for git authentication — no `credentials.json` file, no HQ Cloud JWT. This keeps the setup minimal and leverages credentials the developer already has.
