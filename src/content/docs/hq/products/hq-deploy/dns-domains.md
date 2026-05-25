---
title: DNS & Domains
description: App registration, subdomain generation, and Route 53 DNS management.
---

Every deployed app gets a subdomain under the platform domain (e.g., `my-app.indigo-hq.com`). DNS records are managed automatically via Route 53.

## App Registration

```
POST /api/apps
{
  "name": "My Cool App"
}
```

The API auto-generates a subdomain from the app name:
- Lowercased, spaces replaced with hyphens
- Must be 3–63 characters, alphanumeric + hyphens only
- Validated for uniqueness against all orgs
- Reserved names are rejected: `api`, `www`, `admin`, `app`, `dashboard`

## DNS Provisioning

When an app is created, a Route 53 CNAME record is automatically provisioned:

```
my-cool-app.indigo-hq.com → d1234567890.cloudfront.net
```

If DNS creation fails, the app record is marked `dns-failed` and can be retried. The app is not rolled back — this allows manual DNS debugging.

## Domain Infrastructure

| Resource | Details |
|----------|---------|
| **Domain** | `indigo-hq.com` (pre-registered) |
| **Route 53 Hosted Zone** | Wildcard zone for `*.indigo-hq.com` |
| **ACM Certificate** | Wildcard cert (`*.indigo-hq.com`) in us-east-1, DNS-validated |
| **CloudFront** | Single distribution with the wildcard cert |

## App Deletion

```
DELETE /api/apps/:id
```

1. Route 53 CNAME is deleted (non-blocking on failure)
2. Deploy records are soft-deleted (archived status)
3. App record is removed

DNS deletion is intentionally non-blocking — if it fails, the CNAME becomes a dangling record that can be cleaned up later, rather than leaving the app in a half-deleted state.

## App Listing

```
GET /api/apps
```

Returns all apps for the authenticated org, sorted by `created_at` descending. Includes subdomain, type (static/SSR), deploy count, and DNS status.
