#!/usr/bin/env node
/**
 * Rewrite internal links after the notebook-layout restructuring.
 *
 * Old structure (mixed): `/docs/*` and bare `/concepts`, `/tutorials/...` paths
 * (some pre-converted from Docusaurus, some not).
 *
 * New structure (notebook): docs are mounted at `/`, organized into three
 * top-level "tab" folders: get-started/, guides/, api-reference/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "content", "docs");

// Specific path remaps (longest match first to avoid prefix collisions).
const PATH_MAP = [
  // Get Started bucket
  ["/docs/quickstart", "/get-started/quickstart"],
  ["/docs/concepts", "/get-started/concepts"],
  ["/docs/troubleshooting", "/get-started/troubleshooting"],
  ["/docs/introduction", "/get-started"],
  ["/quickstart", "/get-started/quickstart"],
  ["/concepts", "/get-started/concepts"],
  ["/troubleshooting", "/get-started/troubleshooting"],
  ["/introduction", "/get-started"],
  // Guides bucket
  ["/docs/tutorials/", "/guides/tutorials/"],
  ["/docs/examples/", "/guides/examples/"],
  ["/tutorials/", "/guides/tutorials/"],
  ["/examples/", "/guides/examples/"],
  // API reference bucket — drop the /docs prefix; root path stays the same
  ["/docs/api-reference/", "/api-reference/"],
  // Root mapping (must run last so longer prefixes win)
  ["/docs", "/get-started"],
];

// Escape a literal string for use inside a RegExp.
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build a single combined regex matching any URL (in href="..." or markdown
 * link syntax `](...)`) whose path STARTS with one of the mapped prefixes.
 *
 * The replacement function picks the LONGEST matching prefix to avoid
 * `/docs` swallowing `/docs/api-reference/...` etc.
 */
function rewrite(src) {
  // Sort by descending prefix length so longest-match wins inside the loop.
  const sorted = [...PATH_MAP].sort((a, b) => b[0].length - a[0].length);

  // Match a URL inside either href="..." / to="..." OR markdown link `](...)`.
  // Captured group 2 is the path (starts with `/`).
  const re = /(href="|to="|\]\()(\/[A-Za-z0-9\-\/_#]+)/g;

  return src.replace(re, (match, lead, urlPath) => {
    for (const [from, to] of sorted) {
      if (urlPath === from || urlPath.startsWith(from + "#") || urlPath.startsWith(from + "/")) {
        const rest = urlPath.slice(from.length);
        return lead + to + rest;
      }
      if (from.endsWith("/") && urlPath.startsWith(from)) {
        return lead + to + urlPath.slice(from.length);
      }
    }
    return match;
  });
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".mdx")) acc.push(full);
  }
  return acc;
}

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const rewritten = rewrite(original);
  if (rewritten !== original) {
    fs.writeFileSync(file, rewritten);
    changed++;
    console.log(`✓ ${path.relative(ROOT, file)}`);
  }
}
console.log(`\nRewrote links in ${changed} / ${files.length} files.`);
