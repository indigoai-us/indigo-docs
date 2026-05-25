---
title: Troubleshooting
description: Common failure modes in the HQ Installer and how to resolve them.
---

This page is organized by wizard screen, in the order you'll encounter problems. Each entry lists the symptom the installer shows you, the root cause, and the fix.

If you hit something not listed here, click **View log** wherever it's available — the log panels on screens 4, 7, 8, and 10 capture structured stdout from the underlying process and are the first thing to inspect.

## Screen 2 — Auth

### "Passwords do not match"

You entered different values in the **Password** and **Confirm password** fields during sign-up. Re-type carefully; the installer compares them character-for-character before calling Cognito.

### "Sign up failed" or "Sign in failed"

The installer surfaces the raw Cognito error message. Common causes:

- **Weak password** — Cognito's policy rejects passwords missing required characters. Use a longer password with mixed case, a digit, and a symbol.
- **User does not exist** — you're on the Sign in tab but haven't created an account yet. Switch to Sign up.
- **Incorrect email or password** — double-check; if you forgot your password, reset it via the hq-cloud-api web app at `app.hq.getindigo.ai` (same Cognito pool).

### "Confirmation failed"

The verification code from your confirmation email was wrong or expired. Check your inbox for the most recent code and re-enter it. If the code is older than a few minutes, switch back to the Sign up tab and register again to trigger a fresh code.

### "GitHub sign in failed"

Most likely the Cognito pool is missing the GitHub IdP. Ask your administrator to complete the [Cognito setup procedure](/hq/products/hq-pro/cognito-setup/). Until that ships, use the email+password tabs instead.

## Screen 3 — Team

### "Failed to create team (409)"

The slug you chose is already taken. Cognito-authenticated team registration enforces slug uniqueness at the API level. Pick a different slug and retry.

### "Failed to create team ({other status})"

Any other status code means the `/api/installer/register-company` endpoint on hq-ops returned an error. 401 means your Cognito token wasn't accepted (re-auth); 500 means a server-side failure — retry after a minute or contact the hq-ops on-call.

### "Failed to join team"

The invite code you pasted is expired, malformed, or for a different team. Ask the person who shared it to issue a new one from the team admin console.

## Screen 4 — Dependencies

### A tool is stuck on "Checking…"

The underlying `check_dep` Tauri command is probing your `$PATH`. If it never transitions, quit and relaunch the installer — the probe runs on mount.

### "Installation failed" with a log-panel stack trace

Each dep installer runs a safe scripted install (Homebrew for Node/gh/git, Apple for Xcode CLT, npm for Claude Code, a shell installer for qmd). Common causes:

- **Homebrew failure** — usually a missing Xcode CLT. Install Xcode CLT first; the Homebrew step will succeed on retry.
- **Node install failure** — Homebrew was not yet installed at the moment the Node installer ran. The installer doesn't auto-reorder; install Homebrew first, then click **Retry** on the Node row.
- **Network error** — the installer or its child process couldn't reach GitHub, Homebrew's CDN, or the npm registry. Check your connection and retry.

If **Retry** keeps failing, click **Open install page** to install the tool manually from the vendor's website, then return to the installer and click **Retry** once more — the next `check_dep` will find the tool on your `$PATH` and mark it Installed.

### Xcode CLT never finishes

Screen 4 polls `/Library/Developer/CommandLineTools` every 2 seconds and times out after **15 minutes**. If Apple's system dialog is stuck, dismiss it and retry. If the timeout fires, run `xcode-select --install` in Terminal and complete Apple's flow manually before returning to the installer.

## Screen 5 — GitHub Walkthrough

### The webview window is blank

Tauri's embedded webview failed to open GitHub. Click **Open GitHub Account** (or the corresponding button on each substep) again; if it still fails, open the URLs in your default browser instead and check the box manually:

- `https://github.com/signup`
- `https://github.com/settings/ssh/new`
- `https://github.com/settings/tokens/new`

### I pasted a PAT but the Continue button stayed disabled

The three checkboxes on this screen track user confirmation, not PAT presence. You must check the **Create Personal Access Token** box explicitly after pasting the PAT. The PAT itself is written to the Keychain on the input's `onBlur` event — click or tab out of the field before checking the box.

## Screen 6 — Directory Picker

### Nothing happens when I click "Choose folder"

The Tauri dialog plugin failed to open the native picker. Relaunch the installer. If it persists, check Console.app for a crash from `HQ Installer` and file an issue against `indigoai-us/hq-installer`.

### "Existing HQ detected" — which option do I pick?

- **Graft** preserves the existing directory and overlays the new install's additions on top. Use this if you already have a working HQ you want to keep.
- **Overwrite** replaces the existing directory with a fresh install. Use this if the existing HQ is broken, orphaned, or a testbed you don't care about.

