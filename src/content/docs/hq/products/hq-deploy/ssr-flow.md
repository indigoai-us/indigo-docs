---
title: SSR Deploys
description: Server-rendered app deployment — Next.js through OpenNext and Hono through the Fetch adapter, each on a per-app Lambda.
---

Server-rendered apps run on a per-app AWS Lambda function. Next.js apps are built with OpenNext; Hono apps are packaged through the Fetch adapter. Static assets are still served from S3 through CloudFront.

## Next.js

```
hq-deploy deploy
  │
  ├─ 1. Adapter checks: supported Next.js version, routing translation, compatibility checks
  ├─ 2. Build with a pinned OpenNext version → server function zip + static assets
  ├─ 3. Upload the server function and assets
  └─ 4. API deploys the server function to the app's Lambda,
        publishes a new version, and points the app at it
```

- The local build needs a Node 20 Linux x64 environment that matches the Lambda runtime (Amazon Linux 2023). On other hosts the CLI stops with an error that says so.
- The server function zip must fit Lambda's size limits (50 MB zipped for a direct upload, 250 MB unzipped including the shared layer). The CLI checks this before uploading.
- Each deploy publishes an immutable Lambda version. `hq-deploy promote` and `hq-deploy rollback` point an environment at an existing healthy deployment.

## Hono

Hono is detected from the `hono` dependency in `package.json`. The CLI resolves the app's Fetch entrypoint, builds a deploy manifest, and uploads the source as a `fetch` deploy. The API bundles it into a per-app Lambda.

## Per-app function

Each Next.js or Hono app gets:

- its own Lambda function and its own IAM role, with no long-lived keys
- an app identity registered with the HQ vault, so the function can read the secrets bound to the app
- a route on the shared front door that maps the app's subdomain to its function

Secret values are never written into the function's environment; it receives references only.

## Legacy container path (dormant)

Earlier versions deployed server-rendered apps as Docker containers on ECS Fargate behind an Application Load Balancer. That path is dormant. Remix and server-mode Astro apps still route to it in the CLI, but it is not supported for new apps. Use Next.js, Hono, or a static build.
