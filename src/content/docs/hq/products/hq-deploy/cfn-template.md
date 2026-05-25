---
title: CloudFormation Template
description: Parameterized IaC template for provisioning customer data plane resources.
---

The CloudFormation template provisions all AWS resources needed for HQ Deploy in a customer's account. It's parameterized, supports conditional SSR resources, and includes a cross-account IAM role for the control plane.

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `OrgSlug` | Yes | — | Organization identifier (used in resource naming) |
| `DomainName` | Yes | — | Base domain (e.g., `deploy.acme.com`) |
| `VpcId` | Yes | — | VPC for ALB and ECS (SSR only) |
| `SubnetIds` | Yes | — | Comma-separated subnet IDs |
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
| Route 53 Hosted Zone | `{DomainName}` | DNS management |
| Lambda@Edge | — | Origin-request subdomain router |

### Conditional (SSR — when `EnableSSR=true`)

| Resource | Purpose |
|----------|---------|
| ECS Fargate Cluster | Container orchestration |
| ALB + HTTPS Listener | Load balancing with wildcard cert |
| ECR Repository | Docker image storage |
| Security Groups | CloudFront prefix list for ALB ingress |

### IAM

| Role | Trust | Scope |
|------|-------|-------|
| `hq-deploy-deployer` | Control plane account (if provided) | `hq-deploy-*` resources only |

The deploy role uses an **ExternalId condition** to prevent the confused deputy problem — a third party can't assume the role even if they know the ARN.

## Outputs

| Output | Description |
|--------|-------------|
| `DeployRoleArn` | ARN of the cross-account deploy role |
| `BucketName` | S3 bucket name for assets |
| `DistributionId` | CloudFront distribution ID |
| `HostedZoneId` | Route 53 hosted zone ID |

## Version Tracking

The template includes `Metadata.Version` which is used by the upgrade flow to detect drift between the installed stack and the latest template version.

```yaml
Metadata:
  Version: "1.0.0"
```

This version is read during `hq-deploy upgrade` to determine what changes need to be applied.
