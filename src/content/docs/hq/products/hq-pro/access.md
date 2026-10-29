---
title: Joining a company
description: How people join an HQ company. Teammates are invited by an owner or admin; the demo-gated request flow applies only to the demo sandbox.
---

New accounts sign up self-serve: choose **Sign up free**, and no card is needed up front. See [Billing and usage](/hq/products/hq-pro/billing-and-usage/).

## Joining a real company

To join an existing company, ask one of its owners or admins to invite you. An invite from an owner or admin is not demo-gated: the invite email is sent, and the membership is claimable the first time you sign in with that email.

You cannot request access to a real company yourself. A self-serve access request for a company that is not a demo sandbox is refused with `403 SELF_SERVE_TENANT_NOT_ALLOWED`.

## Requesting access to the demo sandbox

Self-serve access requests work only for demo sandbox companies. They are demo-gated:

1. **Request access.** Submit your email and the company on the request-access page. This creates a pending access request. It is not yet claimable.
2. **Book a demo.** Pick a time on the scheduling page. Your request advances to "demo booked."
3. **Get granted.** After the demo, an admin or owner of the company grants your access. The invite email is sent and your membership becomes claimable.
4. **Claim and onboard.** Accept the invite, then finish onboarding: install HQ, join your team, run your first sync, and start the beginner training.

An HQ staff super-admin can grant access directly, without a demo.

## Good to know

- Until a request is granted, it cannot be claimed. The claim is refused with a clear error and no membership is created.
- Invites and memberships created outside the request flow are treated as already granted.
- Admins and owners can see pending and booked requests, and grant or revoke access, from the demo queue.
