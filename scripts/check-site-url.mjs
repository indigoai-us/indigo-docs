#!/usr/bin/env node
// Check that astro.config.mjs has site set to docs.hq.computer.
// Run: node scripts/check-site-url.mjs
// Used in CI to guard against the canonical URL reverting to docs.getindigo.ai.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, "..", "astro.config.mjs");
const config = readFileSync(configPath, "utf8");

const EXPECTED = "https://docs.hq.computer";
const EXPECTED_ENTRY = `site: "${EXPECTED}"`;

if (!config.includes(EXPECTED_ENTRY)) {
  console.error(`FAIL: astro.config.mjs does not contain: ${EXPECTED_ENTRY}`);
  console.error("      The site canonical URL must be set to docs.hq.computer.");
  process.exit(1);
}

console.log(`ok: astro.config.mjs site = ${EXPECTED}`);
