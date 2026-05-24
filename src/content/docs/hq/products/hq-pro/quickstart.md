---
title: Quickstart
description: Download the HQ Installer and walk through the 11-screen wizard.
---

This page walks through the installer from double-click to working HQ. Every screen below is shown in order — the wizard enforces this sequence and disables back-navigation on auth-gated steps.

## Install the App

1. Download `hq-installer.dmg` from the latest release on `indigoai-us/hq-installer`.
2. Double-click the `.dmg` and drag **HQ Installer** to Applications.
3. Launch **HQ Installer** from Launchpad or Spotlight.

Because the binary is signed with Indigo's Developer ID and notarized by Apple, you should not see the "unidentified developer" warning. If you do, the build was not notarized — stop and report it.

## Screen 1 — Set up HQ

The welcome screen introduces HQ as an open-source AI dev team for Claude Code — 45 workers, 60+ skills, and an orchestrator. It lists the 11 steps you're about to walk through and offers a **telemetry opt-in** checkbox (enabled by default). Telemetry is success/failure + version only, no file paths or content.

Click **Get Started** to begin.

## Screen 2 — Create your account

Sign in to or create an **AWS Cognito** account in the shared hq-pro user pool. Three options:

- **Sign in** — email + password for an existing Cognito account.
- **Sign up** — email + password + confirm password. You'll receive a verification code by email; enter it to confirm.
- **Continue with GitHub** — opens GitHub OAuth in a browser and returns to the app via a `hq-installer://` deep link.

GitHub federation requires a one-time admin setup in the Cognito pool. See [Cognito setup](/hq/products/hq-pro/cognito-setup/).

On success, your Cognito ID token is stored in the macOS Keychain under `com.indigoai.hq-installer`.

## Screen 3 — Set up your team

Create a new team or join an existing one with an invite code.

- **Create team** — enter a team name and slug. The slug must be unique across the platform. The installer calls `POST /api/installer/register-company` on hq-ops to provision a company record in the entitlements table.
- **Join team** — paste an invite code. The installer calls `POST /api/installer/join-team`.

The team and company data are stored in wizard state and referenced in later screens and the final summary.

## Screen 4 — Install dependencies

The installer checks for seven required tools and auto-installs the missing ones:

| Tool | Purpose |
|---|---|
| **Homebrew** | Package manager for subsequent deps |
| **Xcode CLT** | Compilers required by Homebrew and `git2` |
| **Node.js** | Runtime for HQ scripts and Claude Code |
| **Git** | Version control for your HQ directory |
| **gh** | GitHub CLI for authenticated repo operations |
| **Claude Code** | The Claude Code CLI — the primary AI surface for HQ |
| **qmd** | Semantic + full-text search indexer for HQ knowledge |

Each tool row shows one of five states: **Checking**, **Installed**, **Missing**, **Installing**, or **Failed**. Missing tools get an **Install** button that streams progress lines live. Failed installs offer **Retry** and **Open install page** (launches the tool's website in your default browser).

**Xcode Command Line Tools** are special: tapping install triggers Apple's own system dialog, and the installer polls `/Library/Developer/CommandLineTools` every 2 seconds until it appears. This step has a 15-minute timeout.

The **Continue** button appears only when every tool is **Installed**.

## Screen 5 — Set up GitHub

A guided three-substep walkthrough for connecting GitHub:

1. **Create GitHub Account** — opens `github.com/signup` in an embedded Tauri webview.
2. **Add SSH Key** — opens `github.com/settings/ssh/new` in the webview.
3. **Create Personal Access Token** — opens `github.com/settings/tokens/new`. Paste the PAT into the input field; it's stored in the macOS Keychain on blur via the `keychain_set` command.

Check each box as you complete it. The **Continue** button unlocks when all three are checked.

## Screen 6 — Choose install directory

Pick where HQ will live on your machine. The default is `~/hq`. The installer detects whether the chosen directory is already an HQ install (checks for `CLAUDE.md`, `.claude/`, and `companies/` markers):

- **New directory** — the installer shows "New directory — fresh install." and enables **Continue**.
- **Existing HQ detected** — you must choose **Graft** (merge into the existing HQ, preserving your work) or **Overwrite** (replace with a fresh install) before **Continue** unlocks.

The selected path is stored in wizard state and used by every subsequent screen.

## Screen 7 — Fetching template

The installer downloads the HQ starter tarball from GitHub and extracts it into your chosen directory. The download starts automatically on mount.

You'll see a live progress bar, a byte counter (`X MB / Y MB`), and a log panel with per-tick entries. On success, the **Continue** button appears.

If the download fails (network drop, GitHub 4xx/5xx), the screen shows a red "Download failed" state with **Retry** and **View log** buttons. See [Troubleshooting](/hq/products/hq-pro/troubleshooting/#screen-7--template-download-fails) for common causes.

## Screen 8 — Git setup & integrity check

This screen runs three sequential steps and waits for each to finish before starting the next:

1. **Initialise git repository** — creates the repo via the `git2` Rust crate, sets `user.name` and `user.email`, and makes the initial commit. Your git identity fields are pre-filled from global git config when available.
2. **Compute checksums** — runs `scripts/compute-checksums.sh` inside the install directory.
3. **Verify kernel integrity** — runs `scripts/core-integrity.sh` to confirm critical files match their expected checksums.

Each step shows its status (**Waiting**, **Running…**, **Done**, or **Failed**) and exposes a **Log** button to reveal streaming stdout. If a step fails, **Retry** re-runs from the failed step — you don't have to restart from step 1.

## Screen 9 — Personalize your HQ

A three-substep form that feeds the personalization writer. The writer produces the same files that `/setup` would generate — no Claude Code subprocess involved.

1. **Identity** — your name, a short "about", and your goals. All three are required.
2. **Starter project** — pick a starter: personal assistant, social media, or code worker.
3. **Customization** — role-specific settings, followed by **Submit**.

The writer creates `knowledge/{name}/profile.md` and `voice-style.md` from Handlebars templates, copies the selected starter project, installs role-specific workers into `companies/personal/workers/`, and scaffolds `companies/personal/settings/` with an empty `cognito.json` ready for your Keychain-stored tokens.

The name field is sanitized — characters unsafe in filesystem paths (`/`, `\`, `:`, etc.) are stripped before it's used as a directory under `knowledge/`.

## Screen 10 — Indexing HQ

Two sequential steps, started automatically on mount:

1. **Index HQ knowledge base** — runs `qmd index .` inside your install directory.
2. **Generate semantic embeddings** — runs `qmd embed` to populate the vector store.

When embeddings complete, Claude Code's `qmd search` and `qmd vsearch` commands will find every markdown file in your HQ immediately. Each step exposes a **Log** button to view live stdout. On failure, **Retry** re-runs from the failed step.

## Screen 11 — HQ is ready

The final screen summarises the install: path, team name, team slug, and your email. If telemetry was enabled on screen 1, a success ping fires in the background.

Click **Open HQ in Claude Code** to launch `claude` in your new install directory. From there, your HQ is a live Claude Code session — `/startwork` picks up context, every shared worker is available, and `qmd` can search your freshly indexed knowledge base.

You're done.
