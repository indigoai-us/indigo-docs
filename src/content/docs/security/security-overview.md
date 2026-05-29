---
title: "HQ Security Overview"
description: "One-page summary of HQ security posture: encryption, access, hosting, compliance status, AI stance, and contact."
---

**Last reviewed:** 2026-05-28  ·  **Document status:** Published

HQ is a team AI operating system built by Indigo: a shared context layer that runs over coding and AI agents (Claude Code, Cursor, Codex) and syncs a team's knowledge, skills, policies, and capabilities across machines. Because HQ holds an organization's working context and brokers access to its data and tools, security is a foundational design constraint rather than a feature bolted on afterward.

Our security model rests on three principles:

1. **Tenant isolation by default.** Every customer organization gets its own dedicated storage and its own encryption key. Data access is brokered through short-lived, narrowly-scoped credentials computed per request — not a shared database with a tenant column.
2. **Least privilege, enforced at the infrastructure layer.** Authorization decisions are translated into scoped AWS IAM sessions, so the cloud platform itself denies out-of-scope access even if application logic were to err.
3. **Defense in depth.** Encryption at rest and in transit, private-network isolation, audit logging, capability-based sharing, and test-enforced isolation gates compound rather than rely on any single control.

This document is the at-a-glance summary. The supporting documents listed at the end go deeper into each domain.

---

## At a glance

| Topic | Summary |
|---|---|
| **Hosting** | Amazon Web Services (AWS), `us-east-1` (United States). Single-region. |
| **Data residency** | All customer data is stored in the United States. |
| **Encryption at rest** | AES-256 via AWS KMS (SSE-KMS), with a **dedicated, per-tenant** customer-managed key and automatic annual key rotation. |
| **Encryption in transit** | TLS/HTTPS enforced end to end; storage rejects non-TLS requests. |
| **Tenant isolation** | Dedicated S3 bucket **and** dedicated KMS key per customer organization; per-request, scope-limited credentials. |
| **Authentication** | AWS Cognito with Google Workspace SSO (OIDC). OAuth 2.0 Authorization Code + PKCE for desktop clients. |
| **MFA** | Enforced at the identity provider (Google Workspace). Native platform MFA is on the roadmap. |
| **Authorization** | Role-based (admin / contributor / read-only) plus path-scoped grants; enforced via scoped IAM sessions. |
| **Audit logging** | AWS CloudTrail data-event logging on all customer storage; an application audit trail records every credential issuance and administrative action. |
| **AI / model training** | Customer data is **not** used to train any models. Indigo's model provider (Anthropic) does not train on data submitted through its API. |
| **Compliance** | Not yet certified. Controls are designed to align with the SOC 2 Trust Services Criteria; SOC 2 is on the roadmap. |
| **Subprocessors** | Published list maintained (AWS, Anthropic, Google, and others) with purpose, data category, and region. |
| **Vulnerability reporting** | security@getindigo.ai |

---

## Compliance status (stated honestly)

Indigo is an early-stage company and is **not yet SOC 2 certified or ISO 27001 certified.** We do not claim certifications we do not hold.

- Our controls are **designed to align with the SOC 2 Trust Services Criteria** (Security, Availability, Confidentiality), and we are building toward a SOC 2 Type II examination.
- We design data-handling practices to support **GDPR** and **CCPA** obligations and can enter into a Data Processing Addendum (DPA).
- Our compliance roadmap, including target milestones, is documented in [Compliance Roadmap](/security/compliance-roadmap/).

See [Compliance Roadmap](/security/compliance-roadmap/) for the current "Now / Next" state.

---

## Data handling

- **What we store.** Customer-authored content synced to HQ (knowledge documents, project specifications, skills, policies), organization and membership metadata, and the operational metadata needed to run the service (file paths, access-control entries, audit records).
- **Where.** In a dedicated, per-organization AWS S3 bucket in `us-east-1`.
- **What we deliberately do not sync.** HQ's local orchestration excludes credentials/secrets directories, raw datasets, and prompt libraries from cloud sync by default (a "privacy class" of paths), and validates this on a customer's first upload.
- **Retention & deletion.** Customer data persists for the life of the account. Customers can request data export and deletion; see [Data Security & Encryption](/security/data-security-encryption/) and [Business Continuity & Incident Response](/security/business-continuity-incident-response/).

## Encryption

