---
title: Claude Merge
description: How Claude Code merges package contents into HQ directories with conflict detection.
---

After the CLI downloads and extracts a package, Claude Code handles the actual merge into HQ directories. This two-step design separates the security boundary (CLI verification) from the intelligence boundary (Claude conflict detection).

## Merge Command

```
/package-install adobe-campaign-ops
```

Claude reads the extracted package from `packages/installed/adobe-campaign-ops/` and merges each content type:

| Content | Merge Target | Strategy |
|---------|-------------|----------|
| Workers | `workers/public/` or `companies/{co}/workers/` | Copy worker.yaml + knowledge dir |
| Commands | `.claude/commands/` | Copy .md files |
| Skills | `.claude/skills/` | Copy skill directory |
| Knowledge | `knowledge/public/` | Copy directory tree |
| Policies | `.claude/policies/` | Copy .md files |
| Hooks | `.claude/hooks/` | **Requires explicit consent** |

## Conflict Detection

Claude checks for existing files at each target path before merging. Conflicts are never silently overwritten:

```
Conflict detected:
  workers/public/campaign-ops/worker.yaml already exists
  
Options:
  (1) Overwrite with package version
  (2) Keep existing, skip this file  
  (3) Abort merge entirely
```

## Hook Approval UX

Hooks are the most sensitive content type — they execute shell commands in response to Claude Code events. When a package includes hooks:

1. Claude displays the full contents of each hook script
2. Explains what events trigger the hook
3. Requires explicit user approval before installing
4. No hook is installed without the user seeing its code

## Removal

```
/package-remove adobe-campaign-ops
```

Claude identifies package-installed content by the `pkg-<slug>-` prefix markers and removes:
- Workers with the package prefix
- Commands with the package prefix
- Skills, knowledge, policies, and hooks with the package prefix

The content allow-list (yaml, md, sh only) ensures that removal is complete — there are no compiled artifacts or runtime state to clean up.

## Why Two Steps?

| Step | Responsibility | Trust Level |
|------|---------------|------------|
| CLI download | Cryptographic verification | Machine trust (SHA256 + RSA) |
| Claude merge | Semantic conflict detection | AI judgment (context-aware) |

The CLI can verify that a tarball is authentic and untampered. But it can't know whether merging a worker will conflict with existing workers, or whether a policy contradicts existing policies. That's Claude's job.
