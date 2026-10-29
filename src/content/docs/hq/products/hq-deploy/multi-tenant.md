---
title: Multi-Tenant Orgs
description: Organization model with resource isolation across tenants.
---

HQ Deploy is multi-tenant from the ground up. Every resource is scoped to an organization, and cross-tenant access is architecturally impossible.

## Org Model

```
POST /api/orgs
{
  "name": "Acme Corp",
  "slug": "acme-corp"
}
```

| Field | Purpose |
|-------|---------|
| `slug` | Unique identifier, used in URLs and file paths |

## Org Context Resolution

Every authenticated request resolves an org through middleware:

```
Resolution priority:
1. Org claim already on the verified token
2. Legacy API key → the key owner's org
3. AWS SigV4 → org mapped to the AWS account
4. GitHub JWT → the user's org
5. HQ Cognito JWT → the caller's membership
6. Personal deploy scope (X-HQ-Deploy-Scope: personal) on deploy and app routes
7. Admin token → must name the org with the X-Org-Slug header
```

The resolved org is attached to the request context and available to all downstream handlers. If no org can be resolved, the request gets `403`.

## Query Isolation

Data lives in a single DynamoDB table, and each org's items share an `ORG#{slug}` partition key. The `withOrgScope(orgSlug)` helper wraps reads and writes and refuses any key outside that org's partition. Cross-tenant access returns **404** (not 403) to prevent resource enumeration — an attacker can't distinguish "doesn't exist" from "exists but you can't access it."

## Default Org

On first boot, a default org is seeded:

```
slug: 'indigo'
```

The seed is idempotent: it uses a conditional `PutItem` that only writes when the org does not exist yet.

## Org Lifecycle

| Endpoint | Action |
|----------|--------|
| `POST /api/orgs` | Create new org |
| `GET /api/orgs` | List the caller's active memberships (the admin token lists all orgs) |
| `GET /api/orgs/:id` | Get org details |
| `GET /api/orgs/:orgId/members` | List org members |
| `DELETE /api/orgs/:id` | Soft-delete (sets `deletedAt`, preserves data) |
