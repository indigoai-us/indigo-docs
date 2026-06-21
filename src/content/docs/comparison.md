---
title: HQ vs. the alternatives
description: How HQ compares to static context files (CLAUDE.md/AGENTS.md), Cursor & Windsurf rules, raw MCP servers, and agent-memory tools — and where a synced, team-wide context layer fits.
---

{/* FACT-CHECK BEFORE WIDE PROMOTION: competitor capabilities below reflect general
knowledge as of mid-2026 and were not freshly web-verified. Keep the tone fair. */}

There are good ways to give an agent *some* context. Most of them are per-repo, per-user, or
per-tool. HQ is the layer that makes context **team-wide, persistent, and synced** — and it
works *with* the others, not instead of them.

## At a glance

| Approach | What it is | Scope | Shared & synced across a team | Beyond instructions (skills · workers · policies) |
|---|---|---|---|---|
| CLAUDE.md / AGENTS.md | Markdown instructions committed into a repo | One repo | Via git, per repo | No — text only |
| Cursor / Windsurf rules | IDE rule files & memories | One project, one IDE | Partly; tool-locked | No |
| Copilot instructions | Repo/org custom instructions for Copilot | Copilot only | Org-level, tool-locked | No |
| Raw MCP servers | Connect agents to external tools & data | Per user / per config | No — per-user setup | Tools, not curated memory |
| Agent-memory tools (Mem0, Letta, Zep) | Long-term / conversational memory for agents & apps | Per app or per user | Developer-integrated | Memory, not team skills/policies |
| **HQ** | A shared context + capability layer over the agents you already use | Whole company, every tool | **Yes — synced across the team** | **Knowledge + skills + workers + policies** |

## The honest version

These aren't rivals — HQ is the layer above them.

- **CLAUDE.md and MCP are great primitives** — HQ uses them under the hood. The gap they
  leave is everything *between* repos and tools: company-wide knowledge, shared skills, and
  rules that travel with the team.
- **IDE rules lock you to one tool.** HQ's context follows you across Claude Code, Cursor,
  and Codex, so switching tools doesn't reset your agent's memory.
- **Agent-memory tools remember conversations.** HQ remembers the *company* — decisions,
  people, conventions, policies — and shares that across everyone's agents.

If a CLAUDE.md is a sticky note on one repo, HQ is the company's shared memory — synced,
governed, and read by every agent automatically. Already using rules files or an MCP server?
HQ makes them team-wide and persistent instead of per-person and per-repo.

---

Try it:

```bash
npx create-hq
```
