#!/usr/bin/env node
// Check that astro.config.mjs has site set to docs.hq.computer.
// Run: node scripts/check-site-url.mjs
// Used in CI to guard against the canonical URL reverting to docs.getindigo.ai.
//
// Uses a dynamic import() of astro.config.mjs so the assertion is on the
// exported value rather than a string match. If the import fails (e.g. heavy
// Starlight plugin deps not installed), falls back to a tolerant regex that
// looks for site: "..." regardless of surrounding whitespace or quote style.

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, "..", "astro.config.mjs");
const EXPECTED = "https://docs.hq.computer";

async function checkViaImport() {
  const mod = await import(configPath);
  const config = mod.default;
  return config && config.site;
}

function checkViaRegex() {
  const content = readFileSync(configPath, "utf8");
  // Tolerant regex: matches site: "..." or site: '...' with optional spaces
  const match = content.match(/site\s*:\s*["']([^"']+)["']/);
  return match ? match[1] : null;
}

let site;
let method;

try {
  site = await checkViaImport();
  method = "dynamic import";
} catch {
  // Import can fail when Starlight or other heavy plugins are not installed
  // (e.g. a bare worktree). The regex fallback is intentionally tolerant of
  // formatting changes and does not depend on node_modules.
  site = checkViaRegex();
  method = "regex fallback (import failed - node_modules likely absent)";
}

if (site === EXPECTED) {
  console.log(`ok: astro.config.mjs site = ${EXPECTED} (via ${method})`);
} else {
  console.error(`FAIL: astro.config.mjs site = ${JSON.stringify(site)} (via ${method})`);
  console.error(`      Expected: ${EXPECTED}`);
  process.exit(1);
}
