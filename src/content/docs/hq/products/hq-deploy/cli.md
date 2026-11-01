---
title: Deploy CLI
description: The hq-deploy CLI — framework detection, sign-in, deploys, and app lifecycle commands.
---

The `hq-deploy` CLI is the primary interface for deploying apps to the HQ Deploy platform. Install globally or run via npx.

## Subcommands

| Command | Description |
|---------|-------------|
| `hq-deploy deploy` | Build and deploy the current project (see [Deploy flags](#deploy-flags)) |
| `hq-deploy login` | Authenticate with an HQ Cognito access token or a legacy API key |
| `hq-deploy logout` | Remove stored credentials |
| `hq-deploy init` | Scaffold a CloudFormation template for self-hosted infrastructure into the project (local files only) |
| `hq-deploy logs` | View bounded, scrubbed logs for a deployment (`-a, --app`, `-n, --lines`, `--cursor`, `--correlation`, `--deployment`, `--env`) |
| `hq-deploy inspect` | Inspect an app's deployments, environments, and health |
| `hq-deploy access` | Set an app to public, password, or private, and manage its allowlist |
| `hq-deploy domains` | Manage an app's URLs and custom domains, and the company's base domain (`domains edit <domain>` requires `--env`) |
| `hq-deploy promote` | Point an environment at an existing healthy deployment. Requires `--deployment <id>`; `--env` defaults to `production`. Static apps only |
| `hq-deploy rollback` | Restore a previous healthy deployment. Requires `--reason <text>`; `--deployment` and `--env` are optional. Static apps only |
| `hq-deploy config explain` | Print the resolved deploy plan and where each field came from |
| `hq-deploy doctor` | Run read-only deployment diagnostics |

`hq-deploy apps list` and `hq-deploy apps create` are registered but not implemented yet: they print "not yet implemented" and do nothing.

## Framework Detection

The CLI detects your framework by scanning the project:

| Detection Order | Signal | How it deploys |
|----------------|--------|----------------|
| 1 | `next.config.*` | Next.js adapter (OpenNext, per-app Lambda) |
| 2 | `remix.config.*` | SSR container path (dormant) |
| 3 | `astro.config.*` | Static, or the SSR container path if `output` is `server` or `hybrid` |
| 4 | `vite.config.*` | Static |
| 5 | `hono` in `package.json` dependencies | Fetch adapter (per-app Lambda) |
| 6 | (fallback) | Static |

A project with an `api/` directory of backend routes is detected as the `app` type. The CLI does not deploy that type yet and exits with guidance; `hq-deploy deploy --type static` deploys the frontend as a static site and ignores `api/`. Next.js and Hono projects with an `api/` directory still deploy through their adapters.

## Deploy flags

| Flag | Effect |
|------|--------|
| `-t, --type <type>` | Deployment type: `static`, `ssr`, or `app` (default `auto`, which uses detection) |
| `-d, --dir <directory>` | Project directory to deploy (default `.`) |
| `-p, --path <app-root>` | Application root directory (default: current directory) |
| `-e, --env <environment>` | Target environment (default `production`). Next.js and Hono accept only `production` |
| `--no-build` | Skip the build step |
| `--app-id <appId>` | Application ID to deploy to |
| `--link` | Link this directory to an HQ Deploy project and exit |
| `--json` | Print one versioned result object to stdout |

Next.js and Hono apps have one live production deployment that each deploy replaces. `promote`, `rollback`, and non-production `--env` work for static apps only; for Next.js and Hono they fail with `FRAMEWORK_SINGLE_DEPLOYMENT`.

## Deploy Flow

### Static Sites

```bash
hq-deploy deploy
# 1. Detects framework → "vite" (static)
# 2. Runs the build command (npm run build)
# 3. Creates a tar.gz of the build output
# 4. Uploads to POST /api/apps/:id/deploy
# 5. API extracts to S3 and invalidates CloudFront
# 6. Prints the live URL
```

### Next.js

```bash
hq-deploy deploy
# 1. Detects framework → "Next.js"
# 2. Checks the Next.js version and route compatibility
# 3. Builds with a pinned OpenNext version
# 4. Uploads the server function and static assets
# 5. API deploys the server function to the app's own Lambda and publishes a version
# 6. Prints the live URL
```

Next.js builds need a Node 20 Linux x64 environment that matches the Lambda runtime (Amazon Linux 2023).

### Hono

Hono apps are packaged through the Fetch adapter and deployed to a per-app Lambda in the same way.

### Other server-rendered frameworks

Remix and server-mode Astro still route to the older Docker/ECR/ECS container path. That path is dormant and not supported for new apps.

## App URLs

The deploy prints the URL the API returns for the app. By default that is `https://{app}.indigo-hq.com`; a company with a live base domain claimed through `hq-deploy domains base add` gets `https://{app}.{its-domain}`. The same edge also serves `https://{app}.hq.work`, and the CLI's lifecycle commands (`inspect`, `logs`, `domains`, `promote`, `rollback`) use `hq.work` as their default base domain (override with `BASE_DOMAIN`). See [Custom Domains](/hq/products/hq-deploy/custom-domains/) for your own hostnames.

## Authentication

```bash
hq-deploy login
# Enter your HQ Cognito access token or API key
# Stored in ~/.hq-deploy/config.json (mode 0600)
```

Non-interactive: `hq-deploy login --token <access-token>` or `hq-deploy login --key <api-key>`. Add `--org <slug>` to pick a company. `hq-deploy login --status` shows the current sign-in. See [Authentication](/hq/products/hq-deploy/authentication/).

## Init

`hq-deploy init` writes infrastructure files into the project. It does not call AWS or deploy anything.

```bash
hq-deploy init
# Interactive prompts:
#   AWS region [us-east-1]
#   Domain name [app.example.com]
#   Project name [my-app]
#   Enable SSR (ECS Fargate)? [y/N]
#
# Writes:
#   .hq-deploy/infra/cloudformation.yaml
#   .hq-deploy/infra/config.json
#   .hq-deploy/infra/README.md
# Prints an estimated monthly cost.
```

| Flag | Effect |
|------|--------|
| `-y, --yes` | Skip the prompts and use the defaults |
| `--template` | Print the CloudFormation template to stdout and write no files (the prompts still run unless `--yes` is passed) |
| `-d, --dir <directory>` | Target directory (default `.`) |

`init` checks for AWS credentials with `aws sts get-caller-identity` and only warns if none are found. You deploy the generated template yourself. See [CloudFormation Template](/hq/products/hq-deploy/cfn-template/).
