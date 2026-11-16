#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function leftBehind(root) {
  const out = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  return out.split("\n").filter(Boolean).map((line) => ({ state: line.startsWith("??") ? "not tracked" : "not committed", file: line.slice(3) }));
}

function main(argv) {
  const left = leftBehind(path.resolve(argv[0] ?? "."));
  if (!left.length) { console.log("clean: nothing left behind"); return 0; }
  console.error(`clean: ${left.length} file${left.length === 1 ? "" : "s"} left behind. Commit what belongs to the work and delete the rest:`);
  for (const { state, file } of left) console.error(`  - ${file} (${state})`);
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
