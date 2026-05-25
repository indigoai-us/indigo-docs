---
title: Upgrades
description: Enterprise stack upgrade flow with ChangeSet preview and dry-run support.
---

When the CloudFormation template is updated with new features or fixes, enterprise customers can upgrade their stack through a safe, preview-first workflow.

## Upgrade Flow

```
hq-deploy upgrade --org acme-corp
    │
    ├── 1. Version drift detection
    │     Reads templateVersion from ~/.hq-deploy/orgs/acme-corp.json
    │     Compares against bundled Metadata.Version
    │     Legacy stacks (no version) treated as v0.0.0
    │
    ├── 2. ChangeSet creation
    │     Creates a CloudFormation ChangeSet (not applied yet)
    │
    ├── 3. Human-readable diff
    │     Shows Add/Modify/Remove for each resource
    │     Warns about replacements (resource recreation)
    │
    ├── 4. Explicit confirmation
    │     "Apply these changes? (y/N)"
    │
    ├── 5. Stack update
    │     ExecuteChangeSet with real-time event polling
    │     Updates org config on UPDATE_COMPLETE
    │
    └── 6. Rollback handling
          Surfaces root cause on UPDATE_ROLLBACK_COMPLETE
```

## Dry-Run Mode

```bash
hq-deploy upgrade --org acme-corp --dry-run
```

Dry-run creates a ChangeSet, displays the diff, then **deletes** the ChangeSet without applying it. The output is formatted for CAB (Change Advisory Board) review tickets and includes:

- Version diff (current → target)
- Resource-level changes with risk assessment
- Rollback plan
- Estimated downtime (zero for most changes)

## Version Management

Each deployed stack tracks its template version in the local org config file. This enables:

- **Drift detection** — Know immediately when an update is available
- **Incremental upgrades** — Only apply changes between current and target versions
- **Rollback awareness** — The upgrade flow knows what the previous state was
