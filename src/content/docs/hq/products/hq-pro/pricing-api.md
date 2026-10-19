---
title: Pricing API
description: The public GET /v1/pricing endpoint that states the HQ usage card, box sizes, signup options, legacy plans and billing rules.
sidebar:
  order: 9
---

`GET /v1/pricing` on the HQ API returns one machine-readable statement of
current pricing. It needs no authentication, is read-only, and is cacheable
for five minutes (`Cache-Control: max-age=300`).

## Response

The JSON body contains:

- `version` and `generatedAt`
- `usage`: the usage card for accounts created from 16 October 2026
  - `version` and `newSignupsFrom`, the instant the card applies to new
    signups
  - `includedUsd`: usage included each month ($10)
  - `trial`: trial length in days (30) and the trial usage cap in dollars
    ($500)
  - `meters[]`: each usage line with its id, label, unit and unit price:
    sync, gateway call, HQ MCP call, agent run, storage, secret and vault.
    The vault line carries `waivedInTrial: true`.
  - `boxes[]`: each box size with its instance type and monthly price (small
    t3.small, medium t3.medium, large t3.large, xlarge t3.xlarge)
  - `free`: what is never billed (deploys, DMs, background AI)
  - `domains`: the custom hostname and custom base domain add-on prices
- `signup`: the options shown to new signups (sign up free, request an
  enterprise demo) and the link to
  [Use HQ free, self-hosted or on-prem](/hq/guide/use-hq-for-free/)
- `plans[]`: legacy plans for existing customers, which move to usage
  pricing on 19 December 2026. Each one carries
  `newSignupsUntil`, the instant it closed to new signups.
- `agentRungs[]`: the legacy box sizes with their instance types and monthly
  prices, for accounts created before the usage card
- `addOns`: legacy Outpost and meeting-hours pricing
- the grandfather rule for companies on the earlier Workforce price
- `billingRules`: hosted agents billed per box from the first, and trial and
  cancellation behavior

Every number comes from the billing catalog and the usage rate card, so the
statement matches what HQ charges. New fields are added without removing
existing ones.

## Example

The `usage` block, shortened:

```json
{
  "usage": {
    "version": "2026-10-16",
    "newSignupsFrom": "2026-10-16T18:00:00Z",
    "includedUsd": 10,
    "trial": { "days": 30, "capUsd": 500 },
    "meters": [
      { "id": "member-sync", "label": "Sync", "unit": "sync", "unitUsd": 0.10 },
      { "id": "vault", "label": "Vault", "unit": "vault-month", "unitUsd": 5.00, "waivedInTrial": true }
    ],
    "boxes": [
      { "size": "small", "instanceType": "t3.small", "monthlyUsd": 100 }
    ],
    "free": ["deploys", "dms", "background-ai"],
    "domains": { "standardUsd": 20, "premiumUsd": 500 }
  }
}
```

## Errors

If the billing catalog cannot be loaded, the endpoint returns `503`. It never
returns a partial statement.
