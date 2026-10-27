#!/usr/bin/env node
// Check that every internal link in the built site resolves to a page or file.
// Run: pnpm build && node scripts/check-internal-links.mjs [distDir]
// Used in CI to catch links to routes that do not exist, such as a directory
// with no index page (/hq/products/hq-packages/ instead of .../overview/).
//
// Astro redirects are emitted as meta-refresh HTML files, so they resolve like
// any other page. External links, protocol links, and pure #fragments are
// skipped. Fragments and query strings are stripped before resolving.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(process.argv[2] ?? join(__dirname, "..", "dist"));

if (!existsSync(distDir)) {
  console.error(`FAIL: ${distDir} does not exist. Run "pnpm build" first.`);
  process.exit(1);
}

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

// URL path of the page a dist file is served at, used to resolve relative hrefs.
function pageUrl(file) {
  const rel = relative(distDir, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

function resolves(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return false;
  }
  const target = join(distDir, decoded);
  if (!target.startsWith(distDir)) return false;
  if (existsSync(target) && statSync(target).isFile()) return true;
  if (existsSync(join(target, "index.html"))) return true;
  return existsSync(`${target}.html`);
}

const hrefPattern = /<a\b[^>]*?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const broken = [];
let checked = 0;
const pages = htmlFiles(distDir);

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const base = new URL(pageUrl(file), "https://internal.invalid");
  for (const match of html.matchAll(hrefPattern)) {
    const href = (match[1] ?? match[2]).trim();
    if (!href || href.startsWith("#")) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) continue;
    const url = new URL(href, base);
    checked += 1;
    if (!resolves(url.pathname)) {
      broken.push({ page: pageUrl(file), href });
    }
  }
}

if (broken.length) {
  console.error(`FAIL: ${broken.length} broken internal link(s) out of ${checked} on ${pages.length} pages:`);
  for (const { page, href } of broken) console.error(`  ${page} -> ${href}`);
  process.exit(1);
}

console.log(`ok: ${checked} internal links on ${pages.length} pages all resolve`);
