---
title: Deploy CLI
description: The hq-deploy CLI — framework detection, dual auth, and one-command deploys.
---

The `hq-deploy` CLI is the primary interface for deploying apps to the HQ Deploy platform. Install globally or run via npx.

## Subcommands

| Command | Description |
|---------|-------------|
| `hq-deploy deploy` | Build and deploy the current project |
| `hq-deploy login` | Authenticate with a platform API key |
| `hq-deploy init` | Scaffold enterprise CloudFormation templates |
| `hq-deploy apps` | List your deployed applications |
| `hq-deploy logs` | View deploy and application logs |
| `hq-deploy auth-mode` | Switch between `platform` and `aws-sso` auth |

## Framework Detection

The CLI automatically detects your framework by scanning config files:

| Detection Order | Config File | Deploy Type |
|----------------|-------------|-------------|
| 1 | `next.config.*` | SSR |
| 2 | `remix.config.*` | SSR |
| 3 | `astro.config.*` | SSR (if `output: server`) or Static |
| 4 | `vite.config.*` | Static |
| 5 | (fallback) | Static |

Detection results are cached in `.hq-deploy/detected.json` for subsequent deploys.

## Deploy Flow

### Static Sites

```bash
hq-deploy deploy
# 1. Detects framework → "vite" (static)
# 2. Runs build command (npm run build)
# 3. Creates tar.gz of build output
# 4. Uploads to POST /api/apps/:id/deploy
# 5. API extracts to S3, invalidates CloudFront
# 6. Live at {app}.indigo-hq.com
```

### SSR Applications

```bash
hq-deploy deploy
# 1. Detects framework → "next" (SSR)
# 2. Builds Docker image
# 3. Tags and pushes to ECR
# 4. API creates ECS task definition
# 5. Rolling deploy to Fargate
# 6. ALB host-based routing activates
# 7. Live at {app}.indigo-hq.com
```

## Authentication

### Platform Mode (default)

```bash
hq-deploy login
# Enter API key: hqd_xxxxxxxxxxxxxxxx
# Stored in ~/.hq-deploy/config.json (mode 0600)
```

### AWS SSO Mode

```bash
hq-deploy auth-mode set aws-sso
hq-deploy deploy --profile my-aws-profile
# Reads AWS credentials → STS GetCallerIdentity
# Maps account ID to org → deploys directly to S3/ECR/ECS
# Bypasses control plane API entirely
```

AWS SSO mode is designed for enterprise customers who want deploys to go directly to their own AWS account without routing through the control plane.

## Enterprise Init

```bash
hq-deploy init
# Interactive prompts:
#   Org slug: acme-corp
#   Domain: deploy.acme.com
#   VPC ID: vpc-xxxxx
#   Subnet IDs: subnet-aaa,subnet-bbb
#   Enable SSR? (y/N)
#
# 1. Validates AWS credentials (STS GetCallerIdentity)
# 2. Pre-flight permission check (IAM SimulatePrincipalPolicy)
# 3. Deploys CloudFormation stack
# 4. Saves outputs to ~/.hq-deploy/orgs/acme-corp.json
```
