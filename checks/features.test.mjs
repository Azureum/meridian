import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkAll } from "./all.mjs";
import { checkFeatures } from "./features.mjs";

function repo(files) {
  const dir = mkdtempSync(path.join(tmpdir(), "features-"));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    writeFileSync(path.join(dir, name), text);
  }
  return dir;
}
const feature = (where = "| Page | `src/login.js` |") => [
  "# Sign-in", "", "People sign in with a passkey.", "",
  "## What it is for", "", "Getting into an account.", "",
  "## What must always be true", "", "A session belongs to exactly one account.", "",
  "## How it behaves", "", "A wrong passkey shows an error and stays on the page.", "",
  "## Where it lives", "", "| Part | Path |", "| --- | --- |", where, "",
  "## What it depends on", "", "The accounts table.", "",
].join("\n");
const MAP = "# Features\n\n| Feature | Where a user meets it | File |\n| --- | --- | --- |\n| Sign-in | The first screen | [sign-in.md](sign-in.md) |\n";

test("a map and a feature file in step pass", () => {
  const dir = repo({ "features/README.md": MAP, "features/sign-in.md": feature(), "src/login.js": "" });
  assert.deepEqual(checkFeatures(dir), []);
});

test("no feature map is a problem", () => {
  assert.deepEqual(checkFeatures(repo({ "src/a.js": "" })), ["features/README.md not found"]);
});

test("a file missing from the map, a dead link, an unwritten section and a dead path are each reported", () => {
  const dir = repo({
    "features/README.md": MAP + "| Gone | Nowhere | [gone.md](gone.md) |\n",
    "features/sign-in.md": feature("| Page | `src/missing.js` |"),
    "features/orphan.md": feature().replace("Getting into an account.", ""),
    "src/login.js": "",
  });
  assert.deepEqual(checkFeatures(dir).sort(), [
    "features/README.md links to a file that does not exist: gone.md",
    "features/orphan.md is not in the feature map",
    "features/orphan.md: section empty: What it is for",
    "features/sign-in.md: names a path that does not exist: src/missing.js",
  ]);
});

test("the single command runs the map, the features and the saved counts together", () => {
  const system = "## What it is\n\nA ledger for a bank.\n\n## What matters most\n\n1. Accuracy\n2. A complete record\n\n## What gives way\n\nSpeed.\n\n## What must never happen\n\nA lost entry.\n\n## What this means for the work\n\nEverything is verified before a merge.\n";
  const good = {
    "SYSTEM.md": system,
    "CODEBASE.md": "<!-- covers: src/*.js -->\n| `src/login.js` | Sign-in |\n",
    "features/README.md": MAP, "features/sign-in.md": feature(), "src/login.js": "export const a = 1;\n",
  };
  const counts = { "comment": 0, "dated-comment": 0, "history-comment": 0, "stopgap-comment": 0, "swallowed-error": 0, "forced-style": 0, "soft-check": 0, "test-reads-source": 0, "big-file": 0, "versioned-name": 0 };
  assert.deepEqual(checkAll(repo({ ...good, ".meridian/baseline.json": JSON.stringify({ counts }) })), []);
  assert.deepEqual(checkAll(repo(good)), [".meridian/baseline.json not found: save the scanner's counts with scan.mjs --baseline"]);
  const worse = repo({ ...good, ".meridian/baseline.json": JSON.stringify({ counts }), "src/login_old.js": "export const b = 1;\n" });
  assert.deepEqual(checkAll(worse), ["CODEBASE.md does not list: src/login_old.js", "versioned-name rose from 0 to 1"]);
  const noSystem = { ...good, ".meridian/baseline.json": JSON.stringify({ counts }) };
  delete noSystem["SYSTEM.md"];
  assert.deepEqual(checkAll(repo(noSystem)), ["SYSTEM.md not found"]);
  assert.deepEqual(checkAll(repo({ ...noSystem, "SYSTEM.md": system.replace("Speed.", "") })), ["SYSTEM.md: section empty: What gives way"]);
});
