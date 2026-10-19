---
title: Setup channel lifecycle
description: Create a company, turn on cloud, set up billing, and create the first agent inside the desktop app, with no console or CLI required.
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
| 3. Plan and billing | Company channel | `upgrade_plan` | Owner |
| 4. Create first agent | Company channel | `create_agent` | Owner, or a role with `createAgents` |

#setup also holds a `companies_summary` card after the first company exists. Opening a row jumps to that company's channel.

## Plan and billing

Companies created from 16 October 2026 are on usage pricing. There is no plan
to buy: each account gets $10 of usage a month and a 30-day trial, and usage
past $10 is billed by use. See
[Billing and usage](/hq/products/hq-pro/billing-and-usage/). Starter and
Workforce are closed to new signups. Teams that need contract terms request an
enterprise demo instead.

Agents are available on every account a la carte: self-run bots are free, and
a hosted agent is billed per box and needs billing set up.

### Companies that signed up earlier

Companies created before 16 October 2026 stay on their current plan until
19 December 2026, when existing plans move to usage pricing. Until then,
step 3 offers the existing **$500 / month team** plan under its display name,
Workforce. The plan id stays `team`. Stay on Starter is a real action
(`skipped`). Creating an agent does not require Workforce.

Starter is a hard-capped free plan, not a trial. It covers up to 5 members,
10 secrets, 10 GB of storage, 1 connected integration, and 500 lifetime
deployments. MCP and Atlas are not included. Going over a capped ceiling locks
the workspace read-only for creates until an owner trims back under it or
upgrades; nothing is deleted.

Workforce removes the member, secret, storage, integration and deployment
ceilings (all of them are unlimited on Workforce) and adds hosted MCP and
Atlas.

## First agent

Step 4 is optional and available on every account. No plan includes hosted agents: each hosted agent is billed per box at its size, from the first agent, and needs billing set up. Self-run bots are free. See [Agent sizes and billing](/hq/products/fleet-agents/sizes-and-billing/).

## Agent channel

Submitting create-agent mints the agent and an invite-only company-scoped channel immediately. Setup finishes in that channel: a locked composer while the box is provisioning, then the agent's first message. Agent settings live in the existing agent-detail side pane — there is no separate agent settings tab.

## Company channel tabs

Each company channel header is **Chat · Atlas · Team · Settings**.

- **Chat** is the feed (lifecycle cards plus ordinary messages).
- **Team** is humans (roles and invite-by-email), agents (resize / remove / spend), and permissions (who can create agents, who can invite). Defaults: create-agents **Owner only**, invite **Everyone**. Members see values without controls. Removing an agent or changing an owner role is a second click in the row, never a modal.
- **Integrations** is not a channel tab. Apps are connected only in the HQ console, on the company's Integrations page; in the desktop app, the company's **More → Integrations** entry opens that page in the system browser.
- **Settings** is identity, plan and billing, cloud, and the danger zone. Wallpaper is stored on the company and drives the channel hero. Members see General read-only.
- **Atlas** is a read-only map of the company's people and agents.

Everything an agent or a session can do (knowledge, policies, projects, branding beyond wallpaper) stays out of these tabs.

## Who can act

`viewer.canAct` is computed per card. The action route enforces the same check (403). A member can sit in the company channel and see setup progress without being able to pay, invite, or create agents unless a permission grants it.

## What this is not

- No per-company hosted owner agent.
- No rebuild of checkout or invoices in-app (Stripe hosted stays).
- The console is not removed.
- Setup-agent autocreate stays off.