## Screen 7 — Template Download Fails

### "Download failed" with a network error

The installer fetches the HQ template tarball from a GitHub archive URL. Failures are almost always one of:

- **No internet connection** — verify with `curl https://github.com` in Terminal.
- **GitHub is down** — check `https://www.githubstatus.com`.
- **HTTPS inspection / corporate MITM proxy** — the installer bundles its own TLS trust store and may reject a corporate MITM cert. Disable the proxy, use a personal network, or file an issue so we can add a trust-override.
- **Disk full** — the tarball + extracted tree needs a few hundred MB. Free up disk space and click **Retry**.

Click **View log** to see the per-tick download progress lines and the final error. The log panel lists bytes downloaded at each tick so you can tell whether the download started at all or failed during the stream.

### "Download failed" with a 404

The template release you're pointing at no longer exists. Report this on `indigoai-us/hq-installer` — the template source URL is baked into the installer binary at build time, so recovery requires a new installer release.

## Screen 8 — Git Init & Integrity Check

### Step 1 (Initialise git repository) failed

The `git2` Rust crate couldn't create the repo. The most common cause is **insufficient permissions on the install directory**. The installer runs as your user, not root — pick a directory under `~/` where your user has write access. If you picked a path inside `/opt`, `/usr/local`, or another system location, go back to screen 6 and pick a home-directory path instead.

### "Process exited with code N" on Step 2 or Step 3

Step 2 runs `scripts/compute-checksums.sh` and Step 3 runs `scripts/core-integrity.sh` from inside your install directory. Click **Log** on the failed step to see the script's stdout. Common causes:

- **Missing scripts** — the template download on screen 7 partially extracted. Go back to screen 7, **Retry** the download, then return to screen 8 and **Retry** from the failed step.
- **Checksum mismatch in `core-integrity.sh`** — a critical file in your starter template was modified (or corrupted during extraction). Retry the template download and integrity check from step 1.
- **Permission denied** — the script is not executable. This should not happen with a fresh template, but you can fix it with `chmod +x scripts/*.sh` and retry.

You do **not** need to restart from step 1 — the screen lets you **Retry** from the failed step.

## Screen 9 — Personalization

### "Name contains only unsafe characters"

The installer strips characters that are unsafe for filesystem paths (`/ \ : * ? " < > |` and `.`) from your name before using it as a directory under `knowledge/`. If every character in your name is on that list, the sanitized name is empty and the installer refuses to proceed. Enter a name with at least one alphanumeric character.

### The Submit button does nothing

Step 3's **Submit** calls the personalization writer, which writes several files into your install directory. Check **View log** (if exposed) or watch Console.app for errors from `personalize-writer`. Most failures are disk-permission issues on the install directory — rerun screen 6 with a different path if so.

## Screen 10 — Indexing

### "Process exited with code N" on `qmd index .`

`qmd` failed to index your install directory. Common causes:

- **qmd not on `$PATH`** — screen 4 installs qmd, but if your shell rc hasn't been re-sourced the installer's spawned process may not see it. Quit and relaunch the installer — the spawn captures the new `$PATH`.
- **Corrupt template** — malformed markdown or YAML frontmatter in the starter template. Click **Log** to see the exact file that tripped qmd and report it.

### "Process exited with code N" on `qmd embed`

`qmd embed` builds the semantic vector store and requires network access to the embedding endpoint.

- **No internet** — indexing works offline, but embeddings do not. Reconnect and retry.
- **API quota** — the embedding provider may be rate-limited. Wait a minute and retry.

Embeddings are not strictly required for HQ to function. If `qmd embed` keeps failing, you can launch Claude Code anyway — `qmd search` (BM25 keyword) will still work, and you can run `qmd embed` manually later from Terminal.

## Screen 11 — Launch

### "Open HQ in Claude Code" does nothing

The installer invokes `launch_claude_code` which starts the `claude` binary in your install directory. If nothing happens:

- Verify Claude Code was actually installed on screen 4 — reopen the installer to the deps screen, or run `which claude` in Terminal.
- Check that `/usr/local/bin` (or wherever Claude Code was installed) is on your user `$PATH`.
- Launch Claude Code manually with `cd ~/hq && claude` from Terminal — if that works, the issue is in how the installer spawns child processes. File an issue.

## Still Stuck?

File an issue on `indigoai-us/hq-installer` with:

- The screen where the failure occurred.
- The exact error text (copy from the log panel where possible).
- Your macOS version (`sw_vers`).
- The installer version (visible in the app's About menu or the `.dmg` filename).

Telemetry will have captured a `installer.install.failed` event with `step` and `error_code`, but that's anonymized — a first-person issue report always gets a faster fix.
