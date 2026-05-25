---
title: Package System
description: Modular package ecosystem for extending HQ with workers, commands, knowledge, and policies.
sidebar:
  order: 1
---

> Part of the split [HQ ecosystem](/hq/architecture/2-ecosystem/). This is the content-pack distribution system, distinct from the per-repo npm package publishing covered in [Development → Publishing Packages](/hq/development/3-publishing-packages/). The [hq-core](/hq/products/hq-core/) scaffold ships minimal; packs add the rich capabilities on top.

HQ Packages let you distribute and install specialty content — workers, commands, skills, knowledge bases, policies, and hooks — into any HQ instance. Packs publish as `@indigoai-us/hq-pack-*` and install via `hq install`. The system went through two major iterations.

## What's in a Package?

A package is a tarball containing any combination of:

| Content Type | Install Location | Example |
|-------------|-----------------|---------|
| Workers | `workers/public/` or `companies/{co}/workers/` | Campaign operations worker |
| Commands | `.claude/commands/` | `/adobe-deploy` |
| Skills | `.claude/skills/` | Agent browser automation |
| Knowledge | `knowledge/public/` | Industry-specific guides |
| Policies | `.claude/policies/` | Compliance rules |
| Hooks | `.claude/hooks/` | Pre-commit checks |

## v1 vs v2

The package system was built twice. v1 established the concept; v2 rebuilt it with security as the primary concern.

| Aspect | v1 (hq-packages-system) | v2 (hq-packages-v2) |
|--------|------------------------|---------------------|
| **Identity** | Anonymous + JWT license | Clerk user identity |
| **Authorization** | JWT license key validation | Identity-gated entitlements |
| **Integrity** | None | SHA256 + RSA signature |
| **Install** | Single-step CLI | Two-step: CLI downloads, Claude merges |
| **Content safety** | None | Allow-list (yaml, md, sh only) |
| **Threat model** | None | Formal supply chain analysis |
| **Status** | Superseded | Current |

## Architecture

```
Developer                 Registry (indigo-nx)           HQ Instance
─────────                 ──────────────────            ────────────
                          ┌─────────────┐
                          │ Packages DB │
                          │ Entitlements│
                          │ S3 Tarballs │
                          └──────┬──────┘
                                 │
hq install {pkg} ───────────────►│ Verify entitlement (Clerk JWT)
                                 │ Download tarball
                          ◄──────┘ + SHA256 + RSA signature headers
                                 │
CLI verifies integrity ──────────┘
CLI extracts to packages/installed/{slug}/
                                 │
/package-install ────────────────► Claude merges content
                                   into HQ directories
                                   with conflict detection
```

## Company Scoping

Packages can be installed globally or scoped to specific companies:

```bash
hq install adobe-pack --company acme-corp
# Installs workers to companies/acme-corp/workers/
# Instead of workers/public/
```

The `packages/registry.yaml` tracks which packages are installed and their company scope.
