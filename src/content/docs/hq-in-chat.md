---
title: HQ MCP
description: Use Indigo HQ from ChatGPT and Claude.ai through the cloud connector.
---

HQ MCP connects ChatGPT and Claude.ai to the same governed HQ context your local agents use: company knowledge, project context, policies, files, and shared workflow skills.

The connector is built on the Model Context Protocol (MCP). Each request is authenticated with your HQ identity, and vault-service resolves which personal and company vaults you can access before any company lookup, file read, search, fetch, write, or skill review happens.

For clients that ask for a remote MCP server URL, use:

```txt
https://hq-mcp.getindigo.ai/mcp
```

The cloud connector does not require a local HQ install, local filesystem access, or `qmd` on the client. Local and developer MCP runs may still use local HQ files and `qmd` as a fallback, but the production cloud path talks to HQ cloud services directly.

## What You Can Do

- List the HQ companies your account can access.
- Browse readable company vault prefixes and fetch allowed files.
- Share company vault files or prefixes by minting a short-lived share-session link or granting one recipient directly.
- Search chat-visible personal and company content.
- Read company knowledge, project records, project status, and policies.
- Capture notes, journal entries, project updates, and knowledge captures back into allowed prefixes.
- Inspect secret names and project secret schemas without exposing secret values.
- Generate a human submission link when a secret value needs to be supplied.
- Fetch approved chat-visible skills as workflow guidance.
- Draft new team skills for review.

## MCP Tool Groups

Different chat clients present MCP tools with different UI labels, but the connector exposes these capability groups:

| Group | Tools |
| --- | --- |
| Identity | `hq_whoami`, `hq_companies_list`, `hq_company_ping` |
| Files | `hq_files_list`, `hq_files_read`, `hq_files_write`, `hq_files_share` |
| Knowledge | `hq_knowledge_list`, `hq_knowledge_get`, `hq_knowledge_search`, `hq_knowledge_capture` |
| Projects | `hq_projects_list`, `hq_project_get`, `hq_project_status`, `hq_project_journal_append` |
| Policies | `hq_policies_list`, `hq_policy_get` |
| Secrets | `hq_secrets_list`, `hq_secrets_schema`, `hq_secrets_generate_link` |
| Personal vault | `hq_personal_capture` |
| Skills | `hq_skill_list`, `hq_skill_get`, `hq_skill_draft` |
| Diagnostics | `hq_ping`, `hq_version`, `hq_exec_check` |

Some clients also expose the standard MCP `search` and `fetch` surface. Use that pair for general chat-visible HQ content discovery. Use the `hq_*` tools when you need company-scoped behavior, explicit paths, project records, policy records, or write actions.

## Search And Fetch

HQ MCP has two search paths:

- `search` and `fetch` are the general MCP content discovery pair. Search returns matching chat-visible records, and fetch rechecks permission before returning the canonical content.
- `hq_knowledge_search` keeps the company-scoped HQ tool shape. In cloud mode, it uses the vault content search service and filters results to the requested company. In local developer mode, it can fall back to `qmd`.

Production cloud MCP does not shell out to `qmd`. If a cloud client reports a `qmd` missing error, it is using an old connector bundle or a local MCP path, not the current production cloud path.

Cloud search currently indexes chat-visible vault content through the HQ content search service. Empty results mean no matching chat-visible content was found for your account and company scope. Use list and get tools for direct browsing when you already know the company or path. Vector-index infrastructure is scaffolded, but it is not the production source of truth for cloud MCP results yet.

## Files And Writes

Company file tools are company-scoped. The connector first verifies that you are a member of the requested company, then vault-service applies path-level rules.

Readable company listings exclude private operational prefixes such as `settings/`, `secrets/`, and `workers/`. Reads are also rechecked at fetch time, so stale paths or newly revoked access fail closed.

Writes are limited to explicitly writable areas, including:

- `notes/`
- `inbox/`
- `drafts/`
- `scratch/`
- `journal/`
- `projects/`
- `knowledge/captures/`

Existing files are not overwritten unless the tool call explicitly confirms the overwrite.

Files written from chat follow the same ownership model as files synced from a local HQ folder: the creator owns the new object first. Other people do not get access just because a chat wrote the file. Share it explicitly when someone else needs to read or edit it.

Use `hq_files_share` to share one or more company vault paths:

