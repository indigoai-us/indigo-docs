---
title: GitHub Auth
description: GitHub OAuth replacing Cognito — device flow, self-signed JWTs, DynamoDB storage.
---

The HQ Teams platform originally used AWS Cognito for authentication. This was replaced with GitHub OAuth to simplify the stack and align with the developer workflow (everyone already has a GitHub account).

## Why the Switch

| Aspect | Cognito | GitHub OAuth |
|--------|---------|-------------|
| User identity | Separate account | Existing GitHub account |
| Device flow | Complex setup | Native support |
| Team discovery | Custom implementation | GitHub org membership |
| Session management | Cognito tokens | Self-signed JWTs |
| Storage | Cognito user pool | DynamoDB |

## Auth Flows

### Web (Browser Redirect)

```
GET /api/auth/github/authorize
  → 302 redirect to GitHub OAuth
  → User authorizes
  → GitHub redirects to callback URL

POST /api/auth/github/callback
  { code: "github_auth_code" }
  → Exchange code for GitHub access token
  → Create session JWT
  → Return { session_token, refresh_token }
```

### CLI (Device Flow)

```
POST /api/auth/device/start
  → { device_code, user_code, verification_uri }

User visits verification_uri, enters user_code

POST /api/auth/device/poll
  { device_code: "..." }
  → Polls until authorized
  → Returns { session_token, refresh_token }
```

## JWT Structure

Sessions use self-signed HS256 JWTs (not Cognito tokens):

```json
{
  "sub": "gh:12345678",
  "login": "johndoe",
  "email": "john@acme.com",
  "teams": ["team-abc", "team-xyz"],
  "iat": 1711900800,
  "exp": 1711929600
}
```

- Session tokens: 8-hour TTL
- Refresh tokens: 30-day TTL (stored in `HqSessions` DynamoDB table with TTL)

## Infrastructure

| Resource | Purpose |
|----------|---------|
| DynamoDB `HqTeams` | Team records, membership (PK=teamId, SK=recordType) |
| DynamoDB `HqSessions` | Refresh tokens with TTL |
| GSI `UserTeamsIndex` | Lookup teams by userId (PK=userId) |
| SST Secrets | `JwtSigningKey`, `GitHubClientSecret` |

## GitHub App

The 'HQ Team Sync' GitHub App provides:

- **Repository access** (`contents:write`, `administration:write`)
- Installation access tokens scoped per repository (1-hour TTL)
- Org membership discovery for team creation flow

GitHub access tokens are **never stored server-side** — only used transiently during the auth flow to retrieve user profile information.

## S3 Path Scheme

User data is organized by GitHub identity:

```
users/gh:{githubId}/hq/          # Solo HQ user
teams/{teamId}/users/gh:{githubId}/hq/  # Team member
```
