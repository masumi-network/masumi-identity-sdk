#!/usr/bin/env node
/**
 * One-shot converter: Docusaurus MDX -> Fumadocs MDX.
 *
 * Handles:
 *   - <CardGroup cols={N}> / </CardGroup>          -> <Cards> / </Cards>
 *   - <Card ... icon="foo" ...>                     -> <Card ...>           (drop icon prop)
 *   - <Tabs> + <TabItem value="X" label="Y">...     -> <Tabs items={[...]}><Tab value="Y">
 *   - <Note|Warning|Tip|Info> text </…>             -> <Callout type="…"> text </Callout>
 *   - href|to="/introduction" (internal)            -> href|to="/docs/introduction"
 *
 * Usage: node scripts/convert-docusaurus.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "content", "docs");

const DOCS_PREFIX = "/docs";

// Known top-level doc paths (relative to Docusaurus root) that must be
// rewritten with a /docs prefix when they appear in internal links.
const INTERNAL_PATHS = [
  "/introduction",
  "/quickstart",
  "/concepts",
  "/troubleshooting",
  "/tutorials/link-agent-to-aid",
  "/tutorials/verify-vc-a2a",
  "/examples/template-agent",
  "/api-reference/masumi-identity",
  "/api-reference/agent-linking",
  "/api-reference/credentials",
  "/api-reference/signature-verification",
  "/api-reference/constants",
  "/api-reference/utilities",
  "/api-reference/types",
];

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".mdx")) acc.push(full);
  }
  return acc;
}

function convertCardGroup(src) {
  return src
    .replace(/<CardGroup\s+cols=\{\d+\}\s*>/g, "<Cards>")
    .replace(/<CardGroup\s*>/g, "<Cards>")
    .replace(/<\/CardGroup>/g, "</Cards>");
}

function stripCardIcon(src) {
  // Remove `icon="…"` attribute from <Card …> tags.
  return src.replace(/(<Card\b[^>]*?)\s+icon="[^"]*"/g, "$1");
}

function convertAdmonitions(src) {
  const map = {
    Note: "info",
    Tip: "info",
    Info: "info",
    Warning: "warn",
  };
  let out = src;
  for (const [tag, type] of Object.entries(map)) {
    const open = new RegExp(`<${tag}>`, "g");
    const close = new RegExp(`</${tag}>`, "g");
    out = out.replace(open, `<Callout type="${type}">`).replace(close, "</Callout>");
  }
  return out;
}

function convertTabs(src) {
  // Convert each <Tabs>...</Tabs> block in isolation.
  const tabsRE = /<Tabs\b[^>]*>([\s\S]*?)<\/Tabs>/g;
  return src.replace(tabsRE, (match, inner) => {
    const labels = [];
    const rewritten = inner.replace(
      /<TabItem\s+value="[^"]*"\s+label="([^"]*)"\s*>/g,
      (_, label) => {
        labels.push(label);
        return `<Tab value="${label}">`;
      },
    ).replace(/<\/TabItem>/g, "</Tab>");
    if (labels.length === 0) return match;
    const itemsAttr = JSON.stringify(labels).replace(/"/g, "'");
    return `<Tabs items={${itemsAttr}}>${rewritten}</Tabs>`;
  });
}

function stripHeadingAnchors(src) {
  // `## Foo {#foo-id}`  ->  `## Foo`
  // Fumadocs auto-generates slugs from heading text; explicit markers break MDX parse.
  return src.replace(/^(#{1,6}\s.*?)\s*\{#[^}]+\}\s*$/gm, "$1");
}

function rewriteInternalLinks(src) {
  let out = src;
  for (const p of INTERNAL_PATHS) {
    // Match href="/path" or to="/path" exactly, or with anchor/query suffix.
    const re = new RegExp(`(href|to)="${p.replace(/[-/]/g, "\\$&")}(#[^"]*)?"`, "g");
    out = out.replace(re, (_, attr, anchor = "") => `${attr}="${DOCS_PREFIX}${p}${anchor}"`);
  }
  return out;
}

function convert(src, filePath) {
  let out = src;
  out = convertCardGroup(out);
  out = stripCardIcon(out);
  out = convertAdmonitions(out);
  out = convertTabs(out);
  out = stripHeadingAnchors(out);
  out = rewriteInternalLinks(out);
  return out;
}

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const converted = convert(original, file);
  if (converted !== original) {
    fs.writeFileSync(file, converted);
    changed++;
    console.log(`✓ ${path.relative(ROOT, file)}`);
  }
}
console.log(`\nConverted ${changed} / ${files.length} files.`);
