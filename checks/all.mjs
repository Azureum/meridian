#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkFeatures } from "./features.mjs";
import { checkMap } from "./map.mjs";
import { scan } from "./scan.mjs";
import { checkShape } from "./shape.mjs";

const BASELINE = ".meridian/baseline.json";
const SYSTEM_TEMPLATE = fileURLToPath(new URL("../templates/SYSTEM.md", import.meta.url));

export function checkAll(root) {
  const problems = [];
  const system = path.join(root, "SYSTEM.md");
  if (!existsSync(system)) problems.push("SYSTEM.md not found");
  else for (const p of checkShape(readFileSync(system, "utf8"), readFileSync(SYSTEM_TEMPLATE, "utf8"))) problems.push(`SYSTEM.md: ${p}`);
  const map = checkMap(root);
  if (map.absent) problems.push("CODEBASE.md not found");
  for (const p of map.missing) problems.push(`CODEBASE.md names a path that does not exist: ${p}`);
  for (const p of map.unlisted) problems.push(`CODEBASE.md does not list: ${p}`);
  for (const g of map.malformed) problems.push(`CODEBASE.md covers entry is not an existing dir/*.ext: ${g}`);
  problems.push(...checkFeatures(root));
  const baseline = path.join(root, BASELINE);
  if (!existsSync(baseline)) problems.push(`${BASELINE} not found: save the scanner's counts with scan.mjs --baseline`);
  else {
    const saved = JSON.parse(readFileSync(baseline, "utf8")).counts, { counts } = scan(root);
    for (const [name, n] of Object.entries(counts)) if (n > (saved[name] ?? 0)) problems.push(`${name} rose from ${saved[name] ?? 0} to ${n}`);
  }
  return problems;
}

function main(argv) {
  const problems = checkAll(path.resolve(argv[0] ?? "."));
  for (const p of problems) console.error(p);
  if (!problems.length) console.log("meridian: every check passes");
  return problems.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
