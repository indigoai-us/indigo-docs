---
title: "hq CLI reference"
description: "Every public hq command and subcommand, generated from the hq-cli command catalog."
---

Generated from hq-cli `src/command-catalog.generated.ts` at hq-cli 5.345.177 by `scripts/generate-cli-reference.mjs`. Do not edit this page by hand; re-run the script instead.

Hidden and staff-only commands are not listed. Run `hq <command> --help` for the full help text of any command, including options of nested subcommands.

## Commands

| Command | Description |
|---|---|
| [`hq decide`](#hq-decide) | Ask and answer owner decisions in the HQ Queue |
| [`hq modules`](#hq-modules) | Module management commands |
| [`hq packages`](#hq-packages) | Package management commands |
| [`hq packs`](#hq-packs) | Content-pack lifecycle (install via `hq install`) |
| [`hq install`](#hq-install) | Install a package. Sources: bare slug (registry, Cognito-gated), @scope/name[@ver] (npm pack), git URL[#ref], or local path. |
| [`hq remove`](#hq-remove) | Remove an installed package (archives it first) |
| [`hq publish`](#hq-publish) | Package a skill/worker pack and submit it to the HQ marketplace (POST /v1/listings). |
| [`hq creators`](#hq-creators) | Creator marketplace account |
| [`hq sync`](#hq-sync) | Cloud sync commands — sync HQ to S3 for mobile access |
| [`hq cloud`](#hq-cloud) | Cloud commands — provision entities and manage cloud-backed companies |
| [`hq team-sync`](#hq-team-sync) | Pull latest team content for all joined teams |
| [`hq login`](#hq-login) | Authenticate with HQ via Cognito |
| [`hq logout`](#hq-logout) | Log out and clear cached credentials |
| [`hq whoami`](#hq-whoami) | Show the currently authenticated user |
| [`hq link`](#hq-link) | Link this folder (or its git remote) to an HQ company |
| [`hq unlink`](#hq-unlink) | Remove the HQ company link for this folder |
| [`hq uninstall`](#hq-uninstall) | Remove the HQ global install from an agent runtime (use with --global) |
| [`hq resolve-company`](#hq-resolve-company) | Print the HQ company linked to this folder (never guesses) |
| [`hq provider`](#hq-provider) | Launch supported AI provider CLIs |
| [`hq version`](#hq-version) | Show HQ, CLI, and latest hq-core versions |
| [`hq fingerprint`](#hq-fingerprint) | Print this session's HQ fingerprint, or resolve a fingerprint to its session |
| [`hq capture`](#hq-capture) | Record your screen with HQ Capture: start, record, stop, status and wait |
| [`hq auth`](#hq-auth) | Manage the local HQ Cognito session |
| [`hq secrets`](#hq-secrets) | Manage secrets in HQ vault (SSM Parameter Store) |
| [`hq db`](#hq-db) | Vault databases — local SQLite per company and HQ-managed remote Postgres-class DBs |
| [`hq api-keys`](#hq-api-keys) | Manage vault API keys for CI and automation |
| [`hq run`](#hq-run) | Load secrets from .env.schema and run a command with them injected |
| [`hq groups`](#hq-groups) | Manage groups in HQ vault |
| [`hq workers`](#hq-workers) | Discover and share HQ workers |
| [`hq group-grants`](#hq-group-grants) | Grant a group's access to another company (cross-company), and revoke or inspect those grants |
| [`hq files`](#hq-files) | Manage file access controls in HQ vault. A trailing folder slash (foo/) is a private folder; the quoted glob 'foo/*' shares all children, and a quoted 'clients/*/reports' shares that folder under every client. |
| [`hq access`](#hq-access) | Tell whether a vault file exists and whether you can read it. Never a bare not-found. Takes one or more paths or queries. Exit codes: 0 local/not-synced, 2 never-existed, 3 no-access, 4 ambiguous. |
| [`hq storage`](#hq-storage) | See how much space HQ backups use and delete old ones |
| [`hq skill`](#hq-skill) | Create, stage, promote, and discuss company skills |
| [`hq members`](#hq-members) | Manage company memberships and invites |
| [`hq people`](#hq-people) | List, search, and resolve a company's people (from companies/&lt;co&gt;/people) |
| [`hq dm`](#hq-dm) | Send and read direct messages, and manage connection requests. Messages sent from a person login are always tagged for people. When an agent or bot sends, messages to an agent, a channel or a group are tagged for agents and folded away from people by default. Pass --for-human or --audience human to tag a message for people; --audience agent\|both is for agents and bots only. |
| [`hq channels`](#hq-channels) | List the DM channels you're in (name them with `hq dm <name> "…"`). |
| [`hq onboard`](#hq-onboard) | Provision an HQ vault: sign in, create company, S3 bucket, STS, sync |
| [`hq feedback`](#hq-feedback) | Submit a bug report or feature request to HQ |
| [`hq meetings`](#hq-meetings) | View and search meeting recordings, transcripts, and notes |
| [`hq sources`](#hq-sources) | Read sources (meetings, emails, etc.) from a vault entity |
| [`hq signals`](#hq-signals) | Read signals (action_items, decisions, etc.) from a vault entity |
| [`hq integrations`](#hq-integrations) | Connect, govern, and use company apps (Linear, Notion, …) through HQ's governed integration gateway |
| [`hq import`](#hq-import) | Import existing AI context (Claude Code, Codex, repos) into HQ |
| [`hq scan`](#hq-scan) | Local, offline scanners |
| [`hq reindex`](#hq-reindex) | Surface namespaced skills, materialize legacy knowledge repos, regenerate the workers registry, and trust HQ hooks for Codex, Grok, and Claude Code |
| [`hq rescue`](#hq-rescue) | Re-sync your HQ core to the latest release, preserving your local edits (drift) |
| [`hq mcp`](#hq-mcp) | MCP pack observability (read-only) across Claude + Codex |
| [`hq repo`](#hq-repo) | Register code repos with HQ (repos/ and companies/manifest.yaml) |
| [`hq crm`](#hq-crm) | Read and upsert canonical CRM entities in a company vault |
| [`hq company`](#hq-company) | Company-level settings |
| [`hq agents`](#hq-agents) | Manage a company's cloud (fleet) agents |
| [`hq agent`](#hq-agent) | Enroll and run this host as an external HQ agent |
| [`hq outposts`](#hq-outposts) | Manage personal and company HQ Outposts (EC2 boxes) |
| [`hq billing`](#hq-billing) | Inspect billing and mint a card-capture link |
| [`hq vault`](#hq-vault) | Manage HQ vault settings |
| [`hq search`](#hq-search) | Search the local HQ qmd index |
| [`hq library`](#hq-library) | Company media library (.hqcloud asset placeholders) |
| [`hq index`](#hq-index) | Manage the local HQ search index |
| [`hq capacity`](#hq-capacity) | Show provider capacity from the local ledger (read-only; enable, login, and ingest write to it) |
| [`hq doctor`](#hq-doctor) | Verify HQ hook wiring, runtimes, and connection health (read-only; integrations uses one control-plane inventory read). |
| [`hq mesh`](#hq-mesh) | Work mesh — register project work, report progress, and warm ~/.hq/work-mesh/cache |
| [`hq lanes`](#hq-lanes) | Create, supervise, and steer worker lanes; routed decision queue |
| [`hq monitor`](#hq-monitor) | Run detached monitors and deliver their output into agent context |
| [`hq bot`](#hq-bot) | Personal local bots that run on this computer with your own model login |
| [`hq report`](#hq-report) | Publish and manage a channel report owned by this bot. |
| [`hq deploy`](#hq-deploy) | Manage deployments in hq-deploy |

## hq decide

Ask and answer owner decisions in the HQ Queue

```
hq decide [options] [command]
```

| Subcommand | Description |
|---|---|
| `ask [options] <statement>` | Create an option-choice owner decision as the personal local bot |
| `list [options]` | Read your decisions across companies, oldest first |
| `show [options] <id>` | Show a visible decision, including its options and answer |
| `answer [options] <id>` | Answer with an option ID; the server enforces expiry and first answer |
| `talk [options] <id>` | Open the decision's bot conversation |
| `withdraw [options] <id>` | Withdraw a decision you asked |
| `import-lanes [options]` | Import option-style legacy questions once; report skipped advanced questions |

## hq modules

Module management commands

```
hq modules [options] [command]
```

| Subcommand | Description |
|---|---|
| `add [options] <repo-url>` | Add a module to the manifest |
| `sync [options]` | Sync all modules from manifest |
| `list [options]` | List all modules and their status |
| `update [options] [module-name]` | Update lock for a specific module (or all if no name given) |

## hq packages

Package management commands

```
hq packages [options] [command]
```

| Subcommand | Description |
|---|---|
| `install [options] [source]` | Install a package. Sources: bare slug (registry, Cognito-gated), @scope/name[@ver] (npm pack), git URL[#ref], or local path. |
| `remove [options] <slug>` | Remove an installed package (archives it first) |
| `update [options] [slug]` | Check for and apply package updates |
| `list [options]` | List installed content packs and the curated catalog |
| `packs [options] [command]` | Content-pack lifecycle (install via `hq install`) |
| `packs list [options]` | List installed content packs and the curated catalog |
| `packs update [options] [name]` | Update an installed content pack (re-install latest) |
| `packs uninstall [options] <name>` | Un-wire and archive an installed content pack |

## hq packs

Content-pack lifecycle (install via `hq install`)

```
hq packs [options] [command]
```

| Subcommand | Description |
|---|---|
| `list [options]` | List installed content packs and the curated catalog |
| `update [options] [name]` | Update an installed content pack (re-install latest) |
| `uninstall [options] <name>` | Un-wire and archive an installed content pack |

## hq install

Install a package. Sources: bare slug (registry, Cognito-gated), @scope/name[@ver] (npm pack), git URL[#ref], or local path.

```
hq install [options] [source]
```

| Option | Description |
|---|---|
| `--company <co>` | Scope package secret authorization to a specific company |
| `--allow-hooks` | Skip the hooks confirmation prompt (content-pack flow) |
| `--allow-mcp` | Skip the MCP server confirmation prompt (content-pack flow) |
| `--allow-unsigned` | Acknowledge an unsigned local directory source; marketplace installs always require a signature |
| `--start-bot` | After install, create and start the pack's setup bot (packs with a setup: block); prints `bot: <name>` |
| `--branch` | Follow a ref instead of SHA-pinning (git content-pack flow) |
| `--global` | Install HQ into an agent runtime at user scope (requires the hq-anywhere-runtime flag) |
| `--runtime <runtime>` | Runtime for --global (claude \| codex \| chatgpt \| grok) Default: `"claude"`. |
| `--via <mode>` | With --global Claude: install directly or via plugin (direct \| plugin) Default: `"direct"`. |
| `--marketplace-dir <dir>` | With --via plugin: local Claude Code marketplace directory (or HQ_CLAUDE_PLUGIN_MARKETPLACE) |
| `--dry-run` | With --global: print every file and config diff without writing |
| `--hq-root <dir>` | With --global: HQ checkout to install from (default: walk up from cwd) |

## hq remove

Remove an installed package (archives it first)

```
hq remove [options] <slug>
```

## hq publish

Package a skill/worker pack and submit it to the HQ marketplace (POST /v1/listings).

```
hq publish [options] <path>
```

| Option | Description |
|---|---|
| `--as <handle>` | Publish on behalf of a seeded, unclaimed creator by handle (HQ staff only). The listing is attributed to that creator instead of you. |
| `--on-behalf <handle>` | Alias for --as. |
| `--handle <handle>` | Publish as one of your own claimed creator handles (for accounts that own more than one). Defaults to your first claimed handle. |

## hq creators

Creator marketplace account

```
hq creators [options] [command]
```

| Subcommand | Description |
|---|---|
| `apply [options]` | Apply for verified-creator access (required to publish packs) |

## hq sync

Cloud sync commands — sync HQ to S3 for mobile access

```
hq sync [options] [command]
```

| Subcommand | Description |
|---|---|
| `push [options] [paths...]` | Push local file(s) to the company vault on S3 |
| `pull [options]` | Pull permitted files from the company vault to local HQ |
| `status [options]` | Show local sync journal summary |
| `now [options]` | Bidirectional sync: push local changes, then pull remote updates (mirrors AppBar HQ Sync's "Sync Now" button) |
| `doctor [options]` | Repair the local HQ tree. `--reconcile-conflicts` folds legacy sibling `.conflict-*` twins back into their live files (higher frontmatter `version:` wins; losers are parked under .hq/conflict-backups/). Dry-run unless --yes. |
| `mode [options] [mode]` | Flip a membership's sync-mode (shared\|all\|custom), or --show every membership's current mode |
| `narrow [options]` | Migrate a company's membership from syncMode='all' to 'shared' — dry-run previews diff, --apply performs the prune + flip |
| `manifest [options]` | Upload a file manifest for the sync reconciliation audit (personal or a company scope) |
| `held [options]` | Show uploads held because someone else was signed in on this computer |
| `release-held [options]` | Confirm held files are yours and let sync upload them |

### hq sync push

Push local file(s) to the company vault on S3

| Option | Description |
|---|---|
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |
| `--company <slug>` | Company slug or UID (defaults to active company in .hq/config.json) |
| `--lock-timeout <seconds>` | Maximum wait for another active HQ operation (default: 300; 0 = refuse immediately) |
| `--message <msg>` | Optional message attached to journal entries for these uploads |
| `--on-conflict <strategy>` | Conflict strategy: overwrite \| keep \| abort (omit for interactive) |
| `--creds-from-stdin` | Read a pre-vended EntityContext as JSON from stdin instead of vending via the cached Cognito session. Use when the caller (e.g. AppBar HQ Sync) has its own STS pipeline (`/sts/vend-child` with task scope) and just needs share()'s upload mechanics. The caller is responsible for vending credentials with enough TTL for the run. |
| `--json` | Emit each share()-level event as a JSON Lines record on stderr (one JSON object per line) instead of human-readable console output. A synthetic `{type:"complete",...}` line is appended at the end with the final ShareResult. Subprocess callers parse these to render their own UI (e.g. AppBar Tauri events). |
| `--all` | Push every company you are a member of plus your personal vault. Company targets push `<hq-root>/companies/<slug>/`; personal pushes every top-level entry under &lt;hq-root&gt; minus the excluded set (.git, companies, repos, workspace). Implies --skip-unchanged + --propagate-deletes. Mutually exclusive with --company, --personal, and any explicit [paths]. |
| `--personal` | Push to the caller's canonical personal vault (resolved from the cached Cognito session). When no [paths] are given, defaults to every top-level entry under &lt;hq-root&gt; minus the excluded set (.git, companies, repos, workspace) — same scope as `--all`'s personal slot. Mutually exclusive with --company and --all. |
| `--no-personal` | In `--all` mode, skip the canonical-person leg of the fanout — only push to the caller's company memberships. Mirrors the upstream `hq-sync-runner --skip-personal` flag (hq-cloud 5.25.0); wired so the AppBar HQ Sync menubar can drop personal sync via a toggle, and so CLI users can opt out one-off. Ignored outside `--all`. |

### hq sync pull

Pull permitted files from the company vault to local HQ

| Option | Description |
|---|---|
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |
| `--company <slug>` | Company slug or UID (defaults to active company in .hq/config.json) |
| `--lock-timeout <seconds>` | Maximum wait for another active HQ operation (default: 300; 0 = refuse immediately) |
| `--on-conflict <strategy>` | Conflict strategy: overwrite \| keep \| abort (omit for interactive) |
| `--all` | Pull every company you are a member of plus your personal vault into &lt;hq-root&gt;. Companies land at &lt;hq-root&gt;/companies/&lt;slug&gt;; the personal vault syncs at &lt;hq-root&gt;. Mutually exclusive with --company and --personal. |
| `--personal` | Pull the caller's canonical personal vault into &lt;hq-root&gt; directly (no companies/&lt;slug&gt;/ prefix). Resolves the person UID automatically from the cached Cognito session. Mutually exclusive with --company and --all. |
| `--no-personal` | In `--all` mode, skip the canonical-person leg of the fanout — only pull the caller's company memberships. Mirrors the upstream `hq-sync-runner --skip-personal` flag (hq-cloud 5.25.0). Ignored outside `--all`. |
| `--mode-all` | US-011: opt out of the strict narrow-hint refusal for this run. Has no effect today (default narrow-hint level is 'hint'); wired so future hq-core-staging releases can flip the default to 'strict' without re-touching this command. |
| `--force-scope-shrink` | When a scope shrink would un-track locally-modified files (e.g. after narrowing from all → shared), proceed anyway. Dirty files are KEPT on disk and only un-tracked from sync; clean out-of-scope files are quarantined under .hq/scope-quarantine/ (recoverable). |

### hq sync status

Show local sync journal summary

| Option | Description |
|---|---|
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |
| `--company <slug>` | Show only this company's journal (company slug) |

### hq sync now

Bidirectional sync: push local changes, then pull remote updates (mirrors AppBar HQ Sync's "Sync Now" button)

| Option | Description |
|---|---|
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |
| `--company <slug>` | Company slug or UID (defaults to active company in .hq/config.json) |
| `--lock-timeout <seconds>` | Maximum wait for another active HQ operation (default: 300; 0 = refuse immediately) |
| `--message <msg>` | Optional message attached to journal entries for the push leg |
| `--on-conflict <strategy>` | Conflict strategy: overwrite \| keep \| abort (omit for interactive) |
| `--all` | Sync every company you are a member of plus your personal vault (pushAll then pullAll). Mutually exclusive with --company and --personal. |
| `--personal` | Sync the caller's canonical personal vault bidirectionally. Mutually exclusive with --company and --all. |
| `--no-personal` | In `--all` mode, skip the canonical-person leg of both the push and pull fanouts — only sync the caller's company memberships. Mirrors the upstream `hq-sync-runner --skip-personal` flag (hq-cloud 5.25.0). Ignored outside `--all`. |
| `--mode-all` | US-011: opt out of the strict narrow-hint refusal for this run. No-op today; wired so future hq-core-staging releases can flip the default narrow-hint level to 'strict'. |
| `--force-scope-shrink` | When a scope shrink would un-track locally-modified files, proceed anyway. Dirty files are KEPT on disk (only un-tracked); clean out-of-scope files are quarantined under .hq/scope-quarantine/. |
| `--max-idle <seconds>` | For scheduled or unattended runs: stop with exit code 124 after this many seconds with no file planned, transferred or skipped. The remote listing and planning phase of a leg reports no progress, so set this longer than your slowest planning phase. Laptop sleep does not count. (default: HQ_SYNC_MAX_IDLE, else off) |
| `--max-runtime <seconds>` | For scheduled or unattended runs: stop with exit code 124 if the run has not finished after this many seconds, even while it is making progress. Laptop sleep does not count. (default: HQ_SYNC_MAX_RUNTIME, else off) |

### hq sync doctor

Repair the local HQ tree. `--reconcile-conflicts` folds legacy sibling `.conflict-*` twins back into their live files (higher frontmatter `version:` wins; losers are parked under .hq/conflict-backups/). Dry-run unless --yes.

| Option | Description |
|---|---|
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |
| `--reconcile-conflicts` | Reconcile legacy sibling `.conflict-<ts>-<machine>` twins against their live files (purely local; no vault access). |
| `--yes` | Apply the plan (default: dry-run, print only) |

### hq sync mode

Flip a membership's sync-mode (shared|all|custom), or --show every membership's current mode

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (defaults to the active company in &lt;hq-root&gt;/.hq/config.json) |
| `--show` | Print the current sync-mode for every membership the caller has |
| `--paths <csv>` | Comma-separated allowed prefixes (required when mode is 'custom') |
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |

### hq sync narrow

Migrate a company's membership from syncMode='all' to 'shared' — dry-run previews diff, --apply performs the prune + flip

| Option | Description |
|---|---|
| `--dry-run` | Compute + print the narrow plan; write nothing (default if neither --dry-run nor --apply is passed) |
| `--apply` | Execute the narrow — delete clean orphans, flip sync-mode to 'shared' |
| `--yes` | Skip the interactive confirmation prompt on --apply |
| `--force` | On --apply, also remove locally-modified (dirty) files (destructive — no undo) |
| `--company <slug>` | Company slug (defaults to the active company in &lt;hq-root&gt;/.hq/config.json) |
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |

### hq sync manifest

Upload a file manifest for the sync reconciliation audit (personal or a company scope)

| Option | Description |
|---|---|
| `--scope <scope>` | 'personal' or a company slug (defaults to the active company, else personal) |
| `--full` | Send a fresh full baseline instead of a delta |
| `--print` | Build and print the chunks as JSON; upload nothing |
| `--json` | Print the pass outcome as one JSON line instead of a summary |
| `--respect-throttle` | Honour the 24h per-scope upload throttle instead of forcing a pass (for scheduled callers) |
| `--engine-owned` | The new sync engine owns this scope here: build the manifest from disk alone and mark the legacy journal as not its ledger |
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |

### hq sync held

Show uploads held because someone else was signed in on this computer

| Option | Description |
|---|---|
| `--json` | Print the held scopes as JSON |

### hq sync release-held

Confirm held files are yours and let sync upload them

| Option | Description |
|---|---|
| `--company <slug>` | Release only this company |
| `--personal` | Release only the personal vault |
| `--yes` | Do not ask for confirmation |
| `--json` | Print the result as JSON |

## hq cloud

Cloud commands — provision entities and manage cloud-backed companies

```
hq cloud [options] [command]
```

| Subcommand | Description |
|---|---|
| `provision [options] [command]` | Provision a cloud-backed entity (entity + bucket + initial sync) |
| `provision company [options] <slug>` | Promote a local company to a cloud-backed entity (idempotent). Provisions the vault entity if missing, patches manifest.yaml, writes .hq/config.json, and triggers an initial sync. |
| `retire [options] [command]` | Soft-tombstone a cloud-backed company (owner only) |
| `retire company [options] <slug>` | Soft-tombstone a cloud company so `hq cloud demote company` can run. Does not delete vault files or local folders. Prompts unless --yes. |
| `demote [options] [command]` | Demote a cloud-backed entity back to local-only |
| `demote company [options] <slug>` | Demote a cloud-backed company to local-only after the cloud entity has been soft-tombstoned (`hq cloud retire company` or hq-console). Removes .hq/config.json, flips company.yaml `cloud: false`, and strips the manifest cloud refs. |

## hq team-sync

Pull latest team content for all joined teams

```
hq team-sync [options]
```

| Option | Description |
|---|---|
| `--team <slug>` | Sync only a specific team by slug |
| `--dry-run` | Show what would be synced without making changes |

## hq login

Authenticate with HQ via Cognito

```
hq login [options]
```

| Option | Description |
|---|---|
| `--provider <provider>` | OAuth provider to use: google, microsoft, or picker |
| `--no-browser` | Print the sign-in URL without opening a browser |

## hq logout

Log out and clear cached credentials

```
hq logout [options]
```

## hq whoami

Show the currently authenticated user

```
hq whoami [options]
```

| Option | Description |
|---|---|
| `--json` | Output identity metadata as JSON (never tokens) |
| `--company <slug>` | Also report this company's billing and usage notice |

## hq link

Link this folder (or its git remote) to an HQ company

```
hq link [options] [company]
```

| Option | Description |
|---|---|
| `--path <dir>` | Folder to link (default: current directory) |
| `--list` | Print every linked folder |
| `--json` | Print JSON output |

## hq unlink

Remove the HQ company link for this folder

```
hq unlink [options]
```

| Option | Description |
|---|---|
| `--path <dir>` | Folder to unlink (default: current directory) |

## hq uninstall

Remove the HQ global install from an agent runtime (use with --global)

```
hq uninstall [options]
```

| Option | Description |
|---|---|
| `--global` | Reverse `hq install --global` |
| `--runtime <runtime>` | Runtime to uninstall from (claude \| codex) Default: `"claude"`. |
| `--dry-run` | Print what would change without writing |
| `--hq-root <dir>` | HQ checkout (only needed when install state is missing) |

## hq resolve-company

Print the HQ company linked to this folder (never guesses)

```
hq resolve-company [options]
```

| Option | Description |
|---|---|
| `--path <dir>` | Folder to resolve (default: current directory) |
| `--json` | Print JSON output |

## hq provider

Launch supported AI provider CLIs

```
hq provider [options] [command]
```

| Subcommand | Description |
|---|---|
| `launch [options] <name> [args...]` | Run a noninteractive Claude Code or Codex command with sign-in guidance |

## hq version

Show HQ, CLI, and latest hq-core versions

```
hq version [options]
```

| Option | Description |
|---|---|
| `--json` | Output the same payload as JSON |

## hq fingerprint

Print this session's HQ fingerprint, or resolve a fingerprint to its session

```
hq fingerprint [options] [command] [value]
```

| Option | Description |
|---|---|
| `--json` | output JSON |

| Subcommand | Description |
|---|---|
| `self [options]` | Print the fingerprint for the current HQ session |

## hq capture

Record your screen with HQ Capture: start, record, stop, status and wait

```
hq capture [options] [command]
```

| Subcommand | Description |
|---|---|
| `doctor [args...]` | Check this Mac can build and run HQ Capture |
| `build [args...]` | Build HQ Capture if missing or out of date ([--force]) |
| `start [args...]` | Open HQ Capture for the session's company ([--company &lt;slug&gt;] [--record]) |
| `record [args...]` | Start recording in the open HQ Capture, as if Start was pressed |
| `status [args...]` | Print HQ Capture's current status as JSON |
| `wait [args...]` | Wait until the recording is saved, failed or closed ([--timeout &lt;seconds&gt;]) |
| `stop [args...]` | Stop HQ Capture, saving a recording in progress |
| `run [args...]` | Run an agent command on a saved recording (&lt;mode&gt; &lt;package&gt; [args]) |
| `resume [args...]` | Check a pasted resume prompt and print its package (&lt;prompt&gt;) |

## hq auth

Manage the local HQ Cognito session

```
hq auth [options] [command]
```

| Subcommand | Description |
|---|---|
| `machine-session [options]` | Write the existing machine identity session to a private file, or to a pipe with --output - |
| `login [options]` | Sign in to HQ — opens the Cognito Hosted UI and caches tokens locally |
| `logout [options]` | Clear the cached HQ Cognito session |
| `keychain [options]` | Show or retry HQ's access to your sign-in in the macOS Keychain |
| `refresh [options]` | Ensure a valid cached Cognito session (refresh only if expiring; no-op if already valid) |
| `status [options]` | Show whether a valid HQ session is cached |

## hq secrets

Manage secrets in HQ vault (SSM Parameter Store)

```
hq secrets [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |
| `--personal` | Operate on the caller's personal vault (no sharing) |

| Subcommand | Description |
|---|---|
| `set [options] <name>` | Create or update a secret |
| `get [options] <name>` | Get a secret's metadata (use --reveal for value) |
| `exists [options] <name>` | Check whether a secret exists (HEAD; exit 0=present, 1=absent, 2=error) |
| `list [options]` | List all secrets for the company (including nested path-based names) |
| `policy [options] [command]` | View or update secret access policy |
| `policy get [options] <path>` | Show the policy for a secret path |
| `policy set [options] <path>` | Set the policy for a secret path |
| `script [options] [command]` | Manage approved scripts for script-locked secrets |
| `script approve [options] <path>` | Approve a script for a secret path. Each --id holds one approval: approving an id that is already approved for a different path or hash fails unless --replace is given. To let the same script run from several machines, approve one HQ-relative --remote-path instead of one absolute path per machine. |
| `script revoke [options] <path>` | Revoke an approved script from a secret path |
| `script list [options] <path>` | List approved scripts for a secret path |
| `delete [options] <name>` | Delete a secret |
| `sandbox [options]` | Run a command in the hosted sandbox with named secrets injected as env vars; open egress, secrets never touch this machine |
| `exec [options]` | Run a command with secrets injected as env vars |
| `env [options]` | Print 'export KEY=VALUE' lines suitable for: source &lt;(hq secrets env --only K1,K2) |
| `generate-link [options] <name>` | Generate a one-time link for someone to submit a secret value |
| `share [options] <path>` | Share a secret with an email address, group, fleet agent (agt_…), company Outpost (out_…), or the entire company (@all) |
| `unshare [options] <path>` | Remove a grant from a secret |
| `acl [options] <path>` | Show the ACL (access control list) for a secret path |
| `cache [options] [command]` | Manage the local secrets cache |
| `cache clear [options]` | Clear all cached secrets |

## hq db

Vault databases — local SQLite per company and HQ-managed remote Postgres-class DBs

```
hq db [options] [command]
```

| Subcommand | Description |
|---|---|
| `status [options]` | Show company local/remote status or your personal database status |
| `sql [options] [sql...]` | Run read-only SQL against a company or personal database; use --write for changes |
| `migrate [options]` | Apply pending vault text migrations (companies/{co}/db/migrations/*.sql) to the local DB |
| `provision [options]` | Create a company remote database or your personal database |
| `usage [options]` | Show this month's remote database usage. With --app: included, used, overage, ceiling and the estimated charge for one app |
| `dump [options]` | Export an app's remote database schema and data to a SQL file |
| `destroy [options]` | Permanently delete an app's remote database (owners and admins only; cannot be undone) |

## hq api-keys

Manage vault API keys for CI and automation

```
hq api-keys [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `create [options]` | Create a new API key (vault secrets and/or scoped deploy via --deploy-app) |
| `list [options]` | List API keys for a company |
| `revoke [options] <keyId>` | Revoke an API key |

## hq run

Load secrets from .env.schema and run a command with them injected

```
hq run [options]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (overrides @hqCompany in schema) |
| `--schema <path>` | Explicit schema path (skips walk-up discovery) |
| `--script <path>` | Attach local script identity for script-locked secrets |
| `--script-id <id>` | Stable script identifier approved by policy |
| `--check` | Resolve schema and validate vars without executing the command |

## hq groups

Manage groups in HQ vault

```
hq groups [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `create [options] <groupId>` | Create a new group |
| `delete [options] <groupId>` | Delete a group |
| `add [options] <groupId> <principal>` | Add a person, agent, or company Outpost to a group (principal: email, personUid, agentUid, or out_ Outpost id) |
| `remove [options] <groupId> <principal>` | Remove a person, agent, or company Outpost from a group (principal: email, personUid, agentUid, or out_ Outpost id) |
| `list [options]` | List all groups in the company |
| `members [options] <groupId>` | List members of a group |

## hq workers

Discover and share HQ workers

```
hq workers [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `list [options]` | List workers you can access (public + your active company's) |
| `share [options] <workerId>` | Grant a teammate, group, or @all access to a company worker |

## hq group-grants

Grant a group's access to another company (cross-company), and revoke or inspect those grants

```
hq group-grants [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Source company slug (the company that owns the group; resolves to sourceCompanyUid) |

| Subcommand | Description |
|---|---|
| `grant [options] <groupId> <targetCompany>` | Grant a group (from the source company) access to &lt;targetCompany&gt; at a role |
| `revoke [options] <groupId> <targetCompany>` | Revoke a group's grant on &lt;targetCompany&gt; |
| `outbound [options]` | List grants a source-company group holds on other companies; requires --group &lt;groupId&gt;. |
| `inbound [options]` | List grants other companies' groups hold on this company |

## hq files

Manage file access controls in HQ vault. A trailing folder slash (foo/) is a private folder; the quoted glob 'foo/*' shares all children, and a quoted 'clients/*/reports' shares that folder under every client.

```
hq files [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `share [options] [paths...]` | Share file paths. foo/ is a private folder (children stay creator-only); quote the shared-folder glob 'foo/*', or a one-folder wildcard such as 'clients/*/reports', so the shell passes it literally. Without --with: mint a share-session URL and open it in the browser. With --with: grant access directly to a person, group, or @all. |
| `unshare [options] <prefix>` | Remove a named file access grant, or remove an empty ACL row or grantee-less entries without --with. With --with, a bare name such as 'knowledge' first removes the exact 'knowledge' grant (rows from older `hq files share` versions) and, when none matches, the folder-glob 'knowledge/*' grant. Without --with, the prefix is used exactly as typed: pass 'knowledge/*' (quoted) to clean up the folder-glob row. |
| `acl [options] <prefix>` | Show the ACL (access control list) for a file prefix. foo/ is a private folder whose children are creator-only; the quoted glob 'foo/*' is shared. |
| `delete [options] <prefix>` | Delete vault objects by exact key or bounded prefix. A trailing slash expands recursively; use * for an explicit wildcard prefix. Always previews the exact count first; prompts for confirmation unless --yes. Use --personal to target your own personal vault instead of a company. |
| `versions [options] <path>` | List prior content versions and delete markers for one exact vault key. Restore a listed version with restore --version-id &lt;id&gt;. Use --personal for your personal vault. |
| `restore [options] <path>` | Restore a prior version with --version-id or undelete an exact vault key. Prompts before overwriting unless --yes. Use --personal for your personal vault. |
| `trash [options]` | List deleted vault keys retained as tombstones. Use --personal for your personal vault. |
| `browse [options] [path]` | List vault objects under [path] without syncing them locally. Private-folder rows (foo/) are labelled and do not imply child access; their children are creator-only. Uses the browse-vend path (role-bypass allowed). Pass --personal to browse the caller's personal vault; otherwise [path] must start with companies/&lt;slug&gt;/. |
| `cat [options] <path>` | Stream a single vault object to stdout (or --out &lt;file&gt;) without syncing it. Uses the browse-vend path. Pass --personal to read from the caller's personal vault. |
| `shared-with-me [options]` | List the files/prefixes explicitly shared with you. Private folders (foo/) expose only the folder; children are creator-only. Omit --company to roll up across every company you're a member of. Pure read — no download, no credentials vended. Owner/admin role-bypass access is NOT listed (only explicit grants). |
| `search [options] <query>` | Search vault object keys (case-insensitive path/name match) under a company without downloading. Requires --company (or --personal). Content search is not supported in v1. |
| `get [options] <path>` | Download (materialize) a vault file or prefix into local HQ on demand. Default writes in place under &lt;hqRoot&gt;/companies/&lt;slug&gt;/&lt;path&gt; and registers a pin so a scoped sync (mode shared\|custom) won't prune it. Use --into to write elsewhere (no pin). Company mode only. |

## hq access

Tell whether a vault file exists and whether you can read it. Never a bare not-found. Takes one or more paths or queries. Exit codes: 0 local/not-synced, 2 never-existed, 3 no-access, 4 ambiguous.

```
hq access [options] [vault-path...]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug |
| `--as <person>` | Check a person's access (email, prs_, or agt_ uid; self or owner/admin) |
| `--json` | Print a single JSON object (an array for several paths) |
| `--stdin` | Read more paths from stdin, one per line |
| `--no-fix` | Diagnose only: do not fetch, pin, or repair sync |
| `--yes` | Answer the one send-confirmation yes (hosts must pass this explicitly) |
| `--hq-root <path>` | Local HQ tree root (default: &lt;runtime-path&gt;) |

## hq storage

See how much space HQ backups use and delete old ones

```
hq storage [options] [command]
```

| Subcommand | Description |
|---|---|
| `status [options]` | Show local autosave history and cloud file history sizes |
| `big-files [options]` | Show big files that could move to HQ cloud (the slow scan `status` skips; read-only) |
| `prune [options]` | Delete local autosave history and old cloud file versions before a date |
| `offload [options]` | Move big files to HQ cloud storage and leave links behind (old versions in history; with --current, idle working files to the vault that owns them) |
| `fetch [options] [path]` | Download a file moved to HQ cloud storage, check it, and put it back in place |

## hq skill

Create, stage, promote, and discuss company skills

```
hq skill [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (defaults to the active company) |
| `--hq-root <path>` | Local HQ root Default: `"<runtime-path>"`. |

| Subcommand | Description |
|---|---|
| `create [options] <slug>` | Register, stamp, surface, and sync a company skill |
| `register [options] <slug>` | Register a company skill to a proposal-lane stamped file without writing the canonical tree |
| `promote [options] <slug>` | Copy independently-cleared stamped bytes into the canonical skill path after SHA-256 and skill_uid checks |
| `propose [options] <target>` | Post a comment-only improvement for a skill |
| `delete [options] <target>` | Delete a company skill and all of its files for everyone (skl_… uid, SKILL.md path, or skill slug). Prompts for confirmation unless --yes. |

## hq members

Manage company memberships and invites

```
hq members [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `promote [options] <target> <newRole>` | Change a member's role (owner\|admin\|member\|guest) — promotes OR demotes. &lt;target&gt; may be an email, a prs_ personUid, or a full membership key. Owner-or-admin only; setting a target to owner (or changing an owner) is owner-only. Server-enforced. |
| `invite [options] <target>` | Invite a person or fleet agent to the company. People: email or prs_…. Agents: agt_… or agt-…@agents.getindigo.ai (member\|admin; host keeps billing, no double charge). |
| `list [options]` | List the company's active members (use --pending for pending invites) |
| `remove [options] <target>` | Remove an active member. Ends membership so company-wide grants no longer apply, and drops that person's file and secret grants. Accepts an email, prs_ personUid, agt_ agentUid, or full membership key. |
| `revoke [options] <target>` | Revoke a pending invite. For an active member, use `hq members remove` instead. Accepts an email, personUid, full membershipKey, or legacy inviteToken. |

## hq people

List, search, and resolve a company's people (from companies/&lt;co&gt;/people)

```
hq people [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug to scope to (defaults to the active company) |

| Subcommand | Description |
|---|---|
| `list [options]` | List all people recorded for the company |
| `search [options] <keyword>` | Keyword search over people names and emails |
| `resolve [options] <name>` | Resolve a person name to their email address |

## hq dm

Send and read direct messages, and manage connection requests. Messages sent from a person login are always tagged for people. When an agent or bot sends, messages to an agent, a channel or a group are tagged for agents and folded away from people by default. Pass --for-human or --audience human to tag a message for people; --audience agent|both is for agents and bots only.

```
hq dm [options] [command]
```

| Subcommand | Description |
|---|---|
| `forward [options] <eventId>` | Forward a DM or channel message through the existing send routes. |
| `inbox [options]` | List your recent incoming direct messages. |
| `thread [options] <person>` | Show your two-way conversation with a person (email, personUid, or agentUid). Reads oldest-first and marks their messages read unless --no-ack. |
| `channel [options] <target>` | Show recent messages in a DM channel or group DM — by name, #name, or a channel id from `hq channels`. Roots print their eventId; replies indent under their root. --json is the raw oldest-first array (ungrouped). |
| `requests [options]` | List your pending incoming connection requests. |
| `accept [options] <person>` | Accept a pending connection request (by requester email, personUid, or pairKey from `hq dm requests`). Their held message is then delivered. |
| `decline [options] <person>` | Decline a pending connection request (by requester email, personUid, or pairKey from `hq dm requests`). |
| `block [options] <person>` | Block a person so they can't send you further requests (by requester email, personUid, or pairKey from `hq dm requests`). |

## hq channels

List the DM channels you're in (name them with `hq dm <name> "…"`).

```
hq channels [options] [command]
```

| Subcommand | Description |
|---|---|
| `list [options]` | List your DM channels — named channels and group DMs. |
| `changes [options]` | Print the channels that changed since a feed cursor, as JSON (no cursor → full snapshot). |
| `members [options] <channel>` | Print the members of one of your DM channels. |
| `delete [options] <channel>` | Delete a channel you own, including its messages. Group DMs cannot be deleted. |

## hq onboard

Provision an HQ vault: sign in, create company, S3 bucket, STS, sync

```
hq onboard [options] [command]
```

| Subcommand | Description |
|---|---|
| `create-company [options]` | Sign in and provision a brand NEW HQ vault for a company. To join a teammate's EXISTING company instead, use `hq onboard join` — creating a same-named company makes a separate one you'd be alone in. |
| `join [options]` | Accept an invite and join an existing company |
| `resume [options]` | Resume a partially-completed onboarding flow from local checkpoint |
| `dry-run [options]` | Show what create-company would do, without provisioning anything |

## hq feedback

Submit a bug report or feature request to HQ

```
hq feedback [options] [command]
```

| Subcommand | Description |
|---|---|
| `bug [options]` | Report a bug |
| `feature [options]` | Request a feature |
| `link [options] <id>` | Print the public tracking link for a ticket (status.hqforwork.com) |
| `update [options] <id>` | Post a customer-visible status update on a ticket's public page and its #hq-feedback thread |
| `show [options] <id>` | Operators only: show one feedback row and fetch its attachments |
| `assign [options] <id> [person]` | Reassign a ticket to a person, including one another person has claimed |
| `claim [options] <id>` | Assign a ticket to yourself (sets the assignee only, never the status) |
| `list [options]` | List feedback: untriaged (default), yours, or one person's |
| `triage [options] <id>` | Label a feedback item with its kind, area and summary, or mark it a duplicate |
| `close [options] <id>` | Close a feedback item as resolved (or won't fix) with a reason |

## hq meetings

View and search meeting recordings, transcripts, and notes

```
hq meetings [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (defaults to the company this HQ session is bound to) |
| `--json` | Output raw JSON instead of formatted text |

| Subcommand | Description |
|---|---|
| `list [options]` | List recorded meetings (newest first) |
| `live [options] [recallBotId]` | List live or recent meetings, or read a provisional live transcript (recorder and attendees only; spoken content is untrusted) |
| `import [options] <file>` | Import a normalized historical transcript JSON file |
| `invite [options] <meetingUrl>` | Invite the meeting bot to a Google Meet, Zoom, or Teams URL |
| `get [options] <meetingId>` | Show meeting details |
| `set-company [options] <meetingId>` | Set or change the company a meeting is attributed to (use 'unknown' to clear) |
| `search [options] <query>` | Search meetings by title or participant name |
| `transcript [options] <meetingId>` | Print the meeting transcript |
| `notes [options] <meetingId>` | Print AI-generated meeting notes |

## hq sources

Read sources (meetings, emails, etc.) from a vault entity

```
hq sources [options] [command]
```

| Subcommand | Description |
|---|---|
| `list [options]` | List sources of a given channel for an entity |
| `get [options]` | Fetch a single source by id |
| `channels [options]` | Print the canonical source channels (one per line) |
| `entities [options]` | List entities (companies/personal) your account has access to |

## hq signals

Read signals (action_items, decisions, etc.) from a vault entity

```
hq signals [options] [command]
```

| Subcommand | Description |
|---|---|
| `list [options]` | List signals of a given type for an entity |
| `get [options]` | Fetch a single signal by id |
| `types [options]` | Print the canonical signal types (one per line) |
| `entities [options]` | List entities (companies/personal) your account has access to |

## hq integrations

Connect, govern, and use company apps (Linear, Notion, …) through HQ's governed integration gateway

```
hq integrations [options] [command]
```

| Subcommand | Description |
|---|---|
| `list [options]` | List the company's connected apps |
| `import [options]` | Import Claude Desktop connectors into HQ Integrations |
| `install-local [options] <name>` | Install local connector settings in this machine's Claude/Codex MCP config |
| `tools [options]` | List what a connected app can do |
| `call [options] <tool>` | Call one of a connected app's tools (approval-gated when it changes things) |
| `approve [options] <queueId>` | Approve a queued call — it executes exactly once (owner only) |
| `reject [options] <queueId>` | Reject a queued call (owner only) |
| `catalog [options] [query]` | Browse or search apps you can connect |
| `inspect [options] <app>` | Show what an app exposes before you connect it |
| `discover [options] <docsUrl>` | Find a connectable server from an app's documentation page |
| `connect [options] [app]` | Connect an app — by domain, catalog entry, docs page, or MCP URL |
| `reconnect [options] [app]` | Re-authenticate a connected app; use --connect to re-add a revoked app |
| `show [options] [app]` | Show one connected app in full |
| `policy [options] [app]` | Show or change whether an app's changes need approval |
| `read-safe [options] <tool>` | Mark a read-only tool as safe to run without approval (owner only) |
| `grants [options] [app]` | Show who is authorized to run an app's change-making tools |
| `grant [options] [app]` | Authorize someone to run one of an app's change-making tools |
| `ungrant [options] [app]` | Remove a per-tool authorization, leaving only the app's default access |
| `access [options] [app]` | Show who in the company can use a connected app |
| `share [options] [app]` | Let someone in the company use a connected app |
| `unshare [options] [app]` | Stop someone from using a connected app |
| `audit [options]` | Recent activity across the company's connected apps |
| `pending [options]` | Calls that were queued for an owner's approval |
| `disconnect [options] [app]` | Disconnect an app and delete its stored credentials |
| `purge [options] [app]` | Permanently remove a revoked connection from the list (owner only) |
| `slack [options] [command]` | Connect your own Slack account to HQ (stored in your personal vault) |
| `slack connect [options]` | Get Slack's sign-in link for your account; the sign-in finishes on HQ |
| `slack accounts [options]` | List your connected Slack accounts |

## hq import

Import existing AI context (Claude Code, Codex, repos) into HQ

```
hq import [options] [command]
```

| Subcommand | Description |
|---|---|
| `scan [options]` | Scan this machine for AI context (sessions, repos, companies, projects); local only |

## hq scan

Local, offline scanners

```
hq scan [options] [command]
```

| Subcommand | Description |
|---|---|
| `secrets [options] [files...]` | Scan staged changes (or files) for secrets; exits 1 on a finding |

## hq reindex

Surface namespaced skills, materialize legacy knowledge repos, regenerate the workers registry, and trust HQ hooks for Codex, Grok, and Claude Code

Aliases: `master-sync`

```
hq reindex [options]
```

| Option | Description |
|---|---|
| `--repo-root <path>` | HQ root to operate on (defaults to the current directory) |
| `--from-hook` | Invoked from a Claude/Codex lifecycle hook: never wait on the per-root operation lock — if a sync/rescue holds it, skip this reindex instead of blocking the session (equivalent to --lock-timeout 0) |
| `--lock-timeout <seconds>` | Bound the wait for the per-root operation lock (seconds). 0 = refuse immediately; omitted = wait indefinitely (the interactive default). --from-hook implies 0; an explicit --lock-timeout wins. |

## hq rescue

Re-sync your HQ core to the latest release, preserving your local edits (drift)

```
hq rescue [options]
```

| Option | Description |
|---|---|
| `--hq-root <path>` | HQ root to operate on (defaults to auto-detected root) |
| `--ref <ref>` | Target tag/branch (default: latest hq-core release) |
| `--source <repo>` | Source repo (default: indigoai-us/hq-core) |
| `--staging` | Use the staging channel (indigoai-us/hq-core-staging@main) |
| `--floor-sha <sha>` | Pin the three-way history floor to a 40-char commit SHA |
| `--paths <list>` | Comma-separated top-level paths to narrow the rescue to |
| `--check` | Plan only — classify and report, change nothing on disk (--dry-run) |
| `-y, --yes` | Skip the confirmation prompt |
| `--no-backup` | Skip the pre-op safety snapshot under ~/.hq/backups |
| `--no-self-update` | Skip updating hq-cli itself to the latest version first |
| `--cloud-update` | Cloud-update mode |

## hq mcp

MCP pack observability (read-only) across Claude + Codex

```
hq mcp [options] [command]
```

| Subcommand | Description |
|---|---|
| `serve [options]` | Run the HQ stdio MCP server; every tool call is answered by hqd (`hq daemon status`) |
| `login [options]` | Sign in to the hosted HQ MCP connector with browser OAuth |
| `status [options]` | Show installed MCP packs/servers and their health in BOTH Claude and Codex (PARTIAL/DRIFT flagged; secrets redacted) |
| `capabilities [options]` | Advertise that this hq-cli supports contributes.mcp (dual-runtime Claude+Codex registration) |

## hq repo

Register code repos with HQ (repos/ and companies/manifest.yaml)

```
hq repo [options] [command]
```

| Subcommand | Description |
|---|---|
| `add [options] <path>` | Link a git checkout into repos/&lt;private\|public&gt;/&lt;name&gt; and list it under companies.&lt;slug&gt;.repos in companies/manifest.yaml. A checkout already directly under repos/private or repos/public is registered in place. |

## hq crm

Read and upsert canonical CRM entities in a company vault

```
hq crm [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `entity [options] [command]` | CRM entity operations |
| `entity list [options]` | List one CRM entity page as JSON; continue with nextCursor until null |
| `entity get [options] <id>` | Read a canonical CRM entity as JSON |
| `entity upsert [options]` | Create or update a canonical CRM entity (POST /crm/entities). Use --type/--name (+ optional external-id flags) or --json &lt;file\|-&gt; to pass a full entity/array. |

## hq company

Company-level settings

```
hq company [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `transfer [options] [command]` | Transfer company ownership. Two-party: `initiate` nominates, and ownership moves only when the nominee runs `accept`. |
| `transfer initiate [options]` | Nominate an active member as the new owner. Does NOT transfer ownership — the nominee must accept. Prompts for confirmation unless --yes. |
| `transfer accept [options]` | Accept a pending nomination and become the owner. This is the step that actually moves ownership. Prompts for confirmation unless --yes. |
| `transfer decline [options]` | Decline a pending nomination (nominee only). |
| `transfer cancel [options]` | Cancel a nomination you initiated (initiating owner only). |
| `transfer status [options]` | Show the current nomination and the company's transfer history. |
| `rename [options] <new-name>` | Rename a cloud-backed company display name |
| `settings [options] [command]` | Per-company settings (owner-only) |
| `settings set [options]` | Set per-company settings (PUT /company-settings). Require at least one of --crm-enabled / --ontology-enabled / --accounting-enabled / --checkpoint-gate-enabled / --work-registry-enabled / --work-mesh-live-enabled. |
| `settings get [options]` | Show whether the checkpoint Stop gate is on for this company (GET /company-settings/checkpoint-gate; any member may read it) and, for an owner or admin, the two work tracking switches (GET /company-settings). |

## hq agents

Manage a company's cloud (fleet) agents

```
hq agents [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `models [options]` | List the model catalog available to cloud agents |
| `message [options] <agent> <message...>` | Send a message to an agent and wait for its reply |
| `thread [options] <agent>` | Show your recent conversation with an agent |
| `terminal [options] <agent>` | Open an interactive terminal on an agent's box — a real TTY over SSM Session Manager (no SSH, no local AWS credentials). Owner/admin only; requires the AWS session-manager-plugin installed locally. With --forward, tunnels a port on the box instead. |
| `provision [options] <name>` | Provision a new cloud agent (company-specific monthly price shown before creation) |
| `login-code [options] <agentUid> [code]` | Submit a Claude subscription sign-in code for an agent |
| `list [options]` | List the company's agents |
| `status [options] <agent>` | Show an agent's setup state and runtime detail |
| `rename [options] <agentUid> <name>` | Set an agent's display name |
| `set [options] <agentUid>` | Update an agent's profile (name / title / description) |
| `config [options] <agentUid>` | Update an agent's runtime config (model / reasoning effort / service tier), or migrate its brain/runtime provider with --provider (DESTRUCTIVE: terminates + reprovisions the box) |
| `start [options] <agentUid>` | Start an agent's box |
| `stop [options] <agentUid>` | Stop an agent's box |
| `retry [options] <agentUid>` | Resume an agent's setup from the first non-done step |
| `rm [options] <agentUid>` | Deprovision (permanently tear down) an agent |
| `rotate [options] <agentUid>` | Issue a fresh enrollment code for an external agent (old secret + host key stop minting) |
| `revoke [options] <agentUid>` | Revoke an external agent: disable its login and drop it from the team |
| `jobs [options] [command]` | List, pause, resume, or cancel an agent's scheduled jobs |
| `jobs list [options] <agentUid>` | List an agent's scheduled jobs |
| `jobs pause [options] <agentUid> <jobId>` | Pause a job's schedule (reversible) |
| `jobs resume [options] <agentUid> <jobId>` | Resume a paused job's schedule |
| `jobs cancel [options] <agentUid> <jobId>` | Cancel a job and delete its schedule |

## hq agent

Enroll and run this host as an external HQ agent

```
hq agent [options] [command]
```

| Subcommand | Description |
|---|---|
| `enroll [options] <code>` | Enroll this host as an external HQ agent using a one-time code |
| `kit [options] [command]` | Install, inspect, or run the external-agent background services |
| `kit install [options]` | Install the inbox and heartbeat services plus the skills directory |
| `kit status [options]` | Show whether each kit service is installed and running |
| `kit uninstall [options]` | Stop and remove the kit services (credentials and skills are kept) |
| `kit wake [options] [command]` | Wake this bot's own framework when HQ messages arrive (webhook URL or local command) |
| `kit run [options] <service>` | Run one kit service in the foreground (sync\|inbox\|heartbeat), or `all` to supervise every service in one process |
| `probe [options]` | Verify identity, vault access, presence, DMs and secrets; report to the console |
| `mcp [options]` | Serve HQ as a stdio MCP server for the bot framework (whoami, search, files, secrets-exec, dm, inbox, work-mesh) |
| `inbox [options] [command]` | List this agent's pending HQ messages (mirrored by the kit), or mark them handled |
| `inbox done [options] <ids...>` | Mark inbox items handled and ack them on the server |

## hq outposts

Manage personal and company HQ Outposts (EC2 boxes)

```
hq outposts [options] [command]
```

| Subcommand | Description |
|---|---|
| `provision [options]` | Provision a new Outpost ($80/month — requires --yes) |
| `list [options]` | List every Outpost you own, or a company's Outposts with --company |
| `status [options]` | Show live detail for one Outpost |
| `jobs [options] [command]` | Register, edit, pause, resume, delete, or run a job on a company Outpost |
| `jobs register [options]` | Register a company job and print the accepted revision |
| `jobs edit [options] <jobId>` | Change a company job. Omitted fields stay as they are. Requires --revision |
| `jobs pause [options] <jobId>` | Pause a company job |
| `jobs resume [options] <jobId>` | Resume a paused company job |
| `jobs delete [options] <jobId>` | Delete a company job (requires --yes) |
| `jobs run-now [options] <jobId>` | Run a company job once now |
| `jobs runs [options] <jobId>` | List recent runs of a company job and their outcomes (owner or admin) |
| `exec [options] <command...>` | Run a shell command on an Outpost and print its output (use -- before flags meant for the remote command). The command waits for the submitted job to finish. Use --wait-timeout-seconds to bound local waiting, or --detach to print the commandId and return immediately. |
| `exec-stage [options]` | Stage a file for an asynchronous Outpost command |
| `exec-submit [options] <command...>` | Submit an asynchronous shell command to an Outpost (returns immediately with commandId; shell budget defaults to 48h) |
| `exec-result [options]` | Fetch the result of an asynchronous Outpost command |
| `pull [options] <outpost> <remote-path> [local-path]` | Download one file from an Outpost through a short-lived download link (for files too large for exec output). &lt;outpost&gt; is the Outpost id (`primary` for your first box). The remote path must be inside the Outpost user's home or HQ dir; relative and ~ paths start at the home dir. The file is saved to [local-path], or to the remote file name in the current directory. |
| `terminal [options]` | Open an interactive terminal on an Outpost — a real TTY over SSM Session Manager (no SSH, no local AWS credentials). Requires the AWS session-manager-plugin installed locally. With --forward, tunnels a port on the box to your machine instead of opening a shell. |
| `refresh-config [options]` | Re-apply the server's job runner configuration to the company Outpost (owner or admin) |
| `codex-enable [options]` | Enable (or retry) Codex on an Outpost |
| `login [options]` | Request a fresh login URL for an Outpost |
| `login-code [options] <code>` | Submit the Claude sign-in code for an Outpost that is awaiting login |
| `destroy [options]` | Tear down (permanently destroy) an Outpost |

## hq billing

Inspect billing and mint a card-capture link

```
hq billing [options] [command]
```

| Option | Description |
|---|---|
| `--company <slug>` | Company slug (resolves to companyUid) |

| Subcommand | Description |
|---|---|
| `status [options]` | Show subscription status and whether a card is on file |
| `checkout [options]` | Mint a Stripe card-capture link (shareable) to add a card |
| `upgrade [options]` | Open the switch to usage pricing for a company on an earlier plan (usage-pricing companies have nothing to change) |
| `sponsor [options] [command]` | Ask a company to cover your personal HQ plan, or answer a request |
| `sponsor request [options] <company>` | Ask a company to cover your personal HQ plan |
| `sponsor list [options]` | Show sponsorship requests — the company's queue, or your own |
| `sponsor approve [options] <id>` | Say yes — put someone's personal plan on the company bill |
| `sponsor decline [options] <id>` | Say no to a plan sponsorship request |
| `sponsor revoke [options] <id>` | End a sponsorship the company is currently paying for |
| `sponsor withdraw [options] <id>` | Take back a sponsorship request you made |
| `sponsor grant [options] [person]` | Admin: put a member's personal plan on the company bill, no request needed |
| `sponsor ungrant [options] <person>` | Admin: take a member's personal plan off the company bill |
| `usage [options]` | Show this month's usage, projected bill, included usage left and what drives it (read-only) |

## hq vault

Manage HQ vault settings

```
hq vault [options] [command]
```

| Subcommand | Description |
|---|---|
| `retention [options] [command]` | Get or set the default retention for future vault object versions |
| `retention get [options]` | Show the vault's default retention in days |
| `retention set [options] <days>` | Set the vault's default retention in days (1-30) |

## hq search

Search the local HQ qmd index

```
hq search [options] [command] [query...]
```

| Option | Description |
|---|---|
| `--mode <mode>` | Search mode: keyword, semantic, or hybrid Default: `"keyword"`. |
| `-c, --collection <collection>` | Restrict search to a collection |
| `-n, --count <count>` | Maximum result count |
| `--json` | Request machine-readable qmd output |

| Subcommand | Description |
|---|---|
| `get [options] <document>` | Retrieve a qmd document by path or document id |

## hq library

Company media library (.hqcloud asset placeholders)

```
hq library [options] [command]
```

| Subcommand | Description |
|---|---|
| `search [options] [query...]` | Search library assets in the cloud, falling back to the local index when offline |
| `add [options] <sources...>` | Upload files or URLs to the company vault and add .hqcloud placeholders to the library |
| `tag [options] <placeholder>` | Add or remove tags on a library placeholder |
| `ls [options] [dir]` | List library placeholders in a folder (default: companies/) |
| `describe [options] <placeholder>` | Re-run the AI description and suggested tags for a library image or video |
| `fetch [options] <placeholder>` | Download a library asset next to its placeholder (wraps hq storage fetch) |
| `link [options] <target>` | Mint a short-lived download URL for a library asset (needs files:read) |
| `rm [options] <targets...>` | Remove library assets: the local original (if fetched), the placeholder, and its vault copy. Keeps the shared blob unless --purge. Previews and asks first unless --yes |

## hq index

Manage the local HQ search index

```
hq index [options] [command]
```

| Subcommand | Description |
|---|---|
| `sync [options]` | Reconcile collections and incrementally update the qmd index |
| `collections [options]` | Show expected and registered qmd collections |
| `background [options]` | Run a detached, single-flight qmd cleanup and reindex |
| `status [options]` | Show qmd binary, collection, and index status |

## hq capacity

Show provider capacity from the local ledger (read-only; enable, login, and ingest write to it)

```
hq capacity [options] [command]
```

| Option | Description |
|---|---|
| `--json` | Print now.json plus schemaVersion |
| `--widget` | Print an HTML usage card for chat |

| Subcommand | Description |
|---|---|
| `history [options]` | Print readings from the ledger event log |
| `doctor [options]` | Report last success, pinned versus installed CLI versions, and parser failures |
| `route [options]` | Pick the account with the most capacity for a new lane (read-only; port of boss-route) |
| `enable [options]` | Create the ledger directory and mark the collector on |
| `disable [options]` | Mark the collector off without deleting readings |
| `ingest [options] [command]` | Record a provider capacity reading |
| `ingest claude-statusline [options]` | Read one Claude Code statusline JSON payload from stdin and record its rate limits |
| `ingest refusal [options]` | Record a classified provider rate-limit refusal as an exhausted reading |
| `login [options] [provider]` | Show signed-in accounts, or sign into a provider through hq lanes accounts login |
| `accounts [options] [command]` | List provider accounts from the registry and default homes |
| `accounts rename [options] <provider> <id> <new-id>` | Rename a registry account id. Does not touch the provider credential |
| `accounts remove [options] <provider> <id>` | Forget a registry account. Does not delete its home unless --delete-home is set |

## hq doctor

Verify HQ hook wiring, runtimes, and connection health (read-only; integrations uses one control-plane inventory read).

```
hq doctor [options]
```

| Option | Description |
|---|---|
| `--json` | Emit the machine-readable JSON document (no colour). |
| `--verbose` | Also print every PASS result in text output. |
| `--no-color` | Disable ANSI colour even on a TTY. |
| `--session-id <id>` | Scope the runtime probe's ledger check to this exact session. |
| `--deep-test` | Also fire pure-guard hooks through the real gate under all three profiles (sandboxed). |
| `--live-runtimes` | Also probe each installed AI CLI (claude, codex, grok) with a one-line prompt to verify login and subscription (networked; uses your subscriptions). |
| `--company <slug>` | Company slug for integrations checks (otherwise resolves your single active company). |
| `--only <families>` | Run only these comma-separated check families (e.g. hooks). Unknown names are rejected; --json then records the scope. |
| `--fix` | Apply the allowlisted safe repairs (backs up first; read-only without this flag). |
| `--sweep-temp-homes` | Delete idle temp homes (90+ minutes untouched, not in use): tmp.* folders holding .rustup or .cargo, and hq-temp-home.* folders left by the wrapper. Reports GB freed. |
| `--dry-run` | With --sweep-temp-homes, list what would be removed and delete nothing. |
| `--yes` | Skip the interactive --fix confirmation (non-interactive use). |
| `--force` | Let --fix run despite uncommitted changes under .claude/, .codex/, or .grok/. |

## hq mesh

Work mesh — register project work, report progress, and warm ~/.hq/work-mesh/cache

```
hq mesh [options] [command]
```

| Subcommand | Description |
|---|---|
| `check [options]` | Show active work-mesh threads for a company/project |
| `start [options]` | Ensure a project thread exists and claim/report start |
| `progress [options]` | Append a progress event to the project thread |
| `blocked [options]` | Append a blocked event to the project thread |
| `done [options]` | Mark the project thread done |
| `note [options]` | Append a note with no status change |
| `story [options]` | PATCH one Board story status and/or assignee |
| `claim [options]` | Assign a story to yourself and move it to in_progress |
| `overlap [options]` | List other sessions working on the same story, branch, or files |
| `suggest [options]` | Rank teammates and agents to pick up a story |
| `roster [options]` | Show each member's daemon and session reporting state |
| `project [options] [command]` | Set a project Board view or register its project channel |
| `project set [options] <projectId>` | PUT the project Board view from flags or a PRD JSON file |
| `project ensure [options] <projectId>` | Idempotently register a PRD on the Board and verify the view |
| `project reconcile [options] <projectId>` | Read the project Board and report drift from a PRD ledger |
| `project register [options] <projectId>` | Register an existing Board and bind its project channel; use project ensure to create or repair a Board |
| `project reassign [options] <projectId>` | Move project ownership to another person or agent |
| `project archive [options] <projectId>` | Archive a Board (for example a duplicate); keeps stories, folder, channel, members and history |
| `project complete [options] <projectId>` | Mark a Board completed; it leaves the active list and organize candidates |
| `project activate [options] <projectId>` | Restore a completed or archived Board to active |
| `project lifecycle [options] [projectId]` | List completed and archived Boards, or show one project's lifecycle status |
| `project member [options] [command]` | Manage project members |
| `doctor [options]` | Warm ~/.hq/work-mesh/cache from hq-pro (directory, inbox, pair DMs). Not `hq doctor`. |
| `context [options] [command]` | Work context reconcile, organize, correct, device default, and untracked consent |
| `context reconcile [options]` | Resolve session identity and company; durable local accept before network |
| `context resolve [options]` | Interactively ask (once per repo) which company this repo's work is filed under, and remember it (gap 4). Person TTYs only — never agent boxes / non-interactive. |
| `context backfill-held [options]` | Reconcile ENDED sessions whose held events lack a company so the daemon re-attributes the backlog (explicit, opt-in; no fleet fan-out) |
| `context bind-project [options] <target> [slug]` | Bind this session to a project id, a numbered candidate, or new &lt;slug&gt; |
| `context prd-sync [options]` | Emit task_status for PRD story passes/status changes on a bound session |
| `context auto-bind [options]` | Bind a needs_project session to the project its repo and branch belong to (local-only, fail-open) |
| `context organize [options] [action]` | List or submit one-time project/task decisions (US-007B / US-005B) |
| `context correct [options]` | Explicit cross-company session correction via server migrate (US-017B) |
| `context requeue [options]` | Requeue quarantined outbox operations (default: AUTH_DENIED - work-mesh-live gap 10 recovery - plus sessions refused while work tracking was off). Run once after the company owner turns work tracking on |
| `context default [options] [command]` | Manage the device-local default company preference |
| `context untracked [options] <sessionId>` | Record an explicit user-origin untracked consent receipt (local only) |
| `contract [options] [command]` | Print versioned work-mesh contracts for other repositories |
| `contract preflight [options]` | Offline preflight ContextResult contract (contracts/preflight/v1) |
| `session [options] [command]` | Local session-event spool: enqueue (printf-compatible), flush, and live status |
| `session start [options]` | Enqueue session_start |
| `session turn-start [options]` | Enqueue turn_start |
| `session turn-end [options]` | Enqueue turn_end |
| `session end [options]` | Enqueue session_end |
| `session task-status [options]` | Enqueue task_status |
| `session blocked [options]` | Enqueue blocked |
| `session note [options]` | Enqueue note |
| `session flush [options]` | Claim spool/held by rename, hold or drop by context state, POST batches of ≤100 |
| `session status [options]` | Print the company-wide live read (US-004) as a table or --json |
| `mode [options] [action]` | Get/set the daemon emit mode (legacy = spool/flush; direct = receive-only). `check` probes whether the server route is live. |
| `emit [options]` | Direct-emit drain: POST any deferred events (retry file) to /v1/mesh/events; --replay-legacy also replays the legacy spool/held backlog through the new endpoint |
| `daemon [options] [command]` | Resident spool drainer + MQTT presence (install as a user service) |
| `daemon run [options]` | Start the single-instance daemon (pid lock, spool watch, presence) |
| `daemon install [options]` | Install LaunchAgent (macOS), systemd user unit (Linux), or Scheduled Task (Windows) |
| `daemon uninstall [options]` | Remove the installed user-level daemon service |
| `daemon status [options]` | Show whether the daemon service is installed/loaded |
| `daemon doctor [options]` | Report daemon running/MQTT/spool/held/dead-letter/outbox/flush health |

## hq lanes

Create, supervise, and steer worker lanes; routed decision queue

```
hq lanes [options] [command]
```

| Subcommand | Description |
|---|---|
| `link [options] [command]` | Link live sessions to a conductor through session inboxes |
| `link open [options]` |  |
| `link join [options]` |  |
| `link send [options]` |  |
| `link ack [options]` |  |
| `link capabilities [options]` |  |
| `link report [options]` |  |
| `link status [options]` |  |
| `link inbox [options]` |  |
| `link read [options]` |  |
| `link wait [options]` |  |
| `link list [options]` |  |
| `link leave [options]` |  |
| `link close [options]` |  |
| `reap [options]` | Classify local lanes whose session senior has ended; report only by default |
| `checks [options]` | Evaluate tracker and lane health checks |
| `orphans [options]` | Report lanes whose senior has ended or gone idle |
| `repair-dropbox [options] <ulid>` | Inspect or redeliver messages stranded in a bare-ULID lane dropbox |
| `report [options]` | Generate the owner report for tracker teams |
| `team [options] <slug>` | Show a team's OKRs, KPIs, work, blockers, and questions |
| `hold [options] [command]` | Set and enforce repository merge holds |
| `hold set [options] <repo>` | Set or replace a repository merge hold |
| `hold list [options]` | List active and expired repository merge holds |
| `hold show [options] <repo>` | Show a repository merge hold |
| `hold release [options] <repo>` | Release an existing repository merge hold |
| `hold check [options]` | Refuse merge commands targeting an actively held repository |
| `review [options] [command]` | Record manager review of pull-request heads |
| `review record [options] <repo> <pr-number>` | Record a review against an exact pull-request head |
| `review show [options] <repo> <pr-number>` | Show the review record for one pull request |
| `review list [options]` | List recorded pull-request reviews |
| `outpost-pruner [options] [command]` | Inspect, install, and run safe outpost worktree pruning |
| `outpost-pruner run [options]` | Run the guarded outpost worktree and user-cache cleanup |
| `outpost-pruner install [options]` | Write the pressure and daily systemd user timers |
| `outpost-pruner uninstall [options]` | Disable and remove the pressure and daily systemd user timers |
| `kpis [options] <lane>` | Show runtime freshness for a manager lane's key results |
| `keep-alive-audit [options]` | Audit lead lane keep-alive timing. Durable worker-resume events retain launch time and trigger after bounded lane history rolls over; late_restarts_after_window counts known launches after the grace window. |
| `autopilot [options] [command]` | Run lead autopilot checks and report follow-through metrics |
| `autopilot report [options]` | Report operator nudges, review latency, and idle slots with ready work |
| `autopilot run [options]` | Run one lead autopilot check pass |
| `create [options]` | Register a lane, run admission, and return immediately |
| `progress [options] <lane-id>` | Report on a subagent lane: a progress line, the final envelope, or a failure |
| `recover-loop [options] <lane-id>` | Preview or explicitly fail/abandon uncertain loop effects; never replay work |
| `enqueue [options] <lane-id>` | Validate and queue one phase envelope for a loop lane |
| `keep-alive [options] <lane-id>` | Opt a lane into or out of automatic lead-lane resumes |
| `set [options] <lane-id>` | Change lane settings or bind its missing company attribution |
| `grant [options] <lane-id>` | Set a lane's alive child-lane grant as its senior |
| `backfill-grants [options]` | Preview missing hire grants for alive manager lanes; writes are disabled |
| `doctor [options]` | Report active keep-alive lanes blocked by retired, superseded, or pending-question state |
| `list [options]` | List lanes |
| `status [options]` | Summarize project stories, lanes, PRs, blockers, and pending questions |
| `capacity [options]` | Report this host's lane capacity by provider and account |
| `outpost-identity [options] [command]` | Repair this host's Outpost identity marker |
| `outpost-identity backfill [options]` | Write a missing Outpost identity marker without replacing an existing value |
| `move [options] <lane-id>` | Move an unstarted queued lane to a host with capacity |
| `admit [options] <lane-id>` | Try to admit the oldest eligible queued lane |
| `wait [options]` | Wait for the first requested change across lanes |
| `watch [options] <lane-id...>` | Watch lane state and question changes until all lanes are terminal |
| `monitor-check [options]` | Check that active Claude senior lanes have live Monitor watch tasks |
| `show [options] <lane-id>` | Show one lane |
| `story [options] [command]` | Track several project stories on one lane |
| `story list [options] <lane-id>` | List the stories carried by a lane |
| `story add [options] <lane-id> <story-id>` | Add and start another story on a lane |
| `story start [options] <lane-id> <story-id>` | Start or resume a carried story |
| `story review [options] <lane-id> <story-id>` | Move a carried story to review |
| `story block [options] <lane-id> <story-id>` | Mark one carried story blocked |
| `story done [options] <lane-id> <story-id>` | Mark a reviewed story done after senior verification |
| `message [options] <lane-id>` | Send a follow-up message to a lane |
| `resume [options] <lane-id>` | Resume an interrupted, done or blocked lane, or an awaiting_input lane with no answerable question; recover failed lanes with --from-failed as a senior ancestor or same-company manager |
| `reparent [options] <lane-id>` | Rewrite a lane's senior edge |
| `repair-company [options] <lane-id>` | Set missing company attribution on a legacy lane |
| `logs [options] <lane-id>` | Print a lane's local logs |
| `stop [options] <lane-id>` | Cancel a queued lane or kill a running one (terminal; use interrupt to keep it resumable) |
| `interrupt [options] <lane-id>` | Stop a running lane's turn and keep it resumable with hq lanes resume |
| `approve [options] <lane-id>` | Record senior approval for a registry worker checkpoint |
| `ask [options]` | Queue a mid-run question without blocking the lane |
| `questions [options] [command]` | Routed decision queue |
| `questions list [options]` | List questions |
| `questions show [options] <question-id>` | Show one question |
| `questions answer [options] <question-id>` | Answer a pending question |
| `questions escalate [options] <question-id>` | Advance a question one hop |
| `questions cancel [options] <question-id>` | Cancel a pending question |
| `accounts [options] [command]` | Provider account registry (configured vs logged in) |
| `accounts list [options]` | List accounts |
| `accounts balance [options]` | Report Claude account load and suggest safe between-turn moves |
| `accounts set-home [options] <provider> <account-id> <path>` | Set the host-specific home for an existing provider account |
| `accounts login [options] <provider> <account-id>` | Create a home, run the vendor login, and register the account |
| `accounts clear-quota [options] <provider> <account-id>` | Clear quota reset marks for a provider account |
| `accounts enable [options] <provider> <account-id>` | Enable an account without touching credentials |
| `accounts disable [options] <provider> <account-id>` | Disable an account without touching credentials |
| `sessions [options] [command]` | Session liveness from the work-mesh spool |
| `sessions list [options]` | List sessions |
| `sessions show [options] <session-id>` | Show one session's liveness |
| `gc-rollouts [options]` | Compress or remove unreferenced old Codex session rollouts |

## hq monitor

Run detached monitors and deliver their output into agent context

```
hq monitor [options] [command]
```

| Subcommand | Description |
|---|---|
| `start [options] [argv...]` | Start a detached monitor script |
| `list [options]` | List active monitors |
| `show [options] <monitor-id>` | Show monitor metadata, state and events |
| `stop [options] <monitor-id>` | Stop a running monitor |
| `logs [options] <monitor-id>` | Read monitor events or stderr |

## hq bot

Personal local bots that run on this computer with your own model login

```
hq bot [options] [command]
```

| Subcommand | Description |
|---|---|
| `continuity-import [options] <snapshot>` | Import verified private bot context before cloud activation (promotion coordinator) |
| `jobs [options] <name>` | Show, schedule, or remove a bot's recurring jobs (the schedule runs in the cloud, not on this computer) |
| `promote [options] <name>` | Move this local bot to cloud compute, preserving its identity and private context |
| `create [options] <name>` | Provision a local bot identity, scaffold its worker folder, install its launchd agent, and start it |
| `companies [options] <name>` | Show or change which companies a company bot is a member of (you invite or remove it; a personal bot has no list of its own) |
| `workers [options]` | List the workers (templates) a bot can be created from (hq bot create &lt;name&gt; --worker &lt;id&gt;) |
| `list [options]` | List local bots with runtime, online state, and pid |
| `adopt [options] <name>` | Bring a bot you already own back to this computer: new machine credentials, its saved settings, worker folder, and startup agent |
| `restore [options]` | Bring back every local bot your HQ account owns that is not set up on this computer (after a reinstall, or on a new Mac) |
| `start [options] <name>` | Start the bot (via launchd when installed, else a detached process) |
| `stop [options] <name>` | Stop the bot process (it starts again at next login while its launchd agent is installed) |
| `restart [options] <name>` | Stop then start the bot |
| `status [options] <name>` | Show the bot's process, heartbeat, launchd, and credential state |
| `auth [options] <name>` | Sign a runtime-backed personal bot in to ChatGPT, Grok, Claude, or another supported provider |
| `logs [options] <name>` | Show the bot's log |
| `run [options] <name>` | Run the bot in the foreground (this is what launchd runs) |
| `rm [options] <name>` | Stop the bot, remove its launchd agent, delete its cloud identity and local state |
| `set [options] <name>` | Change the model and thinking level a bot uses (applies from its next message), or the name people see for it (saved in HQ; a running bot restarts to use it) |
| `set-model [options] <name> <model>` | Set the model this bot asks its runtime for (stored in the bot's own settings; the runtime's own config is never changed), or default to clear it |
| `probe [options]` | Run one minimal test turn with a runtime, model and thinking level exactly as a bot would, and say whether a bot set up that way can answer. Costs one tiny model turn on your own login; runs in an empty scratch folder, so no HQ settings or hooks load |
| `intro [options] <name>` | Have the bot re-send its introduction DM to you |
| `daemon [options] [command]` | Manage the bot's launchd user agent (macOS) |
| `daemon install [options] <name>` | Install and load the LaunchAgent so the bot starts at login and restarts on crash |
| `daemon uninstall [options] <name>` | Unload and remove the LaunchAgent |
| `daemon status [options] <name>` | Show whether the LaunchAgent is installed and loaded |

## hq report

Publish and manage a channel report owned by this bot.

```
hq report [options] [command]
```

| Subcommand | Description |
|---|---|
| `get [options] <reportId>` |  |
| `publish [options] <reportId>` |  |
| `promote [options] <reportId>` |  |
| `discard-draft [options] <reportId>` |  |
| `access [options] <reportId>` |  |
| `decommission [options] <reportId>` |  |
| `adopt [options] <reportId>` |  |
| `templates [options]` |  |

## hq deploy

Manage deployments in hq-deploy

```
hq deploy [options] [command]
```

| Subcommand | Description |
|---|---|
| `comments [options] [command]` | List and read comments on your deployed apps |
| `comments list [options] <app>` | List comments on an app in your org |
| `comments read [options] <app> <commentId>` | Read a comment on an app in your org |
| `list [options] [query]` | List deploy apps in your company, optionally filtered by name or subdomain |
| `access [options] [command] [app]` | Show or change who can open a deploy app (company, selected members, or public) |
| `access get [options] <app>` | Show an app's current access mode and selected members |
| `domains [options] [command]` | Manage custom domains on your deployed apps, and buy domains |
| `domains list [options]` | List the custom domains on an app |
| `domains add [options] <domain>` | Link a custom domain to an app and print the DNS records to create |
| `domains refresh [options] <domain>` | Check DNS validation and start serving once the certificate is issued (exits 2 while not live) |
| `domains remove [options] <domain>` | Unlink a custom domain from an app |
| `domains base [options] [command]` | Manage the company deploy domain: one domain for every app (&lt;app&gt;.&lt;domain&gt;) |
| `domains search [options] <query>` | Check whether a domain can be bought, and its price |
| `domains buy [options] <domain>` | Buy a domain for the company (owner or admin) |
