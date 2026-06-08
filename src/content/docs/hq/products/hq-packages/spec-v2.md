---
title: Package Spec v2
description: Security-first package specification with RSA signing and content allow-lists.
---

Package Spec v2 was designed security-first, with a formal threat model covering supply chain attacks, entitlement bypass, and privilege escalation.

## Package Manifest

Every package includes a `package.yaml`:

```yaml
name: adobe-campaign-ops
version: 1.2.0
description: Adobe Campaign operations workers and commands
publisher: clerk_user_abc123  # Clerk user ID
publishedAt: 2026-03-25T10:00:00Z

contents:
  workers:
    - workers/campaign-ops/worker.yaml
    - workers/analytics/worker.yaml
  commands:
    - commands/adobe-deploy.md
    - commands/adobe-audience-sync.md
  knowledge:
    - knowledge/adobe/
  policies:
    - policies/adobe-compliance.md

integrity:
  sha256: "a1b2c3d4..."
  signature: "RSA_SIGNATURE_BASE64..."

# Replaces v1 license_key field
# Authorization is now identity-based via Clerk entitlements
```

## Attribution & Provenance

Packages carry optional trust-signal blocks so installers can see who made a pack, what host surfaces it touches, and where its content came from.

```yaml
author:
  handle: mattpocock          # creator handle → /creators/<handle>
  displayName: 'Matt Pocock'
  uid: cmt_mattpocock         # community handle until the author claims it

capabilities: []              # host-execution surfaces a pack uses, from a
                              # static security scan: hooks, scripts, network,
                              # fs, secrets. An empty list means none — install
                              # never symlinks into core/scripts or .claude/hooks.

upstream:                     # present when a pack is ported from open source
  repo: 'https://github.com/mattpocock/skills'
  ref: 'main'                 # branch/tag tracked for updates
  ported_commit: '<sha>'      # the exact pin the update flow diffs against
  license: 'MIT'              # SPDX id, copied from the upstream LICENSE
  ported_at: '2026-06-06T00:00:00Z'
  kind: port                  # 'port' = upstream code copied; 'integration' = setup/links only
```

- **`author`** ties a pack to a [creator profile](/hq/products/hq-packages/overview/#creator-marketplace). A `cmt_`-prefixed `uid` denotes a *community* handle credited but not yet claimed by the real author.
- **`capabilities`** is populated by the security scan, not hand-authored — it is the trust signal a reviewer reads before install. A partial or malformed `upstream` block aborts the install rather than being silently accepted.
- **`upstream`** records provenance for packs ported from the open-source ecosystem; the update flow reads `ported_commit` to compute the delta when upstream moves.

## Content Allow-List

Only these file types are permitted in packages:

| Extension | Purpose |
|-----------|---------|
| `.yaml` / `.yml` | Worker definitions, config |
| `.md` | Commands, knowledge, policies |
| `.sh` | Hooks (requires explicit user approval) |

**Binaries are rejected.** This prevents executable payloads from being distributed through the package system.

## Integrity Verification

Every package tarball is verified at two levels:

1. **SHA256 hash** — The `X-Package-SHA256` response header must match the computed hash of the downloaded tarball.
2. **RSA signature** — The `X-Package-Signature` header is verified against Indigo's public key. This proves the tarball was published by an authorized source and hasn't been tampered with.

```
Download tarball
    │
    ├── Compute SHA256 → match X-Package-SHA256 header?
    │     └── No → Reject (tampered in transit)
    │
    └── Verify RSA signature with public key?
          └── No → Reject (not published by trusted source)
```

## Threat Model

The v2 spec includes a formal threat model covering:

| Threat | Mitigation |
|--------|-----------|
| **Supply chain attack** (malicious package) | RSA signing, content allow-list, no binaries |
| **Entitlement bypass** | Server-side Clerk JWT validation per download |
| **Privilege escalation via hooks** | Hook content shown to user, requires explicit consent |
| **Path traversal** | `path.resolve()` validation (fixes v1 `path.basename()` vulnerability) |
| **MCP server injection** | Content allow-list blocks executable code |
