---
title: "Data Security & Encryption"
description: "Data classification, encryption at rest and in transit, key management, access controls, sharing, retention, and deletion."
---

**Last reviewed:** 2026-05-28  ·  **Document status:** Published

This document describes how HQ classifies, encrypts, controls, retains, and deletes data.

## 1. Data classification

| Class | Examples | Handling |
|---|---|---|
| **Customer content** | Knowledge documents, project specs, skills, policies a team syncs to HQ. | Stored per-tenant, encrypted at rest with a per-tenant key (§3). |
| **Customer metadata** | Organization/membership records, file paths, access-control entries. | Stored in control-plane databases, encrypted at rest. |
| **Operational/audit data** | Credential-issuance records, administrative actions, access logs. | Stored in audit stores; integrity-protected (§7). |
| **Secrets** | API keys, OAuth credentials, signing keys. | Stored in dedicated secret stores; never in source control (§6). |
| **Local-only (never synced)** | Credentials directories, raw datasets, prompt libraries on a customer machine. | Excluded from cloud sync by default (§8). |

## 2. Where data lives

All customer data is stored in **AWS, region `us-east-1` (United States)**. HQ does not currently replicate customer data to other regions, so **data residency is the United States**. Primary stores:

- **Amazon S3** — customer content, in a dedicated per-tenant bucket.
- **Amazon DynamoDB** — access-control lists, organization/membership/entity metadata, audit records, and short-lived nonce records for single-use tokens.
- **Managed PostgreSQL** — used by specific feature services (for example, the e-signature/agreements service and the static-artifact deployment service). Where these hold personal data (e.g., signer name/email/IP for an executed agreement), it is treated as customer metadata and protected accordingly.

## 3. Encryption at rest

- **Customer content (S3):** server-side encryption with AWS KMS (**SSE-KMS**, AES-256) using a **dedicated, per-tenant customer-managed key (CMK)**. S3 Bucket Keys are enabled to reduce KMS request overhead without weakening protection.
- **Key rotation:** per-tenant CMKs rotate **automatically on an annual cycle**.
- **Control-plane databases:** access-control and entity tables are encrypted with AWS KMS; primary tables additionally have point-in-time recovery enabled.
- **Honest note:** we are standardizing KMS-CMK encryption and point-in-time recovery uniformly across *all* secondary metadata/audit tables (a small number currently use the AWS-owned default key); this hardening is tracked on the roadmap.

## 4. Encryption in transit

- **TLS/HTTPS is enforced** for all client-to-cloud and service-to-service communication.
- Customer storage buckets carry a policy that **explicitly denies any request not using TLS** (`aws:SecureTransport`).
- Static-artifact delivery is served only through Amazon CloudFront using Origin Access Control, with `Secure; HttpOnly; SameSite` access cookies where applicable.
- **Honest note:** a minimum TLS version (e.g., TLS 1.2+) is not yet pinned uniformly in code across every edge/API surface; standardizing this floor is on the roadmap.

## 5. Key management

- Per-tenant CMKs are created at provisioning time, tagged so that IAM can gate KMS operations on the tag, and used as the bucket's default encryption key.
- A separate, dedicated key protects control-plane databases.
- A dedicated symmetric master key (held in AWS Secrets Manager) protects HQ's capability tokens (§9). This key is environment-scoped; isolating it further per-tenant is noted on the roadmap.
- KMS keys are configured to resist accidental destruction (deletion protection / retention).

## 6. Secrets management

- Application secrets are stored in **AWS SSM Parameter Store (SecureString)** and **AWS Secrets Manager**, injected at deploy time or read at runtime through private VPC endpoints.
- In the primary application, secret values are bound at deployment and the runtime roles are **not** granted broad `ssm:GetParameter`, reducing runtime exposure.
- Human-held secrets (the source of truth for credentials) live in **HQ Secrets**, HQ's own encrypted secrets-management system; credentials are referenced, never pasted inline or committed.
- No plaintext secrets are stored in source control.

## 7. Access control & audit

- Read/write access to customer content is governed by the ACL model and brokered through scoped, short-lived credentials described in [Tenant Isolation & Multi-tenancy](/security/tenant-isolation/).
- **AWS CloudTrail** records S3 **data events** across all customer storage buckets, with log-file validation enabled for tamper-evidence.
- An **application audit trail** records every credential issuance (which principal, which scope) and every administrative/impersonation action.
- The e-signature service additionally maintains a **hash-chained audit log** for executed agreements.

## 8. Data minimization on the client

HQ runs locally on customer machines and is deliberately conservative about what leaves them. The following are excluded from cloud sync by default (the "privacy class"):

- Credential/settings directories (OAuth tokens, vault references).
- Raw company datasets.
- Worker/prompt libraries.
- Version-control internals.

A **first-push protection** check runs before an organization's first upload and **blocks** the upload if any excluded path would be transmitted, surfacing the offending path to the user.

## 9. Capability-based sharing tokens

When data is shared, HQ mints a capability token rather than widening storage permissions:

- **Vault share-session links:** AES-256-GCM authenticated encryption (random IV, authentication tag). The token is **single-use** — redemption atomically consumes a one-time nonce — **time-limited** (15 minutes by default; minimum 60 seconds, maximum 7 days), and **pinned** to specific paths and a maximum permission level (capped at `write`; `admin` is never shareable). Tampered or expired tokens are rejected.
- **Shared static-artifact links:** high-entropy random tokens stored **only as SHA-256 hashes** (so a database export cannot redeem them), single-use, default/maximum 7-day lifetime, and IP-rate-limited on redemption. Optional password protection hashes passwords with **Argon2id** and is enforced at the CDN edge via a short-lived signed cookie.
- **Upload links:** pre-signed S3 upload URLs are short-lived (10 minutes), size-capped, and force the destination key into the authenticated caller's namespace so a client cannot redirect an upload into another tenant's space.

## 10. Retention & deletion

- **Retention:** customer content is retained for the life of the account. Time-to-live expiry is applied to ephemeral records such as one-time-use nonces and certain audit/event records.
- **Deletion on request:** customers may request export and deletion of their data. A self-scoped hard-delete routine exists that empties and removes a bucket and tombstones the associated identity.
- **Honest note:** production tenant offboarding today performs a **soft tombstone** of the organization; a fully automated hard-delete-on-offboarding routine (destroying bucket, per-tenant key, and metadata) is being productionized and is tracked on the roadmap. Until then, complete deletion is performed as an operational procedure on request.

---

*This document is a point-in-time description of HQ's data-security controls as of the date above, provided for security evaluation.*