- **At rest:** S3 server-side encryption with AWS KMS (SSE-KMS), using a **per-tenant** customer-managed key (CMK) with automatic annual rotation. Control-plane databases are encrypted with AWS KMS.
- **In transit:** TLS for all client-to-cloud and service-to-service traffic. Customer storage buckets enforce a policy that **denies any non-TLS request**.
- **Capability-based sharing:** Externally shareable links are encrypted, single-use, time-limited capability tokens (AES-256-GCM), pinned to specific paths and a maximum permission level.

## Access control

- **Identity:** AWS Cognito; the only self-service sign-up path is Google Workspace SSO (OIDC). Native account self-registration is disabled.
- **Tokens:** Short-lived JWT access/ID tokens (1 hour); refresh tokens with a bounded lifetime. Every API request is authorized by an API Gateway JWT authorizer that validates issuer and audience.
- **Authorization model:** A caller's identity resolves to an organization membership role (admin / contributor / read-only) and a set of permitted path prefixes; this is compiled into a least-privilege, time-boxed AWS STS session scoped to a single tenant's resources.
- **Administrative access:** Indigo staff administrative access is restricted and every privileged or impersonation action is recorded in the audit trail.

## Infrastructure

- **Cloud:** AWS, `us-east-1`, provisioned through declarative infrastructure-as-code for reproducibility.
- **Compute:** Primarily serverless (AWS Lambda behind API Gateway), with isolated container workloads for long-running agents and managed edge compute (CloudFront / Lambda@Edge) for static-artifact delivery.
- **Network:** A dedicated VPC with **private subnets only and no NAT gateway** — outbound access flows through narrowly-scoped VPC endpoints. Databases are not publicly accessible.
- **Secrets:** Managed via AWS SSM Parameter Store (SecureString) and AWS Secrets Manager; human-held secrets are sourced from HQ Secrets (HQ's own encrypted secrets-management system). No plaintext secrets are committed to source control.

## Tenant isolation

HQ's strongest control is that each customer organization is isolated **physically and cryptographically**, not merely logically:

- A **dedicated S3 bucket** per organization.
- A **dedicated KMS encryption key** per organization.
- Per-request **STS sessions scoped to exactly one tenant's bucket and key**, with no credential caching, so membership changes take effect on the next request.
- **Test-enforced:** the CI pipeline runs blocking end-to-end tests that assert one tenant cannot read another's data.

See [Tenant Isolation & Multi-tenancy](/security/tenant-isolation/).

## Application security

- All changes are version-controlled and peer-reviewed; dependencies are lockfile-pinned and installed from frozen lockfiles in CI.
- CI runs type-checking, linting, automated tests, and **blocking cross-tenant isolation tests**.
- On the roadmap: automated software-composition (dependency vulnerability) scanning, SBOM generation, and an independent third-party penetration test.

See [Application Security & SDLC](/security/application-security-sdlc/).

## Reliability

- S3 object versioning is enabled on customer storage; primary databases have point-in-time recovery.
- AWS provides the underlying durability and availability guarantees for the managed services HQ runs on.
- A public status page and formally published RPO/RTO targets are on the roadmap.

See [Business Continuity & Incident Response](/security/business-continuity-incident-response/).

## Incident response & disclosure

- Indigo maintains an incident-response process covering detection, escalation, and customer notification, and commits to notifying affected customers of confirmed breaches of their data without undue delay.
- Security researchers can report issues responsibly via our [Vulnerability Disclosure Policy](/security/vulnerability-disclosure-policy/) at **security@getindigo.ai**.

## AI data stance

HQ is an AI product, so we state this plainly:

- **Customer data is not used to train any AI models** — neither Indigo's nor any third party's.
- HQ's AI capabilities are powered by Anthropic's Claude API. **Anthropic does not train its models on data submitted through its API.**
- Model inputs/outputs are processed only to deliver the requested capability. See [Subprocessor List](/security/subprocessors/) for the full data-flow summary.

## Shared responsibility

HQ secures the platform; customers secure their own credentials, decide who they invite, and govern the data and tools they connect. Because HQ acts across a customer's own repositories and tools, the boundary matters — see [Shared Responsibility Model](/security/shared-responsibility-model/).

## Contact

- **Security & vulnerability reports:** security@getindigo.ai
- **Security documentation requests:** security@getindigo.ai

---

*This overview is a point-in-time description of HQ's security posture as of the date above and is provided for evaluation purposes. It does not form part of any contract unless expressly incorporated by Indigo in writing.*