- Omit `with` to mint a short-lived share-session URL. The browser flow lets a human pick recipients and per-recipient read/write access.
- Set `with` to an email, `prs_*` person UID, `grp_*` group ID, or `@all` to grant access directly from the tool call.
- `permission` defaults to `read`; use `write` only when the recipient should be able to edit the path.

Share-session URLs are bearer capabilities. They should be surfaced only at mint time and redacted everywhere else as `https://hq.{co}.com/share-session/<TOKEN_REDACTED>`.

## Secrets

Secret values never enter the chat transcript. The MCP connector can list secret names and metadata, parse a project's `.env.schema`, and generate a time-limited submission link for a human to provide a value through HQ. It cannot return raw secret values to the model.

## Skills In Chat

HQ skills are team-authored workflow instructions. In chat, they are treated as content, not code:

- A skill must opt into `surfaces: [chat]`.
- Workflow-tier skills require review before they become visible.
- Skill bodies are returned as untrusted tool data and cannot override system, developer, or connector instructions.
- Cloud mode never enables local shell execution or `hq_run`.
- Revoked or archived skills are blocked at fetch time, even if an old search result still exists.

For tool-only clients, use `hq_skill_list` to find skills and `hq_skill_get` to fetch one by ID. MCP-native clients that support resources and prompts can also see `hq-skill://skill/{id}` resources and the `hq_skill_apply` prompt.

## Contribution Flow

General captures use existing writable areas such as notes, inbox, scratch, journal, project journals, and knowledge captures.

Skill changes use a stricter flow:

1. A user drafts a skill from chat.
2. The draft is written to `drafts/skills/{slug}/SKILL.md`.
3. An owner or delegated `manageChatSkills` reviewer approves, rejects, requests changes, revokes, or restores it.
4. Approved skills are promoted into the live `skills/{slug}/SKILL.md` path and queued for indexing.

Chat cannot write directly to live company skill roots.

## Security Model

HQ MCP keeps vault-service as the authority:

- The connector forwards the verified bearer token and does not accept client-supplied vault scope.
- Personal and company entitlements are resolved server-side.
- Company-scoped tools first confirm membership in the requested company.
- Chat writes create creator-owned files; sharing is a separate ACL action through the same vault-service rules used by HQ Console and HQ Sync.
- Search results are hints; fetch rechecks canonical vault, source path, lifecycle, private-prefix, and skill review state.
- Settings, secrets, and workers paths are excluded.
- Secret values are never returned to chat.
- Client-visible denials collapse to a generic unavailable response, while internal telemetry records the exact cause.

The result is the same tenant-isolation guarantee as the rest of HQ: one company cannot read or write another company's content through chat.

## Operator Checks

Release verification covers:

- OAuth metadata and connector boot.
- Company lookup and company ping.
- Company file listing, read, and write ACL behavior.
- Company file sharing through share-session minting and direct grant behavior.
- Knowledge list, get, search, and capture behavior.
- Project, policy, and personal capture tools.
- Secret metadata and schema tools.
- Skill discovery and skill fetch.
- Safe capture write.
- Cross-vault fetch denial.
- Private-prefix write refusal.
- Revoked-skill stale fetch denial.
- Cloud search behavior without a local `qmd` dependency.
- Index-lag threshold checks for seeded canary content where content indexing is enabled.

If a rollout needs to be reversed, disable skill/content surfacing first, purge or rebuild affected index records, rerun the denial canaries, and restore surfaces progressively.

## Troubleshooting

| Symptom | What it usually means |
| --- | --- |
| The client can see tool names but every company tool fails | The OAuth token reached MCP, but vault-service could not resolve the account's company membership. Reconnect the client and verify `hq_whoami` and `hq_companies_list`. |
| `hq_companies_list` works but `hq_files_list` returns not found | The company slug, deployed vault route, or file route bundle is stale. Verify the company slug and reconnect after the latest cloud deployment. |
| `hq_files_share` is missing from the client tool list | The client probably cached the tool registry before the latest connector deploy. Relaunch or reconnect the chat client, then list tools again. |
| `hq_knowledge_search` returns an empty array | The cloud service found no matching chat-visible content in that company scope. Try listing knowledge docs or fetching a known path. |
| A cloud request mentions `qmd` | The client is not using the current production cloud bundle, or it is pointed at a local developer MCP server. |
| A secret value is missing from the response | This is expected. MCP exposes secret names, schemas, and submission links only. |
