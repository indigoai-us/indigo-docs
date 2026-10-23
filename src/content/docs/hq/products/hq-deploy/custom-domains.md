---
title: Custom Deploy Domains
description: Serve deploys under your own domain — a white-label base domain for every app, or a custom hostname for a single app — with DNS validation and automatic certificates.
---

Custom domains are available to every company on every plan. There are two kinds:

- **Custom base domain (white-label).** Set a base domain once (e.g. `your-domain.com`) and every app in the company deploys to `{app}.your-domain.com` instead of `{app}.indigo-hq.com`. Served over HTTPS with an automatically provisioned wildcard certificate, protected by the same access controls as the default domain.
- **Per-app custom hostname.** Point one hostname (e.g. `app.example.com`) at one app. Other apps keep their default URLs.

Both are billed as usage add-ons. A payment method on file is required; Enterprise companies are entitled without an add-on charge.

## Pricing

| Add-on | Price | Notes |
|---|---|---|
| Per-app custom hostname | $20/month per hostname | Billed to the company; removing the hostname stops the charge |
| Custom base domain | $500/month per company | One base domain per company covers every app under it |

Both add-ons require a company admin or owner with a default payment method on the company. Enterprise companies get both without the add-on charge.

## How it works

- **One base domain per company.** The company claims a base domain; all of its apps serve under its wildcard (`*.your-domain.com`).
- **Isolated serving.** Each company with a base domain gets its own dedicated CDN distribution and its own wildcard TLS certificate. Each per-app hostname also gets its own distribution and certificate. One company's configuration cannot affect another's.
- **Same access gate.** Public apps load directly; password-, company-, and private-gated apps redirect through the standard access flow. Access tokens and cookies are scoped to your domain, so signing in once authorizes all of your apps under it.
- **Stable DNS target.** For a base domain, DNS points at a per-company alias on the platform edge (`{company}.edge.hq.computer`). For a per-app hostname, DNS points at the app's default platform URL. Infrastructure changes behind those targets do not require you to re-point records.

## Set up a custom base domain

1. **Claim the domain.** In the console, open **Company Settings → Custom base domain** (company owner only) and enter your base domain (e.g. `your-domain.com`). Org admins can also run `hq-deploy domains base add <domain>` from a linked project.
2. **Add the DNS records** at your registrar. The console shows the exact records with one-click copy and per-registrar hints (Cloudflare, Route 53, GoDaddy, Namecheap):
   - A **wildcard CNAME** — `*.your-domain.com` → `{company}.edge.hq.computer`, your per-company platform alias.
   - A **certificate-validation CNAME** — proves domain control to the certificate authority.
   - A **CAA record** — `0 issue "amazon.com"`, required only if your domain already has CAA records that would otherwise block certificate issuance. The console's live DNS check flags this automatically.
3. **Wait for it to go live.** The console checks your DNS in real time (each record turns green as it propagates, with actual-vs-expected values when something is off), then walks the claim through certificate issuance and serving attach automatically. Typical end-to-end time is 20–45 minutes, dominated by DNS propagation and CDN provisioning.

Once live, every deploy is addressable at `{app}.your-domain.com`. Apps keep their existing `{app}.indigo-hq.com` URLs as well.

## Set up a per-app custom hostname

1. **Link the hostname** from a project linked to the app: `hq-deploy domains add <hostname>`. The command returns the DNS records to publish.
2. **Add the DNS records** at your registrar:
   - A **CNAME** — `<hostname>` → `{app}.indigo-hq.com` (or `{app}.your-domain.com` if the company has a base domain).
   - A **certificate-validation CNAME** — proves control of the hostname to the certificate authority.
3. **Verify and attach.** The hostname is `pending` until the certificate is issued. Run `hq-deploy domains refresh <hostname>` to re-check validation and attach serving once the certificate is `ISSUED`. `hq-deploy domains list` shows every URL linked to the app and its state.

To stop serving and billing for a hostname, run `hq-deploy domains remove <hostname>`.

## States and troubleshooting

| State | Meaning |
|---|---|
| Pending validation | Waiting for your DNS records — check the live per-record status in the console |
| Issuing | Records verified; certificate being issued |
| Ready to serve | Certificate issued; serving infrastructure being provisioned |
| Live | Your domain is serving |
| Failed | A step failed — the console shows the reason and a retry action |

A stalled validation (typically a missing or mistyped record, or a CAA record blocking issuance) is retryable from the console at any time; an expired certificate request is re-requested automatically with a fresh validation record.

Errors you may see when adding a domain:

| Error | Meaning |
|---|---|
| `PAYMENT_METHOD_REQUIRED` | Add a default payment method on the company billing page, then retry |
| `BILLING_ADMIN_REQUIRED` | Only a company admin or owner can add a billed domain |
| `DOMAIN_NOT_ENTITLED` | Custom domains are switched off for this company; contact support |
| `DOMAIN_CROSS_TENANT` | The domain is already claimed by another company |

## Limits (v1)

- One custom base domain per company.
- Registrable two-label apex domains only for base domains (e.g. `your-domain.com`). Subdomains and multi-label TLDs such as `.co.uk` are not yet supported and are rejected with a clear error.

See also: [DNS & Domains](/hq/products/hq-deploy/dns-domains/) for the default-domain behavior, and [Authentication](/hq/products/hq-deploy/authentication/) for how the access gate works.
