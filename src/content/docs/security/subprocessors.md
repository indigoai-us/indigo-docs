---
title: "Subprocessor List"
description: "Third parties that process customer data, with purpose, data categories, region, and our no-model-training stance."
---

**Last reviewed:** 2026-05-28  ·  **Document status:** Published

A subprocessor is a third party that Indigo engages to process customer data in the course of providing HQ. This document lists current subprocessors, what they do, the category of data involved, and where they process it.

> **AI training stance (read first).** HQ's AI capabilities use **Anthropic's Claude API**. **Anthropic does not train its models on data submitted through its API.** Indigo does **not** use customer data to train any models. Model inputs and outputs are processed only to deliver the requested capability.

## Core subprocessors (involved for all customers)

| Subprocessor | Purpose | Data categories processed | Processing region |
|---|---|---|---|
| **Amazon Web Services (AWS)** | Primary cloud hosting — compute, storage (S3), databases, KMS, networking. | All customer content and metadata stored in HQ. | United States (`us-east-1`) |
| **Anthropic** | AI model inference (Claude API) powering HQ's AI capabilities. | Customer content submitted to AI features (prompts, referenced context) and generated outputs. Not used for model training. | United States |
| **Google** (Google Workspace / Identity) | Federated sign-in (OIDC SSO) — the primary authentication path. | User identity data: email address and basic profile from the customer's Google account. | United States / global |

## Feature-specific subprocessors (involved only if you use the feature)

| Subprocessor | Purpose | Data categories processed | Processing region | Engaged when |
|---|---|---|---|---|
| **Sentry** | Application error and performance monitoring. | Operational telemetry; diagnostic context. Authentication tokens and home-directory paths are scrubbed before transmission. | United States | Always (platform monitoring), but designed to exclude customer content. |
| **Vercel** | Managed hosting for certain web front-ends. | Request metadata for the hosted web surfaces. | United States / global | When you use a Vercel-hosted HQ web surface. |
| **Recall.ai** | Meeting capture/transcription. | Meeting audio/transcripts and participant metadata. | United States | When you use meeting-intelligence features. |
| **Slack** | Messaging integration. | Message content and metadata sent or read on your behalf. | United States | When you connect and use the Slack integration. |

> **Note on connected tools.** When you connect your own repositories or tools (e.g., your GitHub, your Slack), HQ acts on them using credentials you supply. Those are **your** systems and accounts, governed by your agreements with those providers, not subprocessors engaged by Indigo — though they appear here where Indigo brokers the integration.

## Internal tooling (not customer-data subprocessors)

- **GitHub** — hosts Indigo's source code and runs CI. It processes Indigo's code, not customer content (unless you choose to connect your own GitHub, per the note above).

> Indigo's own operational secrets are managed through **HQ Secrets**, HQ's own encrypted secrets-management system — not a third-party password manager.

## How we manage subprocessors

- New subprocessors that will process customer data are reviewed for security and privacy posture before engagement.
- We maintain this list as the **authoritative, dated** record and update it when subprocessors change.
- **Change notification:** under a Data Processing Addendum (DPA), Indigo will provide advance notice of new subprocessors that process customer personal data (target: at least 30 days), giving customers an opportunity to object. Contact security@getindigo.ai to subscribe to change notifications or to discuss DPA terms.

## Notes & honesty

- Processing **region** reflects the subprocessor's configuration under HQ's current setup; consult each provider's documentation for authoritative residency details.
- The data-flow owner confirms this list's completeness and accuracy each review cycle.

---

*This document is a point-in-time list as of the date above, provided for security evaluation.*
