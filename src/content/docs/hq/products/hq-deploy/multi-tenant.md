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
  "slug": "acme-corp",
  "auth_mode": "aws-sso",
  "aws_account_id": "123456789012"
}
```

| Field | Purpose |
|-------|---------|
| `slug` | Unique identifier, used in URLs and file paths |
| `auth_mode` | `platform` (Clerk/API key) or `aws-sso` (SigV4) |
| `aws_account_id` | Required for `aws-sso` mode, validated format |

## Org Context Resolution

Every authenticated request resolves an org through middleware:

```
Resolution priority:
1. Clerk JWT claim (orgId)
2. API key lookup → associated org
3. AWS account ID match → org
```

The resolved org is attached to `req.org` and available to all downstream handlers.

## Query Isolation

All database queries are automatically scoped:

```typescript
// Every query includes org scope
const apps = await db
  .select()
  .from(appsTable)
  .where(eq(appsTable.orgId, req.org.id));
```

The `withOrgScope(query, orgId)` helper enforces this pattern. Cross-tenant access returns **404** (not 403) to prevent resource enumeration — an attacker can't distinguish "doesn't exist" from "exists but you can't access it."

## Default Org

On first boot, a default org is seeded:

```
slug: 'indigo'
auth_mode: 'platform'
```

Existing records without an `org_id` are backfilled to this default org. The seed is idempotent (`INSERT ... ON CONFLICT DO NOTHING`).

## Org Lifecycle

| Endpoint | Action |
|----------|--------|
| `POST /api/orgs` | Create new org |
| `GET /api/orgs` | List all orgs (admin only) |
| `GET /api/orgs/:id` | Get org details |
| `DELETE /api/orgs/:id` | Soft-delete (preserves data) |
