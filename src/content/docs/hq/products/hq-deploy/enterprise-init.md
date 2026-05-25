---
title: Enterprise Init
description: Provision HQ Deploy infrastructure in a customer's AWS account via CloudFormation.
---

Enterprise customers can run the full HQ Deploy stack in their own AWS account. The `hq-deploy init` CLI subcommand handles provisioning.

## Workflow

```
hq-deploy init
    │
    ├── 1. Resolve AWS credentials
    │     (env vars → SSO cache → aws-vault → ~/.aws/credentials)
    │
    ├── 2. STS GetCallerIdentity
    │     Confirm: "Deploy to account 123456789012? (y/N)"
    │
    ├── 3. Pre-flight permission check
    │     IAM SimulatePrincipalPolicy for all required APIs
    │     Reports ALL missing permissions upfront
    │
    ├── 4. Deploy CloudFormation stack
    │     Real-time event polling during deployment
    │
    ├── 5. Save outputs
    │     ~/.hq-deploy/orgs/<slug>.json
    │
    └── 6. (Optional) Register with control plane
          --saas flag calls POST /api/orgs
```

## Pre-Flight Checks

Before deploying any resources, the CLI uses `IAM SimulatePrincipalPolicy` to dry-run every API call the CloudFormation template will make. This catches permission issues before any resources are created.

Missing permissions are reported in a table:

```
Missing Permissions:
  ✗ cloudfront:CreateDistribution
  ✗ s3:CreateBucket
  ✗ route53:ChangeResourceRecordSets
  
Required IAM policy: See docs/enterprise-iam-policy.json
```

## Deployment Modes

| Flag | Behavior |
|------|----------|
| (default) | Local-only — provisions AWS resources, saves config locally |
| `--saas` | Also registers the org with the HQ Deploy control plane API |

Local-only mode is fully self-contained — the customer's HQ Deploy CLI communicates directly with their AWS resources using SSO credentials, without any dependency on the central control plane.

## Output File

After successful provisioning, outputs are saved to `~/.hq-deploy/orgs/<slug>.json`:

```json
{
  "slug": "acme-corp",
  "aws_account_id": "123456789012",
  "region": "us-east-1",
  "deploy_role_arn": "arn:aws:iam::role/hq-deploy-deployer",
  "bucket_name": "hq-deploy-acme-corp-assets",
  "distribution_id": "E1234567890",
  "hosted_zone_id": "Z1234567890",
  "template_version": "1.0.0"
}
```

This file is used by the CLI for subsequent deploys and by the upgrade flow for version tracking.
