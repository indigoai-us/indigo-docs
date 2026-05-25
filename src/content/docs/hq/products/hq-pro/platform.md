---
title: Team Platform
description: Multi-tenant team management with entitlement packs and content sharing.
---

HQ Teams lets organizations share curated HQ content with team members through **entitlement packs** — named groups of file path patterns that control what each member receives.

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Team** | Maps to a company in HQ (`companies/{team-slug}/`) |
| **Entitlement Pack** | Named set of glob path patterns (e.g., "engineering", "design") |
| **Submission** | A branch submitted by a member for admin review |
| **Sparse Checkout** | Git mechanism that limits which files are cloned |

## How It Works

```
Admin creates team
    │
    ├── GitHub repo provisioned (via GitHub App)
    ├── Default entitlement pack created (paths: ['*'])
    ├── Admin gets full checkout
    │
    ▼
Admin curates content + creates packs
    │
    ├── "engineering" pack: workers/dev-*, knowledge/api/*
    ├── "design" pack: workers/design-*, knowledge/brand/*
    │
    ▼
Members join via invite
    │
    ├── Authenticated via GitHub device flow
    ├── Accept pending invite
    ├── Sparse checkout based on assigned packs
    └── companies/{team-slug}/ appears in their HQ
```

## Entitlements API

```
POST /api/teams/{id}/entitlements
{
  "packs": {
    "engineering": {
      "paths": ["workers/dev-*", "knowledge/api/*", "commands/deploy*"]
    },
    "design": {
      "paths": ["workers/design-*", "knowledge/brand/*"]
    }
  },
  "assignments": {
    "user-123": ["engineering"],
    "user-456": ["engineering", "design"]
  },
  "roleDefaults": {
    "admin": ["*"],
    "member": ["engineering"]
  }
}
```

Entitlements are stored in S3 (no separate database needed).

## Submissions

Members can contribute content back to the team through a review workflow:

1. Member runs `/submit` — pushes their changes to a branch
2. Admin sees submissions via `/list-submissions` or the web dashboard
3. Admin reviews the diff and runs `/approve-submission` or rejects with a reason
4. Approved submissions are merged via the GitHub API

## Peer Sharing

Quick file sharing without the full review process:

```
/share knowledge/my-guide.md --with alice@acme.com
```

Pushes to `shared/{sender}/{filename}` branch with `.alt.{author}` suffix to avoid conflicts.

## Web Dashboard

The admin dashboard provides:
- Pack management (create, edit, delete, assign)
- Submission review with GitHub diff view
- Member list with pack assignments
- Role-based defaults configuration
