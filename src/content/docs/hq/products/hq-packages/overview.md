---
title: Package System
description: Modular package ecosystem for extending HQ with workers, commands, knowledge, and policies.
sidebar:
  order: 1
---

> Part of the split [HQ ecosystem](/hq/architecture/2-ecosystem/). This is the content-pack distribution system, distinct from the per-repo npm package publishing covered in [Development → Publishing Packages](/hq/development/3-publishing-packages/). The [hq-core](/hq/products/hq-core/) scaffold ships minimal; packs add the rich capabilities on top.

HQ Packages let you distribute and install specialty content — workers, commands, skills, knowledge bases, policies, and hooks — into any HQ instance. Packs publish as `@indigoai-us/hq-pack-*` and install via `hq install`. The system went through two major iterations.

### First-party packs

The `indigoai-us/hq-packages` repo ships the official packs, including `hq-pack-design-styles`, `hq-pack-design-quality`, `hq-pack-gemini`, `hq-pack-gstack`, and (as of hq-core v15.0.0) `hq-pack-engineering`. The engineering pack carries the coding toolkit that used to live inside core: 17 dev skills (`/tdd`, `/review`, `/execute-task`, `/run-project`, and more), 6 workers (qa-tester, security-scanner, and others), 4 knowledge bases, and 4 policies. Upgraders to v15 get it auto-installed by `/update-hq`; fresh installs add it on demand:

```bash
hq install github:indigoai-us/hq-packages#packages/hq-pack-engineering
```

## Creator Marketplace

Every pack can credit a **creator** — the person behind the skills, workers, or knowledge it ships. Creators get a public profile at `getindigo.ai/creators/<handle>` listing the packs they've published, with their bio and links.

**Claimable profiles.** HQ grows its catalog by curating the best of the open-source ecosystem, so a creator may have a profile *before they've ever signed up*. When a pack credits an author who hasn't joined yet, their profile renders an **"is this you? Claim it"** state — the real author can claim the handle, which links it to their account and lets them manage their packs, bio, and links from then on. Attribution always points at the true author; nothing is published under someone else's name without crediting them.

**The pack-porter.** A semi-automated workflow imports permissively-licensed open-source skills into HQ packs. It runs a strict pipeline: a **license gate first** (only clear permissive licenses like MIT/Apache are ported; no-license repos are held and link-only), then maps the upstream skill bundle into a pack, then a **security scan** that must pass before anything is distributed — populating the pack's [`capabilities`](/hq/products/hq-packages/spec-v2/#attribution--provenance) trust signal by static inspection. Ported packs record their origin in an [`upstream` provenance block](/hq/products/hq-packages/spec-v2/#attribution--provenance) so updates can track the source repo over time. Co-marketing announcements are drafted but held until the credited creator claims or consents.

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
