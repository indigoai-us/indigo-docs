---
title: SSR Deploys
description: Server-rendered app deployment via ECS Fargate, ECR, and ALB.
---

SSR deploys run your server-rendered application as a Docker container on ECS Fargate, fronted by an Application Load Balancer with host-based routing.

## Infrastructure

The SSR infrastructure is provisioned once per environment:

| Resource | Purpose |
|----------|---------|
| **ECS Fargate Cluster** | `hq-deploy-ssr` in us-east-1, Container Insights enabled |
| **ECR Repository** | `hq-deploy-apps`, immutable tags, lifecycle policy (last 10 per app) |
| **ALB** | HTTPS listener with wildcard ACM cert, HTTP→HTTPS redirect |
| **CloudFront** | ALB as second origin, `CachingDisabled` policy, `X-CF-Secret` header verification |

## Deploy Lifecycle

```
building → pushing → deploying → stabilizing → live
```

1. **Building** — Docker image is built from the project's Dockerfile (or a generated one). Tagged as `hq-deploy-apps:{app-id}:{version}`.
2. **Pushing** — Image is pushed to ECR.
3. **Deploying** — A new ECS task definition is registered (0.25 vCPU, 0.5 GB RAM, PORT=3000).
4. **Stabilizing** — ECS performs a rolling update with `minimumHealthyPercent=100` and `maximumPercent=200`. The service must stabilize within 5 minutes.
5. **Live** — Once stable, the deploy record is marked live.

## ALB Host-Based Routing

Each app gets its own ALB target group with a host-based routing rule:

```
Rule: Host = {subdomain}.indigo-hq.com → Target Group for {app-id}
Priority: app DB id + 100 offset
Deregistration delay: 30 seconds
```

## Lambda@Edge Routing (SSR Path)

The same Lambda@Edge function that handles static routing also handles SSR:

1. Extracts subdomain from `Host` header
2. Checks app type in DynamoDB (60-second cache TTL)
3. If SSR → forwards request to ALB origin
4. If Static → forwards to S3 origin
5. If unknown → returns 404

## ECS Task Configuration

```
CPU: 0.25 vCPU
Memory: 0.5 GB
Port: 3000
Health check: GET /health
Logs: /hq-deploy/ssr/{app-id} (CloudWatch)
Max revisions: 10
```

The health check endpoint (`GET /health`) is mandatory — your app must respond with a 200 status on this path for the rolling deploy to succeed.

## Zero-Downtime Deploys

Rolling deploys ensure zero downtime:

- `minimumHealthyPercent=100` — The old task keeps running until the new one is healthy
- `maximumPercent=200` — Both old and new tasks run simultaneously during transition
- **5-minute stabilization timeout** — If the new task doesn't become healthy, the deploy is marked failed and the old task continues serving traffic
