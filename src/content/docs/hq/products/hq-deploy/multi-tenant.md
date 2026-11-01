---
title: Multi-Tenant Orgs
description: Organization model with resource isolation across tenants.
---

HQ Deploy is multi-tenant. Every app belongs to an organization, and every authenticated request is resolved to one org before it reaches a route handler.

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
2. HQ API key (hqk_) → the company the vault bound the key to
   (X-Org-Slug is rejected for these keys)
3. Legacy API key → the key owner's org
4. GitHub JWT → the user's org
5. HQ Cognito JWT → the caller's membership
6. Personal deploy scope (X-HQ-Deploy-Scope: personal) on deploy and app routes
7. Admin token → must name the org with the X-Org-Slug header
```

The resolved org is attached to the request context and available to all downstream handlers. If no org can be resolved, the request gets `403`.

## Query Isolation

Data lives in a single DynamoDB table. Org metadata, app records, and members sit under the org's `ORG#{slug}` partition key. Deploys and access policies sit under the app's `APP#{appId}` partition; comments and analytics use per-app `COMMENTS#{appId}` and `ANALYTICS#{appId}` partitions. Isolation is enforced in the API routes: before reading or changing an app or its deploys, a route loads the app under the caller's resolved org and checks that the org owns it. Reads of an app the caller's org does not own return **404**, so a caller can't tell "doesn't exist" from "exists in another org". Writes to such an app return 404 or 403.

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
