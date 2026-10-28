---
title: Authentication
description: Dual auth system — Clerk JWT and API keys.
---

HQ Deploy supports two authentication methods that chain together in a resolver pattern. The first valid credential wins.

## Auth Resolver Chain

```
Request arrives
  │
  ├─ Has Authorization: Bearer {jwt}?
  │   └─ Yes → Verify Clerk JWT → extract userId, orgId
  │
  ├─ Has Authorization: Bearer hqd_*?
  │   └─ Yes → Lookup API key (bcrypt) → extract userId, orgId
  │
  └─ None valid → 401 Unauthorized
```

## Method 1: Clerk JWT

The primary auth method for the web dashboard and programmatic API access.

- All `/api/*` routes (except `/health`) require authentication
- JWT is validated against Clerk's public keys
- Populates `req.userId` and `req.orgId` from JWT claims
- Used by the web dashboard and admin panel

## Method 2: API Keys

CLI-friendly authentication with long-lived keys.

```
POST /api/keys → creates a new key
```

- Keys use the `hqd_` prefix (e.g., `hqd_sk_abc123def456`)
- Plaintext is shown **once** on creation — the server stores only the bcrypt hash
- `DELETE /api/keys/:id` revokes a key
- `GET /api/keys` lists active keys (without the secret portion)
- Stored in `~/.hq-deploy/config.json` with file mode `0600`
