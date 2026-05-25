---
title: Cognito Setup (Admin)
description: One-time procedure to register GitHub as a federated identity provider in the hq-pro Cognito user pool.
---

The HQ Installer's **Continue with GitHub** button on [screen 2](/hq/products/hq-pro/quickstart/#screen-2--create-your-account) requires GitHub to be registered as a federated identity provider in the hq-pro Cognito user pool. This is a **one-time administrator setup** — once GitHub is registered, every installer user benefits. You do **not** need to repeat these steps for each install.

This page is for the person managing the hq-pro AWS account and the Indigo GitHub organization. End users never see this procedure.

## Current State

The hq-pro Cognito user pool as of the installer's launch:

| Field | Value |
|---|---|
| Pool name | `vault-users-dev2` |
| Pool ID | `us-east-1_fOMM6hDMZ` |
| Pool ARN | `arn:aws:cognito-idp:us-east-1:804849608251:userpool/us-east-1_fOMM6hDMZ` |
| Hosted UI domain | `vault-indigo-dev2.auth.us-east-1.amazoncognito.com` |
| AWS account | `804849608251` (profile: `indigo`) |
| Region | `us-east-1` |
| Stage deployed | `dev2` |
| GitHub IdP status | **Absent** — `list-identity-providers` returns an empty array |

The user pool client `vault-client-dev2` (ID `6hu2bg2gqdpfl9k1f2bpkgpf7o`) currently declares `supportedIdentityProviders: ["COGNITO"]`. The `infra/cognito.ts` file in hq-pro declares SSM parameters at `/vault/dev2/github/client-id` and `/vault/dev2/github/client-secret`, but both contain the placeholder value `PLACEHOLDER_CREATE_GITHUB_OAUTH_APP`.

## Prerequisites

- AWS admin access to the Indigo account (profile `indigo`, account `804849608251`).
- Permission to edit `infra/cognito.ts` in the hq-pro repo and deploy the SST stack.
- GitHub organization admin rights to create an OAuth App under Indigo.

## Step 1 — Create a GitHub OAuth App

Create the OAuth App that GitHub will use to identify the installer and issue tokens.

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Fill in the fields:
   - **Application name**: `HQ Installer (Vault)`
   - **Homepage URL**: `https://vault-indigo-{stage}.auth.us-east-1.amazoncognito.com`
   - **Authorization callback URL**: `https://vault-indigo-{stage}.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
3. Save the generated **Client ID** and **Client Secret**.
4. Write both into SSM:

```bash
aws --profile indigo ssm put-parameter \
  --name /vault/{stage}/github/client-id \
  --value <client-id> \
  --type SecureString --overwrite

aws --profile indigo ssm put-parameter \
  --name /vault/{stage}/github/client-secret \
  --value <client-secret> \
  --type SecureString --overwrite
```

Replace `{stage}` with `dev2` (or your target stage).

## Step 2 — Register GitHub as a Cognito User Pool IdP

Add a `UserPoolIdentityProvider` resource to `infra/cognito.ts` in the hq-pro repo:

```typescript
const githubIdP = new aws.cognito.UserPoolIdentityProvider("VaultGithubIdP", {
  userPoolId: userPool.id,
  providerName: "GitHub",
  providerType: "OIDC",           // GitHub supports OIDC since 2023
  providerDetails: {
    client_id: githubClientIdParam.value,
    client_secret: githubClientSecretParam.value,
    attributes_request_method: "GET",
    oidc_issuer: "https://token.actions.githubusercontent.com",
    authorize_scopes: "openid user:email read:user",
    // Or use GitHub's OAuth endpoints directly if OIDC discovery fails:
    // authorize_url: "https://github.com/login/oauth/authorize",
    // token_url: "https://github.com/login/oauth/access_token",
    // attributes_url: "https://api.github.com/user",
    // jwks_uri: "https://token.actions.githubusercontent.com/.well-known/jwks",
  },
  attributeMapping: {
    email: "email",
    username: "sub",
    "custom:github_username": "login",
    given_name: "name",
    picture: "avatar_url",
  },
});
```

:::caution
GitHub's native OIDC issuer (`https://token.actions.githubusercontent.com`) is designed for GitHub Actions, not user login. If Cognito's OIDC discovery fails against that issuer, fall back to the commented-out block that points at GitHub's OAuth 2.0 endpoints directly, or deploy a GitHub OIDC proxy like [`github-cognito-openid-wrapper`](https://github.com/TimothyJones/github-cognito-openid-wrapper). Confirm the chosen approach before promoting the change to `prod`.
:::

## Step 3 — Update the User Pool Client

In the same `infra/cognito.ts` file, update the `vault-client-dev2` user pool client so it accepts the new IdP. Change:

```typescript
supportedIdentityProviders: ["COGNITO"]
```

to:

```typescript
supportedIdentityProviders: ["COGNITO", "GitHub"]
```

(Use `["GitHub"]` if you intend to disable native Cognito sign-in entirely.)

Also update `callbackUrls` to include the installer's deep-link or localhost callback URL so the OAuth redirect reaches the running installer process.

Deploy the SST stack and verify with:

```bash
aws --profile indigo cognito-idp list-identity-providers \
  --user-pool-id us-east-1_fOMM6hDMZ
```

You should see `GitHub` in the `Providers` array.

## After Setup

Once Step 3 ships, the **Continue with GitHub** button on installer screen 2 will open the Cognito hosted UI, hand off to GitHub OAuth, and return to the installer through the `hq-installer://` deep link with an authorization code. The installer exchanges that code for a Cognito ID token and stores it in the Keychain — the user never sees any of this.

You do not need to repeat this procedure for subsequent installers. Every hq-installer release that targets the same Cognito pool automatically picks up the new IdP.
