---
title: Authentication
description: Dual auth system — Clerk JWT, API keys, and AWS SigV4.
---

HQ Deploy supports three authentication methods that chain together in a resolver pattern. The first valid credential wins.

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
  ├─ Has AWS Signature headers?
  │   └─ Yes → STS GetCallerIdentity → match account to org
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

## Method 3: AWS SigV4

Enterprise auth for organizations using AWS SSO / aws-vault.

1. Client signs the request with AWS credentials (standard SigV4 signing)
2. Server validates by calling STS `GetCallerIdentity` with the same signature
3. The AWS account ID is matched against `org.aws_account_id` in the database
4. Only works when `org.auth_mode = 'aws-sso'`

This allows enterprise developers to deploy using their existing AWS credentials without needing a separate platform account.

## Auth Mode Switching

Organizations can be configured for either mode:

| Mode | Primary Auth | Behavior |
|------|-------------|----------|
| `platform` | Clerk JWT or API key | Standard SaaS mode |
| `aws-sso` | AWS SigV4 | Enterprise mode — no platform account needed |

In `aws-sso` mode, if AWS credentials are missing or expired, the CLI errors out — it does **not** silently fall back to platform auth. This prevents accidental deploys to the wrong account.
