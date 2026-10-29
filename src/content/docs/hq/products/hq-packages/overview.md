---
title: Package System
description: Modular package ecosystem for extending HQ with workers, commands, knowledge, and policies.
sidebar:
  order: 1
---

> Part of the split [HQ ecosystem](/hq/architecture/2-ecosystem/). This is the content-pack distribution system, distinct from the per-repo npm package publishing covered in [Development → Publishing Packages](/hq/development/3-publishing-packages/). The [hq-core](/hq/products/hq-core/) scaffold ships minimal; packs add the rich capabilities on top.

HQ Packages let you distribute and install specialty content — workers, commands, skills, knowledge bases, policies, hooks, and scripts — into any HQ instance. Each pack is a directory with a `package.yaml` manifest. Packs are installed with `hq install`.

### First-party packs

The `indigoai-us/hq-packages` repo ships the official packs under `packages/`, including `hq-pack-design-styles`, `hq-pack-design-quality`, `hq-pack-gemini`, and `hq-pack-gstack`. Install one from git:

```bash
hq install github:indigoai-us/hq-packages#packages/hq-pack-gstack
```

The former `hq-pack-engineering` pack has been absorbed back into hq-core. Its dev skills, workers, knowledge, and policies now ship with core. If an older upgrade installed it, remove it with `hq packs uninstall hq-pack-engineering`.

## Creator Marketplace

Every pack can credit a **creator** — the person behind the skills, workers, or knowledge it ships. Creators get a public profile at `hqforwork.com/creators/<handle>` listing the packs they've published, with their bio and links.

**Claimable profiles.** HQ grows its catalog by curating the best of the open-source ecosystem, so a creator may have a profile *before they've ever signed up*. When a pack credits an author who hasn't joined yet, their profile renders an **"is this you? Claim it"** state — the real author can claim the handle, which links it to their account and lets them manage their packs, bio, and links from then on. Attribution always points at the true author; nothing is published under someone else's name without crediting them.

**The pack-porter.** A semi-automated workflow imports permissively-licensed open-source skills into HQ packs. It runs a strict pipeline: a **license gate first** (only clear permissive licenses like MIT/Apache are ported; no-license repos are held and link-only), then maps the upstream skill bundle into a pack, then a **security scan** that must pass before anything is distributed — populating the pack's `capabilities` trust signal by static inspection. Ported packs record their origin in an `upstream` provenance block so updates can track the source repo over time. Co-marketing announcements are drafted but held until the credited creator claims or consents.

## What's in a Package?

A pack's `package.yaml` names the pack, its version and publisher, the hq-core version it requires, and a `contributes` block listing what it adds:

| Content type | Example |
|-------------|---------|
| Workers | Campaign operations worker |
| Commands | `/adobe-deploy` |
| Skills | Agent browser automation |
| Knowledge | Industry-specific guides |
| Policies | Compliance rules |
| Hooks | Pre-commit checks |
| Scripts | Helper shell scripts |

Optional fields record the `author`, the `upstream` source for ported packs, and the `capabilities` the pack uses.

## Installing and managing packs

`hq install <source>` accepts:

| Source | Example |
|--------|---------|
| Bare slug, resolved through the HQ marketplace (requires HQ sign-in) | `hq install <slug>` |
| npm package | `hq install @scope/name@1.2.0` |
| Git URL or GitHub shorthand | `hq install github:owner/repo#packages/<pack>@<ref>` |
| Local path | `hq install ./my-pack` |

The installer fetches the pack, validates `package.yaml`, asks before installing hooks or registering MCP servers (skip the prompts with `--allow-hooks` and `--allow-mcp`), moves the pack into `core/packages/<name>/`, and wires its contributions into the HQ instance. Git installs are pinned to a commit SHA unless you pass `--branch`.

Marketplace installs are verified before extraction: the CLI recomputes the SHA-256 of the downloaded tarball, compares it with the approved listing, and checks the platform's Ed25519 signature over that hash. Marketplace installs always require a valid signature. An unsigned local directory needs `--allow-unsigned`.

Day-to-day commands:

```bash
hq packs list                    # installed packs and the curated catalog
hq packs list --check-updates    # also check each pack for updates
hq packs update [name]           # re-install the latest version
hq packs uninstall <name>        # un-wire and archive a pack
```

`hq packages list` shows the same view as `hq packs list`. Installed content packs are tracked by their presence under `core/packages/`; they have no separate registry file.

`hq remove <slug>` (also `hq packages remove`) and `hq packages update` are older commands for the legacy package layout under `packages/installed/`, tracked in `packages/registry.yaml`. They do not act on content packs in `core/packages/`. Use `hq packs uninstall` and `hq packs update` for packs.
