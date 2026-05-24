---
title: Team Onboarding
description: CLI-native team onboarding — admin creation and member invite acceptance.
---

Team onboarding is built into `create-hq`, providing two distinct journeys depending on whether you're creating a team or joining one.

## Admin Journey

When an admin runs `create-hq` and has no pending invites:

```
1. "Do you have an HQ account?" → Yes → Device flow auth
2. Check for pending invites → None found
3. "Create a new team?"
4. List GitHub orgs (from user's GitHub account)
5. Check if HQ Team Sync App is installed
   └── Not installed → Opens browser for App install
6. Confirm team name
7. POST /api/teams/create-from-org
   └── Creates team, default 'base' pack (paths: ['*'])
   └── Creator assigned as admin
8. Scaffold companies/{team-slug}/
   └── Full directory structure (no sparse checkout for admin)
   └── team.json with team_id, org_login, etc.
9. Post-setup orientation (4-6 bullet points)
```

## Member Journey

When a member runs `create-hq` and has a pending invite:

```
1. "Do you have an HQ account?" → Yes → Device flow auth
2. Check for pending invites → Found!
   "You've been invited to join Acme Corp by alice@acme.com"
3. Accept invite → POST /api/teams/join
4. Fetch entitlements for assigned packs
5. Scaffold companies/{team-slug}/
   └── Sparse checkout for entitled paths only
   └── (or full checkout if pack has paths: ['*'])
6. Configure git credential helper for future pulls
7. Continue with normal HQ scaffold
```

## GitHub Org Discovery

The onboarding flow uses two API endpoints to understand the user's GitHub context:

- `GET /api/github/orgs` — Lists orgs the user belongs to
- `GET /api/github/installations` — Lists orgs where the HQ Team Sync App is installed

If an org has the user as a member but doesn't have the App installed, the flow guides them through installing it.

## Bug Fixes

This project also fixed two blocking auth bugs from the `hq-github-auth` project:

1. **Device poll parameter name** — The API now accepts both `device_code` and `deviceCode` to handle different client conventions
2. **Auth redirect** — `GET /api/auth/github/authorize` now returns a proper 302 redirect instead of a JSON 200 response

## Filesystem Setup

### Admin

```
companies/{team-slug}/
  knowledge/
  settings/
  data/
  workers/
  repos/
  projects/
  policies/
  team.json          # team_id, org_login, github_app_installation_id
  .claude/commands/  # Team-distributed commands
```

### Member (Sparse Checkout)

Only paths matching the assigned entitlement packs are checked out. Git credential helper is configured for `git pull` during future `/sync` operations.
