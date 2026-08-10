---
title: In-Context Comments
description: Viewers leave feedback directly on a gated deploy — anchored to a point or a region, tagged to their identity — behind the same access gate as the deploy.
---

Every gated deploy can collect feedback in place. Viewers comment directly on the page — no separate tool, no exported screenshots, no lost context — and the deploy owner triages it all from a side pane. Comments ride the same access gate as the deploy itself, so what a viewer can comment on is exactly what they were already allowed to see.

## What viewers can do

- **Anchor a comment to a point.** Click anywhere on the page to drop a marker and attach a note to that exact spot.
- **Anchor a comment to a region.** Drag a box over an area — a section, an image, a block of copy — to comment on a whole region rather than a single point.
- **Every comment is attributed.** Each note is tagged to the commenter's identity, so the owner always knows who said what.

## Zero re-authentication

Commenting reuses the viewer's existing access to the deploy — there is no second login.

- **Already signed in to HQ.** A viewer who reached the deploy through their HQ access session comments immediately; their identity rides that same session, so the note is attributed with no extra step.
- **Not signed in.** A viewer who is not signed in sees a **"sign in to comment"** prompt instead of a text box. Reading stays governed by the deploy's gate; leaving a comment is what asks them to identify themselves — a natural on-ramp into HQ rather than a wall.

## The owner's review pane

The deploy owner works every comment from a single side pane:

- See all comments in one place, each with its anchor, author, and content.
- **Resolve** a comment when it is handled, and **reopen** it if it needs another pass.
- **Delete** a comment outright.

## Access is fail-closed and honors revocation

Comments are governed by the deploy's access gate, not a separate permission model:

- A viewer can only read and post comments on a deploy they are allowed to see.
- Access is **fail-closed** — if the gate cannot confirm a viewer is authorized, commenting is denied rather than allowed.
- **Revocation is immediate.** A viewer who loses access to the deploy can no longer read existing comments or post new ones — the comment surface disappears exactly as the deploy does.

This means gating a deploy to a password, a company, or a named set of people gates its comment thread the same way, with no extra configuration.

## Turning it on

Comments are activated per deploy — turn them on for the deploys where you want feedback, leave them off elsewhere. Once enabled, the comment widget rides the **"Built in HQ"** badge already present on the deploy, so there is nothing extra to embed on the page.

See also: [Authentication](/hq/products/hq-deploy/authentication/) for how the access gate works, and [Custom Deploy Domains](/hq/products/hq-deploy/custom-domains/) for how the same gate carries across white-labeled domains.
