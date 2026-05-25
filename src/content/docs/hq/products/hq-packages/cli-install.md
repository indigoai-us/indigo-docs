---
title: CLI Install Flow
description: How packages are downloaded, verified, and extracted via the hq-cli.
---

Package installation is a two-step process: the CLI handles download and verification, then Claude handles the merge into HQ directories.

## Authentication

Before installing packages, authenticate with the registry:

```bash
hq login
# Opens Clerk PKCE OAuth flow in browser
# Stores session token at ~/.hq/auth.json (mode 0600)
# Token auto-refreshes on expiration
```

Session management:
- `hq login` — Authenticate via Clerk PKCE
- `hq logout` — Clear stored session
- `hq whoami` — Show current user and entitlements

## Install Command

```bash
hq install adobe-campaign-ops
# 1. Authenticates with stored Clerk JWT
# 2. Checks entitlement for the package
# 3. Downloads tarball from registry
# 4. Verifies SHA256 hash
# 5. Verifies RSA signature
# 6. Extracts to packages/installed/adobe-campaign-ops/
```

### Company Scoping

```bash
hq install adobe-campaign-ops --company acme-corp
# Same as above, but records company scope in registry.yaml
# Claude will merge workers to companies/acme-corp/workers/
```

## Other Commands

| Command | Purpose |
|---------|---------|
| `hq list` | Show installed packages, versions, and company scope |
| `hq update [pkg]` | Download latest version, re-verify, re-extract |
| `hq remove [pkg]` | Remove from packages/installed/, update registry.yaml |

## Security: Path Traversal Fix

v1 used `path.basename()` for path validation, which could be bypassed. v2 uses `path.resolve()` to normalize paths before comparison, preventing directory traversal attacks like `../../.claude/hooks/malicious.sh`.

## Local Package Structure

```
packages/
  registry.yaml          # Installed package index (committed)
  sources.yaml           # Remote registry sources (committed)
  installed/             # Extracted contents (gitignored)
    adobe-campaign-ops/
      package.yaml
      workers/
      commands/
  licenses/              # (v1 legacy, gitignored)
  .archive/              # Soft-deleted packages (gitignored)
  .keys/                 # RSA public keys (gitignored)
```

Only `registry.yaml` and `sources.yaml` are committed to git. Everything else is local-only, so package contents aren't duplicated in the HQ repo.
