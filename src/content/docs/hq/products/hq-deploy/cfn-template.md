---
title: CloudFormation Template
description: Parameterized IaC template for provisioning customer data plane resources.
---

The CloudFormation template (`src/infra/cloudformation/template.yaml` in the hq-deploy repo) provisions the HQ Deploy data plane. It's parameterized, supports conditional SSR resources, and includes a cross-account IAM role for the control plane. It is deployed with the repo's own scripts (`scripts/bootstrap.sh`); no `hq-deploy` CLI command deploys it.

`hq-deploy init` is separate: it writes a smaller starter template into your project (see [Deploy CLI](/hq/products/hq-deploy/cli/#init)).

## Parameters

Selected parameters (the template also takes Cognito, front-door, shared-layer (`SharedDepsLayerS3Key`), and throttling parameters):

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `OrgSlug` | Yes | — | Organization identifier (used in resource naming) |
| `CompanyUid` | Yes | — | Company UID from the control-plane org record |
| `DomainName` | Yes | — | Base domain (e.g., `deploy.acme.com`) |
| `HostedZoneId` | No | — | Existing Route 53 hosted zone for the domain; when set, the template creates DNS records in it |
| `VpcId` | Only with `EnableSSR=true` | — | VPC for ALB and ECS |
| `SubnetIds` | Only with `EnableSSR=true` | — | Comma-separated subnet IDs for ALB and ECS |
| `Region` | No | `us-east-1` | AWS region |
| `EnableSSR` | No | `false` | Provision ECS Fargate infrastructure |
| `ControlPlaneAccountId` | No | — | AWS account ID for cross-account trust |

## Resources Created

### Always Created (Static Hosting)

| Resource | Name Pattern | Purpose |
|----------|-------------|---------|
| S3 Bucket | `hq-deploy-{OrgSlug}-assets` | Asset storage with versioning |
| CloudFront Distribution | — | Global CDN with wildcard cert |
| ACM Certificate | `*.{DomainName}` | Wildcard TLS (us-east-1, DNS validation) |
| DynamoDB Table | `hq-deploy-{OrgSlug}` | Single table for orgs, apps, deploys, and related records |
| Lambda@Edge | — | Subdomain router |

The template does not create a hosted zone. When `HostedZoneId` is set, it adds a wildcard `*.{DomainName}` alias record for CloudFront to that zone.

### Conditional (per-app functions — when `SharedDepsLayerS3Key` is set)

Next.js and Hono apps run on these resources.

| Resource | Name Pattern | Purpose |
|----------|-------------|---------|
| Lambda Layer | `hq-deploy-{OrgSlug}-shared-deps` | Shared runtime dependencies for every per-app function |
| API Gateway HTTP API + router Lambda | — | Shared front door that routes `{app}.{domain}` to the app's function |
| Route 53 Record | `front-door.{DomainName}` | Alias to the front door (only when `HostedZoneId` is set) |

### Conditional (dormant ECS path — when `EnableSSR=true`)

| Resource | Purpose |
|----------|---------|
| ECS Fargate Cluster | Container orchestration |
| ALB + HTTPS Listener | Load balancing with wildcard cert |
| ECR Repository | Docker image storage |
| Security Groups | CloudFront prefix list for ALB ingress |

### IAM

| Role | Trust | Scope |
|------|-------|-------|
| `hq-deploy-{OrgSlug}-deployer` | The stack's own account, plus the control plane account if `ControlPlaneAccountId` is set | `hq-deploy-*` resources only |

Cross-account assumption requires the **ExternalId** `hq-deploy-{OrgSlug}` to prevent the confused deputy problem — a third party can't assume the role even if they know the ARN.

## Outputs

| Output | Description |
|--------|-------------|
| `DeployRoleArn` | ARN of the cross-account deploy role |
| `BucketName` | S3 bucket name for assets |
| `DistributionId` | CloudFront distribution ID |
| `TableName` | DynamoDB table name |
| `HostedZoneId` | The hosted zone passed in (only when `HostedZoneId` is set) |

## Version Tracking

The template records its version in `Metadata.Version`:

```yaml
Metadata:
  Version: '2.1.0'
```

There is no `hq-deploy upgrade` command; stack updates are applied with the repo's deploy scripts.
