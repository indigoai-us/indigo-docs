---
title: HQ Deploy Platform
description: A PaaS for deploying static sites and server-rendered web applications to AWS.
sidebar:
  order: 1
---

> Part of the split [HQ ecosystem](/hq/architecture/2-ecosystem/). HQ Deploy is the `hq-deploy` data plane; deployments are visible in the [hq-console](/hq/products/hq-console/) admin UI, and it trusts the shared identity provisioned by [hq-pro](/hq/products/hq-pro/about/).

HQ Deploy is a **platform-as-a-service** built on AWS that lets you deploy web applications with a single CLI command. It supports static sites (S3 + CloudFront) and server-rendered Next.js and Hono apps (a per-app AWS Lambda function).

## How It Works

```
Developer                    Control Plane                  AWS Data Plane
─────────                    ─────────────                  ──────────────
hq-deploy deploy ──────────► POST /api/apps/:id/deploy
                              │
                              ├─ Static? ──► S3 upload + CloudFront invalidation
                              │
                              └─ Next.js / Hono? ──► per-app Lambda function
                                                              │
                                                              ▼
                                                    {app}.indigo-hq.com ◄── edge routing
                                                    {app}.hq.work
```

1. **You run `hq-deploy deploy`** — the CLI detects your framework (Next.js, Hono, Astro, Vite, or plain static), builds your project, and uploads the output.
2. **The control plane processes the deploy** — creates an app record, provisions DNS, and routes the build artifact to the right infrastructure.
3. **The edge handles routing** — inspects the `Host` header, looks up the app, and routes to S3 (static) or to the app's function (server-rendered).

## Key Features

- **Framework detection** — Automatically identifies Next.js, Hono, Astro, Vite, and plain static sites.
- **HQ sign-in** — HQ Cognito tokens and HQ API keys (`hqk_`); see [Authentication](/hq/products/hq-deploy/authentication/).
- **Multi-tenant** — Each org gets isolated resources. Cross-tenant access is impossible at the query level.
- **Infrastructure template** — `hq-deploy init` writes a CloudFormation template you can deploy in your own AWS account.
- **Promote and rollback** — Each deploy is kept; `hq-deploy promote` and `hq-deploy rollback` point an environment at an earlier healthy deployment.
- **[In-context comments](/hq/products/hq-deploy/comments/)** — Viewers leave feedback directly on a gated deploy, anchored to a point or a region and tagged to their identity, behind the same access gate as the deploy.

## Projects That Built This

The deploy platform was constructed across a series of sequential projects, each building on the last. Later work replaced several of them: Clerk auth gave way to HQ Cognito sign-in, the ECS container path for SSR is dormant, and the enterprise init and upgrade commands were not shipped in the CLI.

1. **Repo scaffold** — TypeScript strict mode, ESLint, directory structure
2. **Domain hosting** — Route 53, ACM cert, S3 bucket, CloudFront
3. **DB + API scaffold** — Aurora/Neon Postgres, Drizzle ORM, Hono server
4. **Dual auth** — Clerk JWT, API keys
5. **App DNS API** — App registration, subdomain generation, CNAME management
6. **Static flow** — Upload, extract, S3 sync, cache invalidation
7. **SSR infra** — ECS cluster, ECR, ALB, Lambda@Edge routing
8. **SSR flow** — Docker build, ECR push, ECS rolling deploy
9. **CLI** — Framework detection, deploy command, login flow
10. **E2E tests** — Staging infra, integration test suite
11. **Multi-tenant** — Org model, context middleware, scoped queries
12. **Enterprise init** — AWS credential resolution, CloudFormation deployment
13. **CloudFormation template** — Parameterized IaC for customer accounts
14. **Upgrade flow** — Version drift detection, ChangeSet preview
