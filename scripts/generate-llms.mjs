#!/usr/bin/env node
// Generate llms.txt and llms-full.txt from the docs content at build time.
// Run: npm run build   (runs `astro build`, then this script)
//      node scripts/generate-llms.mjs [distDir]
//
// Page order and section names come from the sidebar Starlight rendered into
// dist/glossary/index.html, so the files always match the site navigation.
// Titles, descriptions and page bodies come from src/content/docs. Both files
// are written into dist/, so the deployed copies are rebuilt on every deploy
// and are never hand-edited.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = resolve(process.argv[2] ?? join(root, "dist"));
const contentDir = join(root, "src", "content", "docs");
const SITE = "https://docs.hq.computer";

const INTRO =
  "> Documentation for HQ, the company brain your AI runs on: guides, product references, architecture, security, and development docs for HQ Core, the HQ CLI, HQ Cloud and sync, the console, fleet agents, deploy, the hq-pro platform, packages, secrets, sharing and HQ MCP.";
const PRODUCT_SITE =
  "Product overview, pricing and use cases live on the product site: https://hqforwork.com/llms.txt";

// --- sidebar --------------------------------------------------------------

function readSidebar() {
  const page = join(distDir, "glossary", "index.html");
  if (!existsSync(page)) {
    throw new Error(`${page} not found. Run "astro build" first.`);
  }
  const html = readFileSync(page, "utf8");
  const start = html.indexOf('<ul class="top-level');
  const end = html.indexOf("</nav>", start);
  if (start < 0 || end < 0) throw new Error("Sidebar not found in built HTML.");
  const nav = html.slice(start, end);
  const sections = [];
  const re = /<summary[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>|<a href="([^"]+)"/g;
  for (const m of nav.matchAll(re)) {
    if (m[1]) sections.push({ label: decode(m[1].trim()), urls: [] });
    else if (m[2].startsWith("/") && sections.length) sections.at(-1).urls.push(m[2]);
  }
  return sections.filter((s) => s.urls.length);
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// --- content --------------------------------------------------------------

function sourceFor(url) {
  const base = join(contentDir, url.replace(/^\/|\/$/g, ""));
  for (const candidate of [`${base}.md`, `${base}.mdx`, join(base, "index.md"), join(base, "index.mdx")]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`No source file for ${url}`);
}

function parsePage(file) {
  const raw = readFileSync(file, "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const front = fm ? fm[1] : "";
  const body = fm ? raw.slice(fm[0].length) : raw;
  return { title: field(front, "title"), description: field(front, "description"), body };
}

function field(front, name) {
  const m = front.match(new RegExp(`^${name}:\\s*(.*)$`, "m"));
  if (!m) return "";
  let v = m[1].trim();
  if (/^["']/.test(v)) v = v.slice(1, -1);
  return v.replace(/\\"/g, '"');
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=["']([^"']*)["']`));
  return m ? m[1] : "";
}

function absolute(href) {
  return href.startsWith("/") ? SITE + href : href;
}

// Turn a page body into plain Markdown for llms-full.txt: drop MDX imports and
// layout components, turn LinkCards into list items, demote headings two
// levels so they sit under the page heading, and make site links absolute.
function toMarkdown(body) {
  const out = [];
  let fence = null;
  for (const line of body.split("\n")) {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) {
      if (!fence) fence = f[1];
      else if (f[1].startsWith(fence[0]) && f[1].length >= fence.length) fence = null;
      out.push(line);
      continue;
    }
    if (fence) {
      out.push(line);
      continue;
    }
    if (/^import\s.+from\s+['"]/.test(line)) continue;
    if (/^\s*<\/?(CardGrid|Aside|Card|Steps|Tabs|TabItem)\b[^>]*>\s*$/.test(line)) continue;
    const card = line.match(/^\s*<LinkCard\b[^>]*\/>\s*$/);
    if (card) {
      const title = attr(line, "title");
      const href = absolute(attr(line, "href"));
      const desc = attr(line, "description");
      out.push(`- [${title}](${href})${desc ? `: ${desc}` : ""}`);
      continue;
    }
    let l = line.replace(/^(#{1,4})(\s)/, "$1##$2");
    l = l.replace(/\]\((\/[^)]*)\)/g, (_, href) => `](${SITE}${href})`);
    out.push(l);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// --- output ---------------------------------------------------------------

const sections = readSidebar().map((s) => ({
  label: s.label,
  pages: s.urls.map((url) => ({ url, ...parsePage(sourceFor(url)) })),
}));
const today = new Date().toISOString().slice(0, 10);

// Every content page except the home page should be in the sidebar. A page
// left out of the sidebar would be dropped from both files, so fail instead.
const emitted = new Set(sections.flatMap((s) => s.pages.map((p) => sourceFor(p.url))));
const contentFiles = readdirSync(contentDir, { recursive: true })
  .filter((f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f))
  .map((f) => join(contentDir, f));
const missing = contentFiles.filter((f) => !emitted.has(f));
if (missing.length) {
  throw new Error(`Pages not in the sidebar, so missing from llms files:\n${missing.join("\n")}`);
}

const index = [`# HQ documentation`, "", INTRO, "", `Last updated: ${today}`, "", PRODUCT_SITE];
for (const s of sections) {
  index.push("", `## ${s.label}`, "");
  for (const p of s.pages) {
    index.push(`- [${p.title}](${SITE}${p.url})${p.description ? `: ${p.description}` : ""}`);
  }
}
writeFileSync(join(distDir, "llms.txt"), index.join("\n") + "\n");

const full = [
  `# HQ documentation`,
  "",
  INTRO,
  "",
  `Last updated: ${today}`,
  "",
  PRODUCT_SITE,
  "",
  `This file is the full text of every page on docs.hq.computer. For a short index, see ${SITE}/llms.txt`,
];
for (const s of sections) {
  full.push("", "---", "", `## ${s.label}`);
  for (const p of s.pages) {
    full.push("", `### ${p.title}`, "", `Source: ${SITE}${p.url}`);
    if (p.description) full.push("", `> ${p.description}`);
    full.push("", toMarkdown(p.body));
  }
}
writeFileSync(join(distDir, "llms-full.txt"), full.join("\n") + "\n");

const count = sections.reduce((n, s) => n + s.pages.length, 0);
console.log(`llms.txt and llms-full.txt: ${count} pages in ${sections.length} sections -> ${distDir}`);
