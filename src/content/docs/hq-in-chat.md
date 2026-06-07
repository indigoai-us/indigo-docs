---
title: HQ in Chat
description: Use Indigo HQ from ChatGPT and Claude.ai through the cloud connector.
---

HQ in Chat connects ChatGPT and Claude.ai to the same governed HQ context your local agents use: company knowledge, project context, policies, files, and shared workflow skills.

The connector is built on the Model Context Protocol (MCP). Each request is authenticated with your HQ identity, and vault-service resolves which personal and company vaults you can access before any search, fetch, write, or skill review happens.

## What You Can Do

- Search entitled personal and company vault content from chat.
- Fetch approved chat-visible skills as workflow guidance.
- Capture notes and knowledge back into allowed vault prefixes.
- Draft new team skills for review.
- Ask an owner or delegated reviewer to approve, reject, request changes, revoke, or restore a chat-visible skill.

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

HQ in Chat keeps vault-service as the authority:

- The connector forwards the verified bearer token and does not accept client-supplied vault scope.
- Personal and company entitlements are resolved server-side.
- Search results are hints; fetch rechecks canonical vault, source path, lifecycle, private-prefix, and skill review state.
- Settings, secrets, and workers paths are excluded.
- Client-visible denials collapse to a generic unavailable response, while internal telemetry records the exact cause.

The result is the same tenant-isolation guarantee as the rest of HQ: one company cannot read or write another company's content through chat.

## Operator Checks

Release verification covers:

- OAuth metadata and connector boot.
- Skill discovery and skill fetch.
- Safe capture write.
- Cross-vault fetch denial.
- Private-prefix write refusal.
- Revoked-skill stale fetch denial.
- Index-lag threshold checks for seeded canary content.

If a rollout needs to be reversed, disable skill/content surfacing first, purge or rebuild affected index records, rerun the denial canaries, and restore surfaces progressively.
