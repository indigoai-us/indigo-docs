---
title: Glossary
description: Plain definitions for the vocabulary of agent-native teams — Agent Amnesia, shared context layer, team AI operating system, MCP, workers, skills, policies, and data gravity.
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "name": "HQ Glossary — the language of agent-native teams",
        "publisher": { "@type": "Organization", "name": "Indigo", "url": "https://www.hqforwork.com" },
        "hasDefinedTerm": [
          { "@type": "DefinedTerm", "name": "Agent Amnesia", "description": "The anti-pattern where an AI coding agent forgets all company context at the start of every session, forcing constant re-explaining and re-discovery." },
          { "@type": "DefinedTerm", "name": "Shared context layer", "description": "A single, team-wide store of a company's knowledge, decisions, people, skills, and policies that AI agents read from automatically." },
          { "@type": "DefinedTerm", "name": "Team AI operating system", "description": "A coordination layer over AI coding tools (Claude Code, Cursor, Codex) that syncs context and capabilities across a whole team rather than a single user." },
          { "@type": "DefinedTerm", "name": "Data gravity", "description": "The compounding effect by which accumulated company context makes agents smarter over time and raises the cost of switching away." },
          { "@type": "DefinedTerm", "name": "Worker", "description": "A specialized, reusable agent configuration in HQ with its own skills, tools, and knowledge, shareable across a team." },
          { "@type": "DefinedTerm", "name": "Skill", "description": "A packaged, reusable workflow an agent can invoke, sharable across a team." }
        ]
      }
---

The vocabulary of working with AI agents at company scale — the terms HQ is built around.

## Agent Amnesia

The default failure of AI coding agents: at the start of every session, the agent knows
nothing about your company — your stack, conventions, decisions, or people. You re-explain;
it re-discovers; nothing compounds. It's the anti-pattern HQ exists to solve.
[Read the full definition →](https://www.hqforwork.com/agent-amnesia)

## Shared context layer

A single, team-wide store of a company's knowledge, decisions, people, skills, and policies
that agents read from automatically — so context lives with the *company*, not in one
person's chat window.

## Team AI operating system

A coordination layer over the AI coding tools a team already uses (Claude Code, Cursor,
Codex) that syncs context and capabilities across the whole team rather than a single user.
What HQ is.

## Data gravity

The compounding effect by which accumulated company context makes agents smarter over time
and raises the cost of starting over elsewhere. The memory is both the moat and the
marketing.

## MCP

Model Context Protocol — an open standard for connecting AI agents to external tools and
data. HQ ships an MCP server (`hq-mcp`) that bridges agents to HQ-managed company context.

## Worker

A specialized, reusable agent in HQ with its own skills, tools, and knowledge (for example a
CRM worker or a deploy worker). Defined once, shared across the team.

## Skill

A packaged, reusable workflow an agent can invoke on demand — the unit of capability a team
builds up and shares, instead of re-deriving it every time.

## Policy

A durable rule that constrains how agents act (security boundaries, conventions, do/don't).
Policies travel with the company so every agent obeys them automatically.

## Sync

The mechanism that keeps a company's context, skills, and policies consistent across every
teammate and machine — turning one person's setup into the whole team's.

---

Give your agents the shared layer:

```bash
npx create-hq
```
