---
title: "Application Security & SDLC"
description: "Secure development lifecycle: code review, CI security gates, dependency management, signed builds, and pen-test status."
---

**Last reviewed:** 2026-05-28  ·  **Document status:** Published

This document describes how HQ is built, tested, and shipped, and the controls that keep security defects out of production.

## 1. Secure development lifecycle

- **Version control & code review.** All code lives in Git and changes are made through reviewed pull requests.
- **Policy-as-code.** HQ's own engineering operates under machine-enforced policies (for example, repository-write discipline and credential-isolation rules) that are checked automatically during development.
- **Separation of environments.** Development, staging, and production are separated; production access is restricted to authorized operators.

## 2. Continuous integration gates

Every change runs through a CI pipeline that includes:

- **Type-checking** (TypeScript) — catches whole classes of defects before runtime.
- **Linting** — enforces consistent, safer code.
- **Automated tests** — unit and integration.
- **Blocking cross-tenant isolation end-to-end tests** — the pipeline actively attempts cross-tenant access and asserts it is denied. These are treated as **first-class, blocking** checks: a change that weakens tenant isolation fails the build (see [Tenant Isolation](/security/tenant-isolation/)).

> Tenant-isolation tests being a CI gate — rather than a manual review item — is the single most important application-security control for a multi-tenant product, because it converts the most dangerous failure mode into an automatic build failure.

**Honest note:** branch-protection / required-status-check enforcement (so the blocking jobs *cannot* be merged past) is being finalized across all repositories as part of the SOC 2 change-management program.

## 3. Dependency & supply-chain management

- **Pinned dependencies.** All projects commit lockfiles and install from **frozen lockfiles** in CI, so builds are deterministic and a dependency cannot silently change under us.
- **Honest note / roadmap.** Automated software-composition analysis (dependency vulnerability scanning, e.g., Dependabot/Snyk/Trivy), SBOM generation, and automated alerting on known-vulnerable dependencies are **not yet in place** and are a near-term roadmap item. Today, dependency review is performed manually during code review and at upgrade time.

## 4. Secrets in the SDLC

- No plaintext secrets are committed to source control.
- Human-held secrets are sourced from **HQ Secrets** (HQ's own encrypted secrets-management system) and provisioned to environments through **AWS SSM Parameter Store / Secrets Manager** (see [Infrastructure & Network Security](/security/infrastructure-network-security/)).
- CI credentials are scoped to what each pipeline needs.
- **Honest note:** one container-deployment pipeline currently authenticates to AWS with long-lived access keys; migration to short-lived **OIDC**-federated credentials (already used by some pipelines) is in progress.

## 5. Build integrity & distribution

- **Desktop applications** are **code-signed with an Apple Developer ID certificate and notarized by Apple**, so macOS Gatekeeper verifies authenticity before launch. The signing private key never leaves the CI runner (imported into a temporary keychain that is destroyed after each build).
- **Auto-updates** for desktop apps are **cryptographically signed (Ed25519)**; clients verify the update signature before applying it, preventing tampered updates.
- All CI secrets are masked in build logs.

## 6. Application-layer protections

- **Input authorization on every route** via the API Gateway JWT authorizer (issuer + audience validation) before any handler executes.
- **Capability-based sharing** instead of broad ACL changes, with single-use, time-limited, path-pinned tokens (see [Data Security & Encryption](/security/data-security-encryption/)).
- **Fail-closed authorization** — when a scoped permission set cannot be represented safely, the request is denied.
- **Rate limiting** on sensitive redemption endpoints (e.g., share-link redemption).

## 7. Testing philosophy

HQ's engineering culture treats verification as a release gate:

- "Can't verify → can't ship": features require tests; bug fixes ship with regression tests.
- End-to-end tests are the truth signal for deployable changes, not just unit tests.
- Failing tests are fixed at the root cause rather than skipped or weakened.

## 8. Penetration testing

- **Honest status:** HQ has **not yet** undergone an independent third-party penetration test. Engaging a reputable firm and publishing an attestation/summary is a roadmap commitment (see [Compliance Roadmap](/security/compliance-roadmap/)). We perform internal security review and adversarial testing in the interim.

## Roadmap summary (application security)

| Item | Status |
|---|---|
| Type-check / lint / test / tenant-isolation CI gates | **In place** |
| Lockfile-pinned, frozen-install dependencies | **In place** |
| Code signing + notarization + signed auto-updates | **In place** |
| Required-status-check enforcement everywhere | In progress |
| Automated dependency/vulnerability scanning (SCA) | Planned (near-term) |
| SBOM generation | Planned |
| CI credentials fully on short-lived OIDC | In progress |
| Independent third-party penetration test | Planned |

---

*This document is a point-in-time description of HQ's application-security and SDLC controls as of the date above, provided for security evaluation.*
