---
title: Static Deploys
description: How static sites are deployed via S3, CloudFront, and Lambda@Edge.
---

Static deploys upload your built site to S3 and serve it globally through CloudFront with Lambda@Edge handling subdomain-based routing.

## Deploy Lifecycle

Each deploy moves through these states:

```
uploading → extracting → syncing → invalidating → live
```

1. **Uploading** — Client sends a tar.gz payload (max 100MB) to `POST /api/apps/:id/deploy`. Returns 202 with a deploy ID.
2. **Extracting** — Server extracts the archive to `/tmp/{deploy-id}/`.
3. **Syncing** — Files are uploaded to `s3://bucket/{app-id}/` with multipart upload for files >5MB. Previous versions are preserved at `_versions/{version}/`.
4. **Invalidating** — A CloudFront cache invalidation is triggered. Deploy is marked `live` after invalidation starts (it completes asynchronously).

## Lambda@Edge SPA Routing

A Lambda@Edge function handles origin-request events on the CloudFront distribution:

1. Extracts the subdomain from the `Host` header (e.g., `my-app` from `my-app.indigo-hq.com`)
2. Looks up the app in DynamoDB to determine if it's static or SSR
3. For static apps: rewrites the request URI to the correct S3 prefix (`/{app-id}/path`)
4. **SPA fallback**: If the requested path doesn't have a file extension, it rewrites to `/{app-id}/index.html`
5. Unknown subdomains return a 404 response

The Lambda@Edge function must stay under the **1MB code limit** — this is a hard AWS constraint.

## S3 Bucket Structure

```
s3://hq-deploy-assets/
  {app-id-1}/
    index.html
    assets/
      main.js
      style.css
    _versions/
      v1/
      v2/
  {app-id-2}/
    ...
```

Each app gets its own prefix. Versioning is handled at the application level (not S3 versioning) so previous deploys can be rolled back by copying from `_versions/`.

## Deploy History

```
GET /api/apps/:id/deploys
```

Returns a list of all deploys for an app, ordered by creation date. Each record includes:
- Deploy ID, version number, status
- File count, total size
- Created timestamp, completed timestamp
- Who triggered the deploy (user ID)
