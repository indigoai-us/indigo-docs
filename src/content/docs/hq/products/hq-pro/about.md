---
title: HQ Pro — Vault, Teams & Identity
description: The HQ Pro backend — encrypted vault with capability-based access, the team platform, shared Cognito identity, and onboarding.
sidebar:
  order: 1
---

> Part of the split [HQ ecosystem](/hq/architecture/2-ecosystem/). HQ Pro is the cloud backend that the [hq-console](/hq/products/hq-console/) admin UI and the [hq-deploy](/hq/products/hq-deploy/introduction/) data plane both build on.

**HQ Pro** is the team and identity backend for HQ. It provisions the shared identity, stores secrets and files in an encrypted vault, and runs the team platform that turns a solo HQ into a multi-member organization. It is an SST v3 application on AWS.

## What it provides

- **Vault — capability-based access.** Encrypted S3 storage with a deny-all default, per-company KMS keys, and STS-scoped capabilities. Access is granted as narrow, time-bound capabilities rather than broad credentials. This is what the [hq-secrets](/hq/products/capabilities/hq-secrets/) and [hq-share](/hq/products/capabilities/hq-share/) CLI capabilities operate against.
- **Shared Cognito identity.** One identity pool that every cloud app trusts — `hq-console` signs in against it (OIDC) and `hq-deploy` verifies JWTs minted by it. Neither runs its own user store.
- **Team platform.** Companies, memberships, roles, and entitlements — see [Team Platform](/hq/products/hq-pro/platform/).
- **Onboarding.** GitHub federated auth and team creation/joining — see [GitHub Auth](/hq/products/hq-pro/github-auth/) and [Onboarding](/hq/products/hq-pro/onboarding/).

## In this section

- [Team Platform](/hq/products/hq-pro/platform/) — companies, memberships, entitlements
- [GitHub Auth](/hq/products/hq-pro/github-auth/) — federated sign-in
- [Onboarding](/hq/products/hq-pro/onboarding/) — creating and joining teams
- [HQ Installer](/hq/products/hq-pro/overview/) — the native macOS onboarding wizard
- [Installer Quickstart](/hq/products/hq-pro/quickstart/) · [Cognito Setup](/hq/products/hq-pro/cognito-setup/) · [Troubleshooting](/hq/products/hq-pro/troubleshooting/)

## Related capabilities

- [hq-secrets](/hq/products/capabilities/hq-secrets/) — schema-driven secret access against the vault
- [hq-share](/hq/products/capabilities/hq-share/) — single-use vault share-session links
