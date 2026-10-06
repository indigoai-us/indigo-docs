---
title: HQ anywhere
description: Install HQ for Claude Code and Codex, connect hosted MCP clients, and check or remove your setup.
---

HQ Anywhere connects Claude Code, Codex, ChatGPT, and Grok to your HQ context. Claude Code and Codex use local HQ components. ChatGPT and Grok connect to the hosted HQ MCP service.

HQ Anywhere is available to people who opt in during setup in HQ Desktop when the `hq-anywhere-runtime` rollout switch is enabled. The switch is an administrator kill switch. If the CLI reports that HQ Anywhere is unavailable, check that you opted in and ask your HQ administrator whether rollout is enabled for your account.

## Install

Run the install command from an HQ checkout. To use a different checkout, add `--hq-root <directory>`. Use `--dry-run` to review local file and configuration changes before installing.

### Claude Code with direct hooks

```bash
hq install --global --runtime claude
```

Direct mode adds the HQ instructions, skills, hooks, and MCP server to your Claude Code user setup. It records the previous settings so the global install can be removed later. Direct mode is the default.

### Claude Code with the plugin

This command installs the published HQ plugin from the HQ marketplace.

```bash
hq install --global --runtime claude --via plugin
```

Plugin mode records its marketplace in your user settings and is for Claude Code only.

### Codex

```bash
hq install --global --runtime codex
```

This adds HQ instructions, skills, hooks, and the MCP server to your Codex user setup. Existing unrelated settings are preserved. The install records the previous configuration so it can be restored during uninstall.

This command installs the published HQ Anywhere Codex pack.

```bash
hq install @indigoai-us/hq-anywhere
```

The command fetches the pack from the `indigoai-us/hq-packages` repository. It adds the pack's skills, Codex hook adapter, and HQ MCP registration.

### ChatGPT

```bash
hq install --global --runtime chatgpt
```

The CLI prints the hosted HQ MCP URL and setup steps. In ChatGPT, open **Settings > Apps > Create** and add the URL as a custom MCP app. Your workspace administrator may need to enable developer mode. The CLI does not edit ChatGPT settings.

### Grok

```bash
hq install --global --runtime grok
```

The CLI prints the hosted HQ MCP URL and setup steps. In Grok, open **grok.com/connectors > New Connector > Custom**, enter the URL, and finish authentication. The CLI does not edit Grok settings.

## Link a folder to a company

Link a project folder when HQ should use a specific company context.

```bash
hq link <company> --path <folder>
```

Omit `--path` to link the current folder. You must be an active member of the company. For example.

```bash
hq link indigo --path ~/src/my-project
```

HQ uses an explicit folder link to resolve its company context. If a folder has no company link, HQ uses your personal context; it does not guess a company. Use `hq link --list` to review linked folders and `hq unlink --path <folder>` to remove a link.

## Check the installation

Run the Anywhere checks from any folder.

```bash
hq doctor --only anywhere
```

The Anywhere family includes the `anywhere.runtime-health` row. It reports hqd reachability, the runtime flag, current folder binding, daemon version and uptime when supported, and Unix socket ownership and permissions. If hqd is unreachable on Unix, the suggested command is `hq daemon install` when no service is installed or `hq daemon restart --daemon` when it is installed. An older daemon without the health operation or a Unix socket that is not confirmed user-only also suggests a restart. On Windows, an unreachable daemon reports that startup is refused because named-pipe ACLs are unsupported. Other rows check install mode, the HQ pointer, linked-folder registry, daemon service, CLI/daemon version match, heartbeat, Claude and Codex MCP registrations, skill links, and host-managed ChatGPT and Grok connectors. Each actionable row includes its repair command.

Check the local MCP registrations separately with this command.

```bash
hq mcp status
```

This reports HQ MCP servers in Claude Code and Codex, including missing or unhealthy registrations and configuration drift. It does not display secret values. ChatGPT and Grok use hosted connectors, so their settings are managed in the host applications.

## Uninstall

Remove a Claude Code global install with this command.

```bash
hq uninstall --global --runtime claude
```

This removes the HQ direct setup or the HQ plugin installed by the CLI and restores saved settings where possible.

Remove a Codex global install with this command.

```bash
hq uninstall --global --runtime codex
```

This removes the HQ Codex setup and restores saved settings where possible.

The CLI cannot remove hosted connectors. In ChatGPT, remove the HQ app from **Settings > Apps**. In Grok, remove the HQ connector from **grok.com/connectors**.

## Host capabilities

| Host | Resolve company | Knowledge search | Journal append | Worker dispatch | Setup |
| --- | --- | --- | --- | --- | --- |
| Claude Code | Local folder link | Local HQ daemon | Local HQ daemon | Local HQ daemon | `hq install --global --runtime claude` |
| Codex | Local folder link | Local HQ daemon | Local HQ daemon | Local HQ daemon | `hq install --global --runtime codex` |
| ChatGPT | Cloud membership tools; no local repo resolution | Cloud-only | Cloud-only | Local daemon-backed only; unavailable through the remote connector | ChatGPT web, Settings > Apps > Create, hosted HQ MCP URL |
| Grok | Cloud membership tools; no local repo resolution | Cloud-only | Cloud-only | Local daemon-backed only; unavailable through the remote connector | grok.com/connectors > New Connector > Custom, hosted HQ MCP URL |

ChatGPT and Grok do not register a local MCP server. Worker dispatch and local repo resolution are not available through their hosted connector.
