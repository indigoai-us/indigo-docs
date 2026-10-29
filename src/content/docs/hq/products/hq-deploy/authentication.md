---
title: Authentication
description: How the HQ Deploy API authenticates requests — HQ Cognito tokens, HQ API keys, and legacy keys.
---

HQ Deploy does not run its own user store. It trusts the shared HQ Cognito pool provisioned by [HQ Pro](/hq/products/hq-pro/about/) and HQ API keys issued by the HQ vault. All `/api/*` routes require authentication except `/health`, the access-gate routes a visitor uses before signing in, and a few public read routes. A request with no `Authorization` header gets `401`.

## Auth Resolver Chain

The resolver tries each method in order. The first valid credential wins.

```
Request arrives with Authorization header
  │
  ├─ 1. AWS SigV4 (off unless enabled by a server flag)
  │
  ├─ 2. Bearer HQ Cognito JWT (RS256, shared HQ pool)
  │
  ├─ 3. Bearer GitHub JWT (HS256, legacy self-signed tokens)
  │
  ├─ 4. Bearer hqk_… HQ API key
  │     └─ checked with the vault; if it fails, the request is rejected
  │        and no later method is tried
  │
  ├─ 5. Bearer hqd_… legacy deploy API key (bcrypt lookup)
  │
  ├─ 6. Bearer platform admin token (server-side env)
  │
  └─ None valid → 401 Unauthorized
```

## HQ Cognito tokens

The primary method for people and HQ tools. Sign in to HQ (Google or Microsoft), then use the Cognito access token:

- `hq-deploy login --token <access-token>` stores it for the CLI.
- Agents and Outposts present Cognito machine tokens; an Outpost can act for its owner only on app and deploy routes.

## HQ API keys (`hqk_`)

Identity-bound API keys issued by the HQ vault. HQ Deploy does not store them: each `hqk_` key is checked against the vault (results cached for 60 seconds). A `hqk_` key that fails the check is rejected outright and never falls back to another method.

## Legacy deploy API keys (`hqd_`)

Older long-lived keys created through the HQ Deploy API:

```
POST   /api/keys        creates a key (plaintext shown once; only the bcrypt hash is stored)
GET    /api/keys        lists active keys (without the secret portion)
DELETE /api/keys/:id    revokes a key
```

`hq-deploy login --key <api-key>` stores one for the CLI.

## CLI credential storage

`hq-deploy login` writes the credential to `~/.hq-deploy/config.json` with file mode `0600`. `hq-deploy logout` removes it.
