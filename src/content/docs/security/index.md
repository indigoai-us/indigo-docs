---
title: "HQ Security Documentation Packet"
description: "Indigo's security documentation for HQ — posture, controls, subprocessors, and how to run a vendor security review."
---

**Last reviewed:** 2026-05-28  ·  **Status:** Published

This is the security documentation packet for **HQ**, a team AI operating system built by **Indigo**. Its purpose is to **streamline the security review** that prospective customers run before adopting HQ — a self-serve "Trust Center in a folder" that answers the large majority of vendor-security questions without a meeting.

## Who this is for

- Security, IT, and procurement teams evaluating HQ.
- Indigo team members responding to a customer security review (point them here first).

## How to use this packet

1. **Start with the [Security Overview](/security/security-overview/)** — the one-page TLDR. Most reviewers only need this plus the at-a-glance table.
2. **Hand a reviewer the [CAIQ questionnaire](/security/caiq-questionnaire/)** — it pre-answers the standard control questions and usually replaces a custom questionnaire round-trip.
3. **Point legal/privacy to** the [Subprocessor List](/security/subprocessors/) and [Compliance Roadmap](/security/compliance-roadmap/) (Indigo can enter into a DPA on request).
4. **Deep dives** are in the domain documents below.

## Documents

| Document | Purpose |
|---|---|
| [Security Overview](/security/security-overview/) | TLDR one-pager: posture, encryption, access, hosting, compliance status, AI stance, contact. **Read first.** |
| [Tenant Isolation & Multi-tenancy](/security/tenant-isolation/) | How one organization can never access another's data — per-tenant bucket + key, scoped credentials, test-enforced. **HQ's strongest control.** |
| [Data Security & Encryption](/security/data-security-encryption/) | Classification, encryption at rest/in transit, key management, ACLs, capability sharing, retention & deletion. |
| [Identity & Access Management](/security/identity-access-management/) | Authentication (SSO/OAuth/PKCE), tokens, RBAC, machine identity, MFA, staff access. |
| [Infrastructure & Network Security](/security/infrastructure-network-security/) | AWS region/residency, IaC, serverless+container compute, VPC isolation, cloud IAM, secrets, monitoring. |
| [Application Security & SDLC](/security/application-security-sdlc/) | Secure development, CI security gates, dependency management, signed builds, pen-test status. |
| [Shared Responsibility Model](/security/shared-responsibility-model/) | What Indigo secures vs. what the customer secures (matters because HQ runs on customer machines). |
| [Subprocessor List](/security/subprocessors/) | Third parties that process customer data, with purpose/data/region + AI training stance. |
| [Vulnerability Disclosure Policy](/security/vulnerability-disclosure-policy/) | How to report a vulnerability; scope, safe harbor, timelines. |
| [Business Continuity, DR & Incident Response](/security/business-continuity-incident-response/) | Backups, recovery posture, incident response, breach notification. |
| [Compliance Roadmap](/security/compliance-roadmap/) | Framework alignment (SOC 2 / ISO / GDPR / CCPA) and the honest Now/Next of what's implemented vs. planned. |
| [CAIQ Questionnaire](/security/caiq-questionnaire/) | Pre-filled answers across the 17 cloud-control domains (+ AI governance). |

## Our documentation principles

- **Honest over impressive.** We distinguish "in place," "in progress," and "planned." We do not claim certifications we don't hold or controls we can't evidence.
- **Specific over vague.** We name the cloud, the ciphers, the mechanisms — not marketing adjectives.
- **Dated.** Every document carries a `last_reviewed` date.
- **Scrubbed.** These external documents describe **architecture and controls**, not operational identifiers (no account IDs, resource ARNs, key IDs, or internal hostnames). That is by design.

## Contact

**security@getindigo.ai** — security questions, documentation requests, and vulnerability reports.

---

*Maintained by Indigo. This packet is provided for evaluation and does not form part of any contract unless expressly incorporated by Indigo in writing.*
