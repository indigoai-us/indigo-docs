---
title: Registry API
description: Package discovery, download, and admin management API hosted in indigo-nx.
---

The package registry is hosted as part of the indigo-nx application. It handles package discovery, gated downloads, and admin management.

## Public Endpoints (No Auth)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/packages` | List all available packages with metadata |
| `GET /api/packages/:slug` | Get package details, versions, description |

Public discovery allows anyone to browse available packages without authentication.

## Gated Endpoints (Clerk Auth + Entitlement)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/packages/:slug/download` | Download tarball (requires entitlement) |
| `GET /api/packages/my-entitlements` | List packages the user is entitled to |

Downloads require:
1. Valid Clerk JWT
2. Active entitlement for the requested package
3. Rate limit: 60 requests/minute

Response headers include integrity verification data:
- `X-Package-SHA256` — SHA256 hash of the tarball
- `X-Package-Signature` — RSA signature for authenticity

## Admin Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/packages` | Create new package |
| `PUT /api/packages/:slug` | Update package metadata |
| `DELETE /api/packages/:slug` | Remove package |
| `POST /api/packages/:slug/versions` | Upload new version |
| `POST /api/entitlements/grant` | Grant package access to a user |
| `DELETE /api/entitlements/revoke` | Revoke package access |

Version upload computes SHA256 and RSA signature server-side, then stores the tarball in a private S3 bucket with SSE encryption. Maximum tarball size: 50MB.

## Database Schema

```
packages
  id, slug, name, description, created_at, updated_at

package_versions
  id, package_id, version, s3_key, sha256, signature, size, created_at

package_entitlements
  id, user_id (Clerk), package_id, granted_by, granted_at, revoked_at

package_downloads (audit)
  id, user_id, package_id, version_id, downloaded_at, ip_address
```

## Admin UI

The admin panel (part of indigo-nx) provides a management interface:

- Package CRUD with drag-and-drop version upload
- Entitlement management (grant/revoke per user)
- Usage dashboard with download charts
- Replaces v1's JWT license generation flow
