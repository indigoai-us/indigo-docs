---
title: HQ Deploy Platform
description: A complete PaaS for deploying static and SSR web applications to AWS.
sidebar:
  order: 1
---

> Part of the split [HQ ecosystem](/hq/architecture/2-ecosystem/). HQ Deploy is the `hq-deploy` data plane; deployments are visible in the [hq-console](/hq/products/hq-console/) admin UI, and it trusts the shared identity provisioned by [hq-pro](/hq/products/hq-pro/).

HQ Deploy is a **platform-as-a-service** built on AWS that lets you deploy web applications with a single CLI command. It supports both static sites (S3 + CloudFront) and server-rendered apps (ECS Fargate + ALB).

## How It Works

```
Developer                    Control Plane                  AWS Data Plane
─────────                    ─────────────                  ──────────────
hq-deploy deploy ──────────► POST /api/apps/:id/deploy
                              │
                              ├─ Static? ──► S3 upload + CloudFront invalidation
                              │
                              └─ SSR? ────► Docker build + ECR push + ECS rolling deploy
                                                              │
                                                              ▼
                                                    {app}.indigo-hq.com ◄── Lambda@Edge routing
```

1. **You run `hq-deploy deploy`** — the CLI detects your framework (Next.js, Remix, Astro, Vite, etc.), builds your project, and uploads the output.
2. **The control plane processes the deploy** — creates an app record, provisions DNS, and routes the build artifact to the right infrastructure.
3. **Lambda@Edge handles routing** — inspects the `Host` header, looks up the app in DynamoDB, and routes to either S3 (static) or ALB (SSR).

## Key Features

- **Framework detection** — Automatically identifies Next.js, Remix, Astro, Vite, and plain static sites.
- **Dual auth** — Use platform API keys for simplicity, or AWS SSO for enterprise environments.
- **Multi-tenant** — Each org gets isolated resources. Cross-tenant access is impossible at the query level.
- **Enterprise self-hosting** — Provision the full stack in a customer's AWS account via CloudFormation.
- **Zero-downtime SSR deploys** — ECS rolling updates with `minimumHealthyPercent=100`.
- **Upgrade management** — ChangeSet previews with dry-run mode for enterprise stack updates.

## Projects That Built This

The deploy platform was constructed across 15 sequential projects, each building on the last:

1. **Repo scaffold** — TypeScript strict mode, ESLint, directory structure
2. **Domain hosting** — Route 53, ACM cert, S3 bucket, CloudFront
3. **DB + API scaffold** — Aurora/Neon Postgres, Drizzle ORM, Hono server
4. **Dual auth** — Clerk JWT, API keys, AWS SigV4
5. **App DNS API** — App registration, subdomain generation, CNAME management
6. **Static flow** — Upload, extract, S3 sync, cache invalidation
7. **SSR infra** — ECS cluster, ECR, ALB, Lambda@Edge routing
8. **SSR flow** — Docker build, ECR push, ECS rolling deploy
9. **CLI** — Framework detection, deploy command, login flow
10. **E2E tests** — Staging infra, integration test suite
11. **Multi-tenant** — Org model, context middleware, scoped queries
12. **Enterprise init** — AWS credential resolution, CloudFormation deployment
13. **CloudFormation template** — Parameterized IaC for customer accounts
14. **AWS SSO auth** — Profile resolution, account-to-org matching
15. **Upgrade flow** — Version drift detection, ChangeSet preview
