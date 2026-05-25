---
title: HQ Installer
description: Native macOS installer that replaces the CLI onboarding with a signed, notarized .dmg wizard.
---

The **HQ Installer** is a native macOS app — distributed as a signed, notarized `.dmg` — that replaces the two-step CLI onboarding (`npx create-hq` + `/setup`) with a single guided wizard. It's the **recommended install path for new HQ users on macOS**, especially anyone who hasn't used a terminal before.

A brand-new Mac user can double-click `hq-installer.dmg` and reach a working HQ with a live account in under **10 minutes** on broadband, with zero terminal interaction.

## Who It's For

- **Non-technical HQ Teams users** rolling out through the Indigo commercial channel — never touched a terminal.
- **HQ power users** who want a faster onboarding than `npx create-hq`.
- **Indigo sales** as a trust artifact — a signed binary users can run without warning dialogs.

HQ power users who prefer the CLI can still use [create-hq](/hq/products/hq-core/). Both paths produce the same final directory layout; a nightly regression gate diffs the two to keep them aligned.

## What It Does

The installer walks you through **11 steps**, each implemented as a native screen rather than a child process wrapping the old CLI:

1. **Welcome** — product identity, wizard overview, telemetry opt-in.
2. **Create your account** — AWS Cognito sign-in, sign-up, or GitHub OAuth.
3. **Set up your team** — create a new team (name + slug) or join via invite code.
4. **Install dependencies** — auto-detects and installs Homebrew, Xcode CLT, Node.js, Git, gh, Claude Code, and qmd.
5. **Set up GitHub** — in-app webview walkthrough for account creation, SSH key, and personal access token.
6. **Choose install directory** — folder picker with existing-HQ detection (graft or overwrite).
7. **Fetching template** — downloads and extracts the HQ starter tarball.
8. **Git setup & integrity check** — git init, compute checksums, verify kernel integrity.
9. **Personalize your HQ** — identity, starter project, and role-specific customizations.
10. **Indexing HQ** — runs `qmd index .` and `qmd embed` so Claude Code can search your HQ immediately.
11. **HQ is ready** — summary card and a button to launch Claude Code in the new install.

See the [Quickstart](/hq/products/hq-pro/quickstart/) for a screen-by-screen walkthrough.

## Architecture

The installer is a native app, not a shell script with a UI:

| Layer | Tech |
|---|---|
| Shell | Tauri 2 (frameless macOS window with backdrop blur + darkened overlay) |
| Frontend | React 19, TypeScript, Tailwind 4, shadcn/ui (zinc monochrome theme) |
| Backend | Rust with `git2` (git operations) and `keyring` (macOS Keychain) crates |
| Build | Vite 6, pnpm, universal-apple-darwin bundle |
| Distribution | GitHub releases, signed with Indigo's Developer ID and notarized |
| Auto-update | Tauri `plugin-updater` against an S3 manifest served via CloudFront (presigned URLs) |

The `/setup` personalization phases are **re-implemented natively** as React forms and TypeScript file writers — there is no Claude Code subprocess at install time.

## Authentication

The installer authenticates against the shared **hq-pro Cognito user pool** (`us-east-1_fOMM6hDMZ`). This is the same pool used by the `hq-cloud-api` web app at `app.hq.getindigo.ai` and the React Native mobile app, so a single Cognito identity works across every HQ surface.

- **Sign-in / sign-up**: email + password with a verification code flow.
- **GitHub OAuth**: one-click federation via Cognito's hosted UI, returned to the app through a `hq-installer://` deep link.
- **Token storage**: Cognito tokens live in the macOS Keychain under the service prefix `com.indigoai.hq-installer` — never in plain files.

GitHub federation requires a one-time [Cognito admin setup](/hq/products/hq-pro/cognito-setup/) against the hq-pro user pool.

## System Requirements

- macOS (universal binary — Apple Silicon and Intel).
- Broadband internet for the template download and dependency installs.
- Xcode Command Line Tools will be triggered automatically if absent; Apple's system dialog handles the actual install.

The installer's bundle itself is **under 30 MB**. Dependencies (Homebrew, Node, etc.) are downloaded on demand during screen 4.

## Where to Get It

Signed `.dmg` builds are published as GitHub release assets on `indigoai-us/hq-installer` under `v*.*.*` tags. Auto-updates are delivered via the built-in Tauri updater — once installed, subsequent versions arrive without re-downloading the `.dmg`.

## Non-Goals

- Windows or Linux builds.
- SSO / SAML authentication.
- Self-hosted Cognito for non-Indigo deployments.
