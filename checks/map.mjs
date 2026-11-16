#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const looksLikePath = (s) => !/[*<>:?{}$]/.test(s) && !s.startsWith("/") && (s.includes("/") || /\.[a-z0-9]+$/i.test(s));

export function checkMap(root, file = "CODEBASE.md") {
  const full = path.join(root, file);
  if (!existsSync(full)) return { ok: false, absent: true, paths: [], missing: [], unlisted: [], covers: [], malformed: [] };
  const text = readFileSync(full, "utf8");
  const paths = [...new Set([...text.matchAll(/`([^`\s]+)`/g)].map((m) => m[1]).filter(looksLikePath))];
  const missing = paths.filter((p) => !existsSync(path.join(root, p)));
  const covers = [...text.matchAll(/<!--\s*covers:\s*(.+?)\s*-->/g)].flatMap((m) => m[1].split(/\s+/));
  const unlisted = [], malformed = [];
  for (const glob of covers) {
    const m = glob.match(/^(.+)\/\*(\.[a-z0-9]+)$/i);
    if (!m || !existsSync(path.join(root, m[1]))) { malformed.push(glob); continue; }
    for (const f of readdirSync(path.join(root, m[1]))) if (f.endsWith(m[2]) && !paths.includes(`${m[1]}/${f}`)) unlisted.push(`${m[1]}/${f}`);
  }
  return { ok: !missing.length && !unlisted.length && !malformed.length, absent: false, paths, missing, unlisted, covers, malformed };
}

function main(argv) {
  let dir = ".", file = "CODEBASE.md";
  for (let i = 0; i < argv.length; i++) { if (argv[i] === "--file") file = argv[++i]; else dir = argv[i]; }
  const r = checkMap(path.resolve(dir), file);
  if (r.absent) { console.error(`${file} not found`); return 1; }
  for (const p of r.missing) console.error(`named but does not exist: ${p}`);
  for (const p of r.unlisted) console.error(`exists but is not listed: ${p}`);
  for (const g of r.malformed) console.error(`covers entry is not an existing dir/*.ext: ${g}`);
  if (r.ok) console.log(`${file}: ${r.paths.length} paths exist${r.covers.length ? `, ${r.covers.join(" ")} fully listed` : ""}`);
  return r.ok ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
