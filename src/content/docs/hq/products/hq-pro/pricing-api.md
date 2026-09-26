---
title: Pricing API
description: The public GET /v1/pricing endpoint that states current HQ plans, agent rungs, add-ons, and billing rules. Available after release.
sidebar:
  order: 9
---

:::note
This endpoint is available after release. Until then, use
[Agent sizes and billing](/hq/products/fleet-agents/sizes-and-billing/).
:::

`GET /v1/pricing` on the HQ API returns one machine-readable statement of
current pricing. It needs no authentication, is read-only, and is cacheable
for five minutes (`Cache-Control: max-age=300`).

## Response

The JSON body contains:

- `version` and `generatedAt`
- `plans[]`: each plan's id, display name, monthly price, included
  allowances, Starter limits, and the member rule (humans and self-run bots
  count as members; Workforce members are unlimited)
- `agentRungs[]`: each hosted agent size with its instance type and monthly
  price
- `addOns`: Outpost and meeting-hours pricing
- the grandfather rule for companies on the earlier Workforce price
- `billingRules`: flat monthly plan fee, hosted agents billed per box from
  the first, and trial and cancellation behaviour

Every number comes from the billing catalog, so the statement matches what
HQ charges.

## Errors

If the billing catalog cannot be loaded, the endpoint returns `503`. It never
returns a partial statement.
