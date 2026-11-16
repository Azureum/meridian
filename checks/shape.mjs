#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function sections(text) {
  const found = [];
  for (const line of text.split("\n")) {
    const heading = line.match(/^## +(.+?)\s*$/);
    if (heading) found.push({ title: heading[1], lines: [] });
    else if (found.length) found.at(-1).lines.push(line);
  }
  return found.map(({ title, lines }) => ({ title, body: lines.join("\n").trim() }));
}

function written(body) {
  const lines = body.split("\n");
  const kept = lines.filter((line, i) => {
    const isSeparator = /^\|[\s|:-]+\|$/.test(line.trim());
    const isHeaderRow = /^\|[\s|:-]+\|$/.test((lines[i + 1] ?? "").trim());
    const isEmptyRow = /^\|[\s|]*\|$/.test(line.trim());
    const isEmptyItem = /^[-*] *(\[[ x]\])?\s*$/.test(line.trim());
    return !isSeparator && !isHeaderRow && !isEmptyRow && !isEmptyItem;
  });
  return /[\p{L}\p{N}]/u.test(kept.join("\n"));
}

export function checkShape(text, templateText) {
  const have = new Map(sections(text).map((s) => [s.title, s.body]));
  const problems = [];
  for (const { title, body } of sections(templateText)) {
    if (!have.has(title)) problems.push(`section missing: ${title}`);
    else if (!written(have.get(title))) problems.push(`section empty: ${title}`);
    else if (have.get(title) === body) problems.push(`section still holds the template's text: ${title}`);
  }
  return problems;
}

function main(argv) {
  const [file, template] = argv;
  if (!file || !template) { console.error("usage: shape.mjs <file> <template>"); return 1; }
  for (const f of [file, template]) if (!existsSync(f)) { console.error(`${f} not found`); return 1; }
  const problems = checkShape(readFileSync(file, "utf8"), readFileSync(template, "utf8"));
  for (const p of problems) console.error(`${file}: ${p}`);
  if (!problems.length) console.log(`${file}: every section of ${path.basename(template)} is written`);
  return problems.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
