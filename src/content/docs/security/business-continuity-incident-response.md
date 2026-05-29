---
title: "Business Continuity, Disaster Recovery & Incident Response"
description: "Backups, recovery posture, incident response process, and breach notification commitments."
---

**Last reviewed:** 2026-05-28  ·  **Document status:** Published

This document describes how HQ stays available, recovers from failures, and responds to security incidents. We state both what is in place today and what is still being formalized.

## 1. Availability & resilience

- HQ is built primarily on **managed, serverless AWS services** (Lambda, API Gateway, S3, DynamoDB), which provide horizontal scaling and remove single-server failure modes.
- **Amazon S3** stores customer content with the durability and availability characteristics of the service (designed for very high durability across multiple facilities within the region).
- **Amazon DynamoDB** provides managed, multi-AZ availability within the region for metadata and access-control data.
- HQ operates in a single region (`us-east-1`); see the honest note in §3 regarding multi-region.

## 2. Backups & data recovery

- **S3 object versioning** is enabled on customer storage buckets, so overwritten or deleted objects can be recovered.
- **Point-in-time recovery (PITR)** is enabled on primary databases, allowing restoration to a prior moment within the retention window.
- KMS keys are configured with deletion protection to prevent accidental loss of the ability to decrypt.
- **Honest note:** PITR/KMS-CMK coverage is being standardized across *all* secondary metadata/audit tables; a documented, regularly-tested restore runbook is being formalized as part of the SOC 2 program.

## 3. Disaster recovery

- Because infrastructure is defined as **infrastructure-as-code**, the environment can be reconstructed deterministically.
- **Honest note:** HQ currently runs in a **single AWS region** with no cross-region replication or automated regional failover, and Indigo has **not yet published formal RPO/RTO targets** or completed a documented DR test. Establishing measured RPO/RTO targets, a tested DR runbook, and evaluating multi-region/cross-region backup are roadmap commitments (see [Compliance Roadmap](/security/compliance-roadmap/)). The single-region design means a prolonged region-wide AWS outage would affect availability until recovery.

## 4. Incident response

Indigo maintains an incident-response approach covering the standard lifecycle:

1. **Detection** — via monitoring and alerting (CloudWatch alarms to on-call, Sentry error tracking, CloudTrail and application audit logs), and via reports to security@getindigo.ai.
2. **Triage & classification** — assess scope, severity, and whether customer data is affected.
3. **Containment** — revoke credentials (access is recomputed per request, so revocation is fast), isolate affected components, and stop the bleeding.
4. **Eradication & recovery** — remove the root cause and restore normal operation from backups/versioned data where needed.
5. **Notification** — see §5.
6. **Post-incident review** — root-cause analysis and corrective actions; HQ's engineering practice is to fix root causes and add regression tests rather than patch symptoms.

**Honest note:** the incident-response plan is being formalized into a written, role-assigned, periodically-tested runbook as part of the SOC 2 program.

## 5. Breach notification

- Indigo commits to **notifying affected customers of a confirmed breach of their data without undue delay** after confirmation, consistent with applicable law (e.g., GDPR's 72-hour controller-to-authority expectation, which we support our customers in meeting as a processor) and any contractual terms in a Data Processing Addendum.
- Notifications will include, as available: what happened, what data was involved, what we are doing, and what the customer should do.

## 6. Audit trail for investigations

HQ's logging supports incident investigation:

- **AWS CloudTrail** with data-event logging across all customer storage and **log-file validation** for tamper-evidence.
- An **application audit trail** of every credential issuance and administrative/impersonation action.
- A **hash-chained audit log** for executed agreements in the e-signature feature.

## Roadmap summary (resilience & response)

| Item | Status |
|---|---|
| S3 versioning on customer data | **In place** |
| Database point-in-time recovery (primary tables) | **In place** |
| Monitoring, alerting, audit logging | **In place** |
| PITR/CMK uniform across all tables | In progress |
| Documented, tested restore + DR runbook | Planned |
| Published RPO/RTO targets | Planned |
| Cross-region backup / multi-region evaluation | Planned |
| Formal, tested incident-response runbook | In progress |
| Public status page | Planned |

---

*This document is a point-in-time description as of the date above, provided for security evaluation.*
