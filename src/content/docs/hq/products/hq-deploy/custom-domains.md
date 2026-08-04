---
title: Custom Deploy Domains (Enterprise)
description: Serve every deploy under your own domain — {app}.your-domain.com — with automated wildcard certificates and DNS validation.
---

Enterprise companies can replace the default deploy domain entirely. Set a custom base domain once (e.g. `your-domain.com`), and every app deploys to `{app}.your-domain.com` instead of `{app}.indigo-hq.com` — fully white-labeled, served over HTTPS with an automatically provisioned wildcard certificate, and protected by the same access controls as the default domain.

## How it works

- **One domain per company.** Your company claims a base domain; all of your apps serve under its wildcard (`*.your-domain.com`).
- **Isolated serving.** Each enterprise tenant gets its own dedicated CDN distribution and its own wildcard TLS certificate — one company's configuration can never affect another's.
- **Same access gate.** Public apps load directly; password-, company-, and private-gated apps redirect through the standard access flow. Access tokens and cookies are scoped to your domain, so signing in once authorizes all of your apps under it.
- **Migration-proof target.** Your DNS points at a stable per-tenant alias managed by the platform, so future infrastructure changes never require you to re-point your records.

## Setup

1. **Claim your domain** in the console: **Company Settings → Custom deploy domain**. Enter your base domain (e.g. `your-domain.com`).
2. **Add three DNS records** at your registrar. The console shows the exact records with one-click copy and per-registrar hints (Cloudflare, Route 53, GoDaddy, Namecheap):
   - A **wildcard CNAME** — `*.your-domain.com` → your per-tenant platform alias.
   - A **certificate-validation CNAME** — proves domain control to the certificate authority.
   - A **CAA record** — `0 issue "amazon.com"`, required only if your domain already has CAA records that would otherwise block certificate issuance. The console's live DNS check flags this automatically.
3. **Watch it go live.** The console checks your DNS in real time (each record turns green as it propagates, with actual-vs-expected values when something is off), then walks the claim through certificate issuance and serving attach automatically. Typical end-to-end time is 20–45 minutes, dominated by DNS propagation and CDN provisioning.

Once live, every new deploy is addressable at `{app}.your-domain.com`. Apps keep their existing `{app}.indigo-hq.com` URLs as well.

## States and troubleshooting

| State | Meaning |
|---|---|
| Pending validation | Waiting for your DNS records — check the live per-record status in the console |
| Issuing | Records verified; certificate being issued |
| Ready to serve | Certificate issued; serving infrastructure being provisioned |
| Live | Your domain is serving |
| Failed | A step failed — the console shows the reason and a retry action |

A stalled validation (typically a missing or mistyped record, or a CAA record blocking issuance) is retryable from the console at any time; an expired certificate request is re-requested automatically with a fresh validation record.

## Limits (v1)

- One custom base domain per company.
- Registrable two-label apex domains only (e.g. `your-domain.com`). Subdomains and multi-label TLDs such as `.co.uk` are not yet supported and are rejected with a clear error.
- Custom deploy domains are an **Enterprise plan** feature, enforced server-side.

See also: [DNS & Domains](/hq/products/hq-deploy/dns-domains/) for the default-domain behavior, and [Authentication](/hq/products/hq-deploy/authentication/) for how the access gate works.
