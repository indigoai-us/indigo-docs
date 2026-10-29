#!/usr/bin/env node
// Generates src/content/docs/hq/products/hq-cli-reference.md from hq-cli's
// command catalog (src/command-catalog.generated.ts). No dependencies.
//
// Re-run after an hq-cli release:
//
//   git -C <hq-cli> fetch origin
//   git -C <hq-cli> show origin/main:src/command-catalog.generated.ts > /tmp/catalog.ts
//   VERSION=$(git -C <hq-cli> show origin/main:package.json | node -pe 'JSON.parse(require("fs").readFileSync(0)).version')
//   node scripts/generate-cli-reference.mjs /tmp/catalog.ts "$VERSION"
//
// Arguments:
//   argv[2]  path to command-catalog.generated.ts (required)
//   argv[3]  hq-cli version (optional; otherwise read from ../package.json
//            relative to the catalog file, i.e. an hq-cli checkout)
//
// Hidden commands, hidden subcommands, hidden options and the internal
// `staff` command are skipped. Do not hand-edit the output page.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const catalogPath = process.argv[2];
if (!catalogPath) {
  console.error("usage: node scripts/generate-cli-reference.mjs <command-catalog.generated.ts> [hq-cli-version]");
  process.exit(1);
}

const source = readFileSync(catalogPath, "utf8");
const startMarker = "export const COMMAND_CATALOG = ";
const start = source.indexOf(startMarker);
const end = source.lastIndexOf("] as const");
if (start === -1 || end === -1) {
  console.error(`could not find COMMAND_CATALOG array in ${catalogPath}`);
  process.exit(1);
}
const catalog = JSON.parse(source.slice(start + startMarker.length, end + 1));

let version = process.argv[3];
if (!version) {
  const pkgPath = join(dirname(resolve(catalogPath)), "..", "package.json");
  if (existsSync(pkgPath)) version = JSON.parse(readFileSync(pkgPath, "utf8")).version;
}
if (!version) {
  console.error("hq-cli version not given and no package.json found next to the catalog; pass it as the second argument");
  process.exit(1);
}

const SKIP = new Set(["staff"]);

// Escape text for a Markdown table cell or paragraph. Text inside backtick
// code spans is left alone except for `|`, which GFM tables need escaped
// everywhere. Outside code spans, `<` is escaped so `<arg>` is not read as HTML.
function esc(text, { table = false } = {}) {
  const flat = String(text ?? "").replace(/\s*\n\s*/g, " ").trim();
  const parts = flat.split(/(`[^`]*`)/);
  return parts
    .map((part) => {
      let out = part.startsWith("`") && part.endsWith("`") && part.length > 1
        ? part
        : part.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (table) out = out.replace(/\|/g, "\\|");
      return out;
    })
    .join("");
}

function code(text, { table = false } = {}) {
  const s = String(text).replace(/`/g, "'");
  return "`" + (table ? s.replace(/\|/g, "\\|") : s) + "`";
}

const visible = (items) => (items ?? []).filter((i) => !i.hidden);

function optionsTable(options) {
  const opts = visible(options);
  if (opts.length === 0) return "";
  const rows = opts.map((o) => {
    let desc = esc(o.description, { table: true });
    if (o.choices?.length) desc += ` Choices: ${o.choices.map((c) => code(c, { table: true })).join(", ")}.`;
    if (o.defaultValue !== undefined && typeof o.defaultValue !== "boolean" && !/\bdefault\b/i.test(o.description ?? "")) {
      desc += ` Default: ${code(JSON.stringify(o.defaultValue), { table: true })}.`;
    }
    return `| ${code(o.flags, { table: true })} | ${desc.trim()} |`;
  });
  return ["| Option | Description |", "|---|---|", ...rows].join("\n");
}

// Flatten one level of nesting: "parent child" rows for grouped subcommands.
function subcommandRows(cmd) {
  const rows = [];
  for (const sub of visible(cmd.subcommands)) {
    rows.push({ name: sub.name, usage: sub.usage, description: sub.description });
    for (const child of visible(sub.subcommands)) {
      rows.push({ name: `${sub.name} ${child.name}`, usage: child.usage, description: child.description });
    }
  }
  return rows;
}

const lines = [];
lines.push("---");
lines.push('title: "hq CLI reference"');
lines.push(
  'description: "Every public hq command and subcommand, generated from the hq-cli command catalog."',
);
lines.push("---");
lines.push("");
lines.push(
  `Generated from hq-cli \`src/command-catalog.generated.ts\` at hq-cli ${version} by \`scripts/generate-cli-reference.mjs\`. Do not edit this page by hand; re-run the script instead.`,
);
lines.push("");
lines.push(
  "Hidden and staff-only commands are not listed. Run `hq <command> --help` for the full help text of any command, including options of nested subcommands.",
);
lines.push("");

const commands = catalog.filter((c) => !c.hidden && !SKIP.has(c.name));

lines.push("## Commands");
lines.push("");
lines.push("| Command | Description |");
lines.push("|---|---|");
for (const cmd of commands) {
  lines.push(`| [${code(`hq ${cmd.name}`, { table: true })}](#hq-${cmd.name}) | ${esc(cmd.description, { table: true })} |`);
}
lines.push("");

for (const cmd of commands) {
  lines.push(`## hq ${cmd.name}`);
  lines.push("");
  lines.push(esc(cmd.description));
  lines.push("");
  if (cmd.aliases?.length) {
    lines.push(`Aliases: ${cmd.aliases.map((a) => code(a)).join(", ")}`);
    lines.push("");
  }
  lines.push("```");
  lines.push(`hq ${cmd.name} ${cmd.usage}`.trim());
  lines.push("```");
  lines.push("");

  const subs = visible(cmd.subcommands);
  if (subs.length === 0) {
    const table = optionsTable(cmd.options);
    if (table) {
      lines.push(table);
      lines.push("");
    }
    continue;
  }

  const ownOptions = optionsTable(cmd.options);
  if (ownOptions) {
    lines.push(ownOptions);
    lines.push("");
  }

  lines.push("| Subcommand | Description |");
  lines.push("|---|---|");
  for (const row of subcommandRows(cmd)) {
    lines.push(`| ${code(`${row.name} ${row.usage}`.trim(), { table: true })} | ${esc(row.description, { table: true })} |`);
  }
  lines.push("");

  if (cmd.name === "sync") {
    for (const sub of subs) {
      const table = optionsTable(sub.options);
      if (!table) continue;
      lines.push(`### hq sync ${sub.name}`);
      lines.push("");
      lines.push(esc(sub.description));
      lines.push("");
      lines.push(table);
      lines.push("");
    }
  }
}

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "src", "content", "docs", "hq", "products", "hq-cli-reference.md");
writeFileSync(outPath, lines.join("\n").replace(/\n+$/, "\n"));
console.log(`wrote ${outPath} (${commands.length} commands, hq-cli ${version})`);
