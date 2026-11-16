import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { scan } from "./scan.mjs";

const SCAN = fileURLToPath(new URL("./scan.mjs", import.meta.url));
const inPieces = (...parts) => parts.join("");
const OPEN = inPieces("/", "*"), CLOSE = inPieces("*", "/"), SLASHES = inPieces("/", "/");
const READ = inPieces("readFile", "Sync");

function repo(files) {
  const dir = mkdtempSync(path.join(tmpdir(), "scan-"));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    writeFileSync(path.join(dir, name), text);
  }
  return dir;
}

test("clean code counts nothing", () => {
  const dir = repo({ "src/a.js": "export const roundHalfAwayFromZero = (v) => Math.round(v);\n", "run.sh": "#!/bin/sh\nexit 0\n" });
  const { scanned, counts } = scan(dir);
  assert.equal(scanned, 2);
  assert.deepEqual(Object.values(counts).filter(Boolean), []);
});

test("every comment is counted, in any language", () => {
  const dir = repo({
    "src/a.js": inPieces(SLASHES, " one\nconst x = 1; ", SLASHES, " two\n", OPEN, "\n three\n", CLOSE, "\n"),
    "src/b.py": "x = 1  # four\n",
    "a.css": inPieces(OPEN, " five ", CLOSE, "\n.x { top: 0; }\n"),
  });
  assert.equal(scan(dir).counts["comment"], 5);
});

test("comments that carry history are counted, the same words in code are not", () => {
  const dir = repo({
    "src/a.js": [
      inPieces(SLASHES, " 4 ", "Nov 2026: changed after the outage"),
      inPieces(SLASHES, " this ", "used", " to read the cache"),
      inPieces(SLASHES, " TO", "DO tidy up"),
      inPieces('const label = "', "no", ' longer available";'),
      inPieces('const day = "2026', '-11-04";'),
      inPieces(OPEN, " was 5, ", "previ", "ously 3 ", CLOSE, " const n = 7;"),
    ].join("\n"),
  });
  const { counts } = scan(dir);
  assert.equal(counts["dated-comment"], 1);
  assert.equal(counts["history-comment"], 2);
  assert.equal(counts["stopgap-comment"], 1);
});

test("a URL is not a comment, and block comments span lines", () => {
  const dir = repo({
    "src/a.js": inPieces('const u = "https:', SLASHES, "example.com/", "no", ' longer";\n', OPEN, "\n line one\n ", "form", "erly two\n", CLOSE, "\nconst x = 1;\n"),
    "src/b.py": inPieces("x = 1  # ", "for", " now\ny = '#", "for", " now'\n"),
    "src/c.html": inPieces("<p>", "used", " to</p>\n<!-", "- ", "used", " to be a table -", "->\n"),
  });
  const { counts } = scan(dir);
  assert.equal(counts["history-comment"], 2);
  assert.equal(counts["stopgap-comment"], 1);
});

test("swallowed errors", () => {
  const dir = repo({
    "src/a.js": [
      inPieces("await read().cat", "ch(() => []);"),
      inPieces("await read().cat", "ch(() => {});"),
      inPieces("try { go(); } cat", "ch {}"),
      inPieces("try { go(); } cat", "ch (e) { }"),
      "await read().catch((e) => { log(e); throw e; });",
      "try { go(); } catch (e) { report(e); }",
    ].join("\n"),
    "src/b.py": inPieces("try:\n    go()\nexce", "pt Exception: pass\n"),
  });
  assert.equal(scan(dir).counts["swallowed-error"], 5);
});

test("forced styles are counted per use, in stylesheets only", () => {
  const forced = inPieces("!imp", "ortant");
  const dir = repo({
    "a.css": inPieces(".x { color: red ", forced, "; margin: 0 ", forced, "; }\nhtml:no", "t(#a) .y { top: 0; }\n"),
    "a.js": inPieces('const s = "', forced, '";\n'),
  });
  assert.equal(scan(dir).counts["forced-style"], 3);
});

test("soft checks count in tests and workflows only", () => {
  const orTrue = inPieces("|", "| true");
  const dir = repo({
    "tests/a_unit.mjs": inPieces('console.log("SK', 'IP no browser");\n'),
    ".github/workflows/ci.yml": inPieces("      - run: make lint ", orTrue, "\n        continue-on-er", "ror: true\n"),
    "scripts/build.sh": inPieces("rm -f out ", orTrue, "\n"),
  });
  assert.equal(scan(dir).counts["soft-check"], 3);
});

test("a test that reads source text, and a long file", () => {
  const dir = repo({
    "tests/a_unit.mjs": inPieces("const src = ", READ, '("api/x.js", "utf8");\n'),
    "tests/b_unit.mjs": inPieces("const data = ", READ, '("tests/fixtures/x.json", "utf8");\n'),
    "src/long.js": "x;\n".repeat(900),
  });
  const { counts, worst } = scan(dir);
  assert.equal(counts["test-reads-source"], 1);
  assert.equal(counts["big-file"], 1);
  assert.deepEqual(worst["big-file"], [["src/long.js", 1]]);
});

test("vendored and generated paths are skipped, and --exclude adds more", () => {
  const bad = inPieces(SLASHES, " TO", "DO\n");
  const dir = repo({ "node_modules/a/i.js": bad, "assets/vendor/lib.js": bad, "app.min.js": bad, "legacy/a.js": bad, "src/a.js": bad });
  assert.equal(scan(dir).counts["stopgap-comment"], 2);
  assert.equal(scan(dir, { exclude: [/^legacy\//] }).counts["stopgap-comment"], 1);
});

test("the ratchet passes at the saved counts, fails above them, and reads a git repository's tracked files", () => {
  const dir = repo({ "src/a.js": inPieces(SLASHES, " TO", "DO\n"), "untracked.js": inPieces(SLASHES, " TO", "DO\n") });
  const git = (...a) => execFileSync("git", a, { cwd: dir, stdio: "pipe" });
  git("init", "-q"); git("add", "src/a.js");
  const base = path.join(dir, "baseline.json");
  execFileSync(process.execPath, [SCAN, dir, "--baseline", base], { stdio: "pipe" });
  assert.equal(spawnSync(process.execPath, [SCAN, dir, "--ratchet", base]).status, 0);
  writeFileSync(path.join(dir, "src/b.js"), inPieces(SLASHES, " FIX", "ME\n")); git("add", "src/b.js");
  const worse = spawnSync(process.execPath, [SCAN, dir, "--ratchet", base], { encoding: "utf8" });
  assert.equal(worse.status, 1);
  assert.match(worse.stderr, /stopgap-comment: 1 -> 2/);
});
