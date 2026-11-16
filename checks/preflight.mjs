#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_TIMEOUT_SECONDS = 120;

export function preflight(root, config) {
  const gaps = [];
  for (const name of config.env ?? []) if (!process.env[name]) gaps.push({ check: `env ${name}`, why: "not set" });
  for (const file of config.files ?? []) if (!existsSync(path.join(root, file))) gaps.push({ check: `file ${file}`, why: "not found" });
  for (const { name, run, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS } of config.commands ?? []) {
    const result = spawnSync(run, { cwd: root, shell: true, encoding: "utf8", timeout: timeoutSeconds * 1000 });
    if (result.error?.code === "ETIMEDOUT") gaps.push({ check: name, why: `no answer after ${timeoutSeconds} s` });
    else if (result.status !== 0) gaps.push({ check: name, why: lastLine(result.stderr) || lastLine(result.stdout) || `exit ${result.status}` });
  }
  return gaps;
}

function lastLine(text) {
  return String(text ?? "").trim().split("\n").pop().trim().slice(0, 200);
}

function main(argv) {
  const root = path.resolve(argv[0] ?? "."), file = path.join(root, ".meridian", "preflight.json");
  if (!existsSync(file)) { console.error(`${file} not found`); return 1; }
  const gaps = preflight(root, JSON.parse(readFileSync(file, "utf8")));
  if (!gaps.length) { console.log("preflight passed"); return 0; }
  console.error(`preflight found ${gaps.length} gap${gaps.length === 1 ? "" : "s"}:`);
  for (const gap of gaps) console.error(`  - ${gap.check}: ${gap.why}`);
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
