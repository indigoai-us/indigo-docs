---
title: HQ Pro — Vault, Teams & Identity
description: The HQ Pro backend — encrypted vault with capability-based access, companies and memberships, shared Cognito identity, billing and access.
sidebar:
  order: 1
---

> Part of the split [HQ ecosystem](/hq/architecture/2-ecosystem/). HQ Pro is the cloud backend that the [hq-console](/hq/products/hq-console/) admin UI and the [hq-deploy](/hq/products/hq-deploy/introduction/) data plane both build on.

**HQ Pro** is the team and identity backend for HQ. It provisions the shared identity, stores secrets and files in an encrypted vault, and runs the team platform that turns a solo HQ into a multi-member organization. It is an SST (v4) application on AWS.

## What it provides

- **Vault — capability-based access.** Encrypted S3 storage with a deny-all default, KMS encryption, and STS-scoped capabilities. Access is granted as narrow, time-bound capabilities rather than broad credentials. This is what the [hq-secrets](/hq/products/capabilities/hq-secrets/) and [hq-share](/hq/products/capabilities/hq-share/) CLI capabilities operate against.
- **Shared Cognito identity.** One Cognito user pool that every cloud app trusts — `hq-console` signs in against it (OIDC) and `hq-deploy` verifies JWTs minted by it. Neither runs its own user store.
- **Companies and memberships.** Companies, members, and roles (`owner`, `admin`, `member`, `guest`).
- **Sign-in.** Google and Microsoft accounts, federated through the shared Cognito pool. There is no email-and-password sign-up.
- **Install.** New users install the HQ desktop app (macOS and Windows) from [hqforwork.com/install](https://www.hqforwork.com/install).

## In this section

- [Joining a company](/hq/products/hq-pro/access/) — owner and admin invites, and the demo-gated request flow for the demo sandbox
- [Billing and usage](/hq/products/hq-pro/billing-and-usage/) — the usage card, trial, spend limit and boxes
- [Pricing API](/hq/products/hq-pro/pricing-api/) — the public `GET /v1/pricing` statement
- [Setup channel lifecycle](/hq/products/hq-pro/setup-channel-lifecycle/) — #setup → company → cloud → billing → first agent in the desktop app

## Related capabilities

- [hq-secrets](/hq/products/capabilities/hq-secrets/) — schema-driven secret access against the vault
- [hq-share](/hq/products/capabilities/hq-share/) — single-use vault share-session links
