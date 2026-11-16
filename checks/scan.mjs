#!/usr/bin/env node
// Counts the patterns that practices/1-codebase.md and practices/2-static-analysis.md describe.
//   node checks/scan.mjs [dir]                      print the counts
//   node checks/scan.mjs [dir] --baseline <file>    save the counts
//   node checks/scan.mjs [dir] --ratchet <file>     exit 1 if any count is above the saved one
//   node checks/scan.mjs [dir] --json               print the counts as JSON
//   --exclude <regex>                               skip paths that match (repeatable)
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MONTH = "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?";
const BIG_FILE_LINES = 800;
const SCANNED = /\.(m?js|cjs|jsx|tsx?|css|html?|py|sh|ya?ml)$/i;
const SKIPPED = /(^|\/)(node_modules|vendor|dist|build|coverage|\.git)\/|\.min\.|(^|\/)package-lock\.json$/;
const TEST_FILE = /(^|\/)(tests?|__tests__|spec)\/|[._-](test|spec|unit|e2e)\.[a-z]+$/i;
const WORKFLOW = /(^|\/)\.github\/workflows\//;
const SOURCE_PATH_IN_STRING = /readFileSync\([^)]*\.(m?js|css|html|ya?ml)\b/;

export const DETECTORS = {
  "dated-comment": { on: "comment", why: "history belongs in commits", re: new RegExp(`\\b(?:20\\d\\d-\\d\\d-\\d\\d|\\d{1,2} ${MONTH} 20\\d\\d|${MONTH} \\d{1,2},? 20\\d\\d)\\b`) },
  "history-comment": { on: "comment", why: "says what the code was, not what it is", re: /\b(used to|no longer|previously|formerly|originally|was removed|were removed|retired|as before|until then)\b/i },
  "stopgap-comment": { on: "comment", why: "marks a patch that was never finished", re: /\b(TODO|FIXME|HACK|XXX)\b|\b(temporary|temporarily|for now|workaround|band-?aid|quick fix)\b/i },
  "swallowed-error": { on: "code", why: "a failure is read as an empty answer", re: /\.catch\(\s*\(?\s*\w*\s*\)?\s*=>\s*(\{\s*\}|null|undefined|void 0|\[\s*\]|\(\s*\{\s*\}\s*\)|false|0)\s*\)|\bcatch\s*(\(\s*\w*\s*\))?\s*\{\s*(\/\*.*?\*\/)?\s*\}|\bexcept\b[^:]*:\s*pass\b/ },
  "forced-style": { on: "code", only: /\.css$/i, why: "an override stacked on the rule it should have replaced", re: /!important|:not\(#/g, each: true },
  "soft-check": { on: "code", only: (f) => TEST_FILE.test(f) || WORKFLOW.test(f), why: "a check that cannot fail", re: /\|\|\s*true\b|continue-on-error:\s*true|KNOWN BUG|\b(it|test|describe)\.skip\(|console\.log\(\s*["'`]SKIP/ },
};
const FILE_DETECTORS = {
  "test-reads-source": "a test that matches source text instead of calling the code",
  "big-file": `more than ${BIG_FILE_LINES} lines`,
};

function listFiles(dir) {
  if (existsSync(path.join(dir, ".git"))) {
    return execFileSync("git", ["ls-files", "-z"], { cwd: dir, encoding: "utf8", maxBuffer: 1 << 28 }).split("\0").filter(Boolean);
  }
  const out = [];
  const walk = (rel) => {
    for (const name of readdirSync(path.join(dir, rel))) {
      const next = rel ? `${rel}/${name}` : name;
      if (statSync(path.join(dir, next)).isDirectory()) { if (!SKIPPED.test(next + "/")) walk(next); } else out.push(next);
    }
  };
  walk("");
  return out;
}

// Splits one line into its code and its comment, carrying block-comment state between lines.
function splitter(file) {
  const hash = /\.(py|sh|ya?ml)$/i.test(file), html = /\.html?$/i.test(file);
  const [open, close] = html ? ["<!--", "-->"] : ["/*", "*/"];
  let inBlock = false;
  return (line) => {
    let code = "", comment = "", rest = line;
    while (rest) {
      if (inBlock) {
        const end = rest.indexOf(close);
        if (end < 0) { comment += rest; rest = ""; } else { comment += rest.slice(0, end); rest = rest.slice(end + close.length); inBlock = false; }
        continue;
      }
      const block = hash ? -1 : rest.indexOf(open);
      const lineMark = hash ? rest.search(/(^|\s)#/) : html ? -1 : rest.search(/(^|[^:\\"'`])\/\//);
      if (lineMark >= 0 && (block < 0 || lineMark < block)) { code += rest.slice(0, lineMark + 1); comment += rest.slice(lineMark + 1); rest = ""; }
      else if (block >= 0) { code += rest.slice(0, block); rest = rest.slice(block + open.length); inBlock = true; }
      else { code += rest; rest = ""; }
    }
    return { code, comment };
  };
}

export function scan(dir, { exclude = [] } = {}) {
  const counts = Object.fromEntries([...Object.keys(DETECTORS), ...Object.keys(FILE_DETECTORS)].map((k) => [k, 0]));
  const byFile = Object.fromEntries(Object.keys(counts).map((k) => [k, new Map()]));
  const add = (k, file, n = 1) => { counts[k] += n; byFile[k].set(file, (byFile[k].get(file) || 0) + n); };
  let scanned = 0;
  for (const file of listFiles(dir)) {
    if (!SCANNED.test(file) || SKIPPED.test(file) || exclude.some((re) => re.test(file))) continue;
    let text;
    try { text = readFileSync(path.join(dir, file), "utf8"); } catch (e) { if (e.code === "ENOENT" || e.code === "EISDIR") continue; throw e; }
    scanned++;
    const lines = text.split("\n"), split = splitter(file);
    if (lines.length > BIG_FILE_LINES) add("big-file", file);
    if (TEST_FILE.test(file) && lines.some((l) => SOURCE_PATH_IN_STRING.test(l))) add("test-reads-source", file);
    for (const line of lines) {
      if (line.length > 5000) continue;
      const part = split(line);
      for (const [k, d] of Object.entries(DETECTORS)) {
        if (d.only && !(typeof d.only === "function" ? d.only(file) : d.only.test(file))) continue;
        const target = d.on === "comment" ? part.comment : line;
        if (!target) continue;
        if (d.each) { const n = (target.match(d.re) || []).length; if (n) add(k, file, n); }
        else if (d.re.test(target)) add(k, file);
      }
    }
  }
  const worst = Object.fromEntries(Object.entries(byFile).map(([k, m]) => [k, [...m].sort((a, b) => b[1] - a[1]).slice(0, 3)]));
  return { scanned, counts, worst };
}

function report({ scanned, counts, worst }) {
  const why = { ...Object.fromEntries(Object.entries(DETECTORS).map(([k, d]) => [k, d.why])), ...FILE_DETECTORS };
  console.log(`${scanned} files scanned\n`);
  for (const [k, n] of Object.entries(counts)) {
    console.log(`${String(n).padStart(6)}  ${k.padEnd(18)} ${why[k]}`);
    for (const [file, c] of worst[k]) console.log(`${" ".repeat(8)}${String(c).padStart(5)}  ${file}`);
  }
}

function main(argv) {
  const opt = { exclude: [] }; let dir = ".";
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") opt.json = true;
    else if (a === "--baseline" || a === "--ratchet") opt[a.slice(2)] = argv[++i];
    else if (a === "--exclude") opt.exclude.push(new RegExp(argv[++i]));
    else dir = a;
  }
  const result = scan(path.resolve(dir), opt);
  if (opt.baseline) { writeFileSync(opt.baseline, JSON.stringify({ counts: result.counts }, null, 2) + "\n"); console.log(`saved ${opt.baseline}`); return 0; }
  if (opt.json) console.log(JSON.stringify(result, null, 2)); else report(result);
  if (!opt.ratchet) return 0;
  const saved = JSON.parse(readFileSync(opt.ratchet, "utf8")).counts;
  const up = [], down = [];
  for (const [k, n] of Object.entries(result.counts)) { const was = saved[k] ?? 0; if (n > was) up.push(`${k}: ${was} -> ${n}`); else if (n < was) down.push(`${k}: ${was} -> ${n}`); }
  if (down.length) console.log(`\nlower than saved (save a new baseline to keep the gain):\n  ${down.join("\n  ")}`);
  if (up.length) { console.error(`\nhigher than saved:\n  ${up.join("\n  ")}`); return 1; }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
