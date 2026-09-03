---
title: Setup channel lifecycle
description: Create a company, turn on cloud, upgrade to Workforce, and create the first agent inside the desktop app — no console or CLI required.
sidebar:
  order: 8
---

The desktop app's pinned **#setup** channel is the front door for a new HQ company. Four server-stamped cards walk an owner from an empty account to a first agent that replies in its own channel. Members can watch; only people with the right capability can act.

This is the path a brand-new client takes after signup. The console stays the admin surface for board, knowledge, policies, skills, workers, vault, and fleet.

## The four cards

Cards are `lifecycle_card` messages (v1). The server sets them; clients cannot mint one through the ordinary message route. Each read is stamped with `viewer.canAct`. The same action posted twice with the same `idempotencyKey` returns the first result and does no second side effect.

| Step | Where | Card | Who can act |
| --- | --- | --- | --- |
| 1. Create company | #setup | `create_company` | The signed-in person |
| 2. Activate cloud | Company channel | `activate_cloud` | Owner |
| 3. Upgrade to Workforce | Company channel | `upgrade_plan` | Owner |
| 4. Create first agent | Company channel | `create_agent` | Owner, or a role with `createAgents` |

#setup also holds a `companies_summary` card after the first company exists. Opening a row jumps to that company's channel.

## Workforce

Workforce is the display name of the existing **$500 / month team** plan. The plan id stays `team`. Starter stays free. Enterprise is a talk-to-us link, not a new SKU.

Stay on Starter is a real action (`skipped`). It does not unlock agents. Creating an agent on Starter resurfaces the Workforce card.

## Agent channel

Submitting create-agent mints the agent and an invite-only company-scoped channel immediately. Setup finishes in that channel: a locked composer while the box is provisioning, then the agent's first message. Agent settings live in the existing agent-detail side pane — there is no separate agent settings tab.

## Company channel tabs

Each company channel header is **Chat · Atlas · Team · Integrations · Settings**.

- **Chat** is the feed (lifecycle cards plus ordinary messages).
- **Team** is humans (roles and invite-by-email), agents (resize / remove / spend), and permissions (who can create agents, who can invite). Defaults: create-agents **Owner only**, invite **Everyone**. Members see values without controls. Removing an agent or changing an owner role is a second click in the row, never a modal.
- **Integrations** is connected apps, the available catalog, and a console link for secrets. Connect opens the provider in the system browser.
- **Settings** is identity, plan and billing, cloud, and the danger zone. Wallpaper is stored on the company and drives the channel hero. Members see General read-only.
- **Atlas** is a read-only map of the company's people and agents.

Everything an agent or a session can do (knowledge, policies, projects, branding beyond wallpaper) stays out of these tabs.

## Who can act

`viewer.canAct` is computed per card. The action route enforces the same check (403). A member can sit in the company channel and see setup progress without being able to pay, invite, or create agents unless a permission grants it.

## What this is not

- No per-company hosted owner agent.
- No new plan tier or price.
- No rebuild of checkout or invoices in-app (Stripe hosted stays).
- The console is not removed.
- Setup-agent autocreate stays off.
