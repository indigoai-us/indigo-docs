---
title: "Identity & Access Management"
description: "Authentication (SSO/OAuth/PKCE), tokens, role-based access, machine identity, MFA, and staff access controls."
---

**Last reviewed:** 2026-05-28  ·  **Document status:** Published

This document covers how users and machines authenticate to HQ, how requests are authorized, and how Indigo controls its own administrative access.

## 1. Identity provider

HQ uses **AWS Cognito** as its identity platform (a dedicated user pool and identity pool). Sign-in is federated:

- **Google Workspace SSO (OIDC) is the only self-service sign-up path.** Native, password-based self-registration is **disabled** (the pool is configured admin-create-only for non-federated accounts).
- The identity pool does **not** permit unauthenticated identities and enforces server-side token checks.

Because Google Workspace is the front door, customers inherit and control their own IdP-level posture — including **enforced MFA, conditional access, and SSO deprovisioning** — for their HQ users.

## 2. Authentication flows

- **Desktop applications** (the HQ Sync and installer apps) authenticate with **OAuth 2.0 Authorization Code flow with PKCE (S256)** against the Cognito Hosted UI, federated to Google. The flow uses a loopback redirect, validates an anti-CSRF `state` parameter, is single-use, and times out quickly if not completed.
- **Token refresh** uses Cognito's refresh-token grant.
- The API authorizes requests using the issued JSON Web Tokens (below).

## 3. Tokens & session management

- **Token types & lifetimes:** short-lived **access** and **ID** tokens (**1 hour**); **refresh** tokens with a bounded lifetime (30 days for interactive users; shorter for machine clients).
- **Client storage:** on desktop, tokens are stored in the **operating-system keychain** (macOS Keychain) as the primary store, with a file fallback restricted to owner-only permissions (`0600`).
- **Revocation:** sign-out performs a **global token revocation**; account deletion invalidates outstanding tokens. Membership/authorization changes take effect on the next request because access credentials are recomputed per request and never cached (see [Tenant Isolation](/security/tenant-isolation/)).
- **Honest note:** refresh tokens are **not currently rotated** on use, and the desktop file-fallback stores tokens protected by file permissions rather than OS-keychain encryption. Refresh-token rotation and keychain-only storage are tracked on the roadmap.

## 4. Authorization model

Every API route is protected by an **API Gateway JWT authorizer** that validates the token's **issuer** and **audience** before any handler runs. Within a request, authorization is resolved as follows:

1. The verified token identifies the caller.
2. The caller maps to an **organization membership** with a **role** — `admin`, `contributor`, or `read-only` — and a set of **permitted path prefixes** (including explicit grants and deny carve-outs).
3. These permissions are compiled into a **least-privilege, time-boxed AWS STS session** scoped to a single tenant's storage and key. The platform then enforces the boundary at the infrastructure layer.

This means an authorization decision is expressed not only in application logic but as an AWS credential that is incapable of exceeding its scope.

## 5. Machine & agent identity

HQ runs autonomous agents, which require their own identities:

- **Scoped agent identities:** machine principals are issued as dedicated Cognito identities carrying a company claim, so their access is constrained to a single organization, enforced from the verified claim at request time.
- **API keys:** issued as high-entropy bearer keys, shown to the operator **once**, and stored **only as a SHA-256 hash** — the plaintext is not retained server-side.
- **Local/CLI agents** authenticate using the signed-in user's own Cognito tokens; they do not hold a separate long-lived secret.

## 6. Administrative (Indigo staff) access

- Staff administrative capability is **restricted to vetted Indigo personnel** and gated on a verified internal identity.
- Privileged actions — including any support **impersonation** — are **recorded in the audit trail** (which principal acted, on whose behalf, when).
- Indigo follows least-privilege for internal access and is formalizing periodic access reviews as part of the SOC 2 program (see [Compliance Roadmap](/security/compliance-roadmap/)).

## 7. Multi-factor authentication

- **MFA is enforced at the identity provider (Google Workspace)** for the SSO path, which is the only public sign-up route. Customers control MFA strength and enforcement for their own users through their Google Workspace policies.
- **Native, platform-level MFA inside Cognito is not yet implemented** and is on the roadmap as a defense-in-depth addition independent of the upstream IdP.

## 8. Customer-facing access-management capabilities

Customers can:

- Invite and remove members, and assign roles (admin / contributor / read-only).
- Grant and revoke path-scoped access to specific resources.
- Share resources externally via single-use, time-limited capability links (never by widening base access).
- Rely on their Google Workspace SSO to deprovision a departing employee's access centrally.

## Honest limitations (summary)

- No native (in-platform) MFA yet; MFA is currently inherited from Google Workspace SSO.
- Refresh tokens are long-lived (up to 30 days) and not rotated on use.
- The desktop token file-fallback relies on filesystem permissions rather than encryption.
- A non-SRP password authentication mode remains enabled on the user-pool client beyond what the Google-only flow strictly requires; tightening this is on the roadmap.

Each of these is tracked in [Compliance Roadmap](/security/compliance-roadmap/).

---

*This document is a point-in-time description of HQ's identity and access-management controls as of the date above, provided for security evaluation.*
