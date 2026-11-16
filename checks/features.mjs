#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { looksLikePath } from "./map.mjs";
import { checkShape, sections } from "./shape.mjs";

const TEMPLATE = fileURLToPath(new URL("../templates/feature.md", import.meta.url));
const MAP = "features/README.md";

export function checkFeatures(root, templateText = readFileSync(TEMPLATE, "utf8")) {
  const dir = path.join(root, "features");
  if (!existsSync(path.join(root, MAP))) return [`${MAP} not found`];
  const map = readFileSync(path.join(root, MAP), "utf8");
  const linked = new Set([...map.matchAll(/\]\(([^)#\s]+\.md)\)/g)].map((m) => m[1].replace(/^\.\//, "")));
  const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md");
  const problems = [];
  for (const target of linked) if (!existsSync(path.join(dir, target))) problems.push(`${MAP} links to a file that does not exist: ${target}`);
  for (const file of files) {
    if (!linked.has(file)) problems.push(`features/${file} is not in the feature map`);
    const text = readFileSync(path.join(dir, file), "utf8");
    for (const p of checkShape(text, templateText)) problems.push(`features/${file}: ${p}`);
    const where = sections(text).find((s) => s.title === "Where it lives")?.body ?? "";
    for (const [, named] of where.matchAll(/`([^`\s]+)`/g)) {
      if (looksLikePath(named) && !existsSync(path.join(root, named))) problems.push(`features/${file}: names a path that does not exist: ${named}`);
    }
  }
  return problems;
}

function main(argv) {
  const root = path.resolve(argv[0] ?? ".");
  const problems = checkFeatures(root);
  for (const p of problems) console.error(p);
  if (!problems.length) console.log("features: the map and every feature file are in step");
  return problems.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
