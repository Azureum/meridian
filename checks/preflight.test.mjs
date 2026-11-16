import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { preflight } from "./preflight.mjs";

const PREFLIGHT = fileURLToPath(new URL("./preflight.mjs", import.meta.url));
const NODE = JSON.stringify(process.execPath);

function repo(files = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "preflight-"));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    writeFileSync(path.join(dir, name), text);
  }
  return dir;
}

test("everything in place: no gaps", () => {
  const dir = repo({ "docs/spec.md": "x" });
  process.env.PREFLIGHT_TEST_SET = "1";
  const gaps = preflight(dir, { env: ["PREFLIGHT_TEST_SET"], files: ["docs/spec.md"], commands: [{ name: "builds", run: `${NODE} -e "process.exit(0)"` }] });
  assert.deepEqual(gaps, []);
});

test("every gap is reported together, not only the first", () => {
  const dir = repo();
  delete process.env.PREFLIGHT_TEST_UNSET;
  const gaps = preflight(dir, {
    env: ["PREFLIGHT_TEST_UNSET"],
    files: ["missing.md"],
    commands: [
      { name: "api key works", run: `${NODE} -e "console.error('401 unauthorized'); process.exit(1)"` },
      { name: "tests run", run: `${NODE} -e "process.exit(0)"` },
      { name: "builds", run: `${NODE} -e "process.exit(3)"` },
    ],
  });
  assert.deepEqual(gaps, [
    { check: "env PREFLIGHT_TEST_UNSET", why: "not set" },
    { check: "file missing.md", why: "not found" },
    { check: "api key works", why: "401 unauthorized" },
    { check: "builds", why: "exit 3" },
  ]);
});

test("a command that hangs is a gap, not a wait", () => {
  const gaps = preflight(repo(), { commands: [{ name: "service answers", run: `${NODE} -e "setTimeout(() => {}, 20000)"`, timeoutSeconds: 1 }] });
  assert.deepEqual(gaps, [{ check: "service answers", why: "no answer after 1 s" }]);
});

test("the command line prints one list and exits 1 on a gap, 0 when clean, 1 with no configuration", () => {
  const bad = repo({ ".meridian/preflight.json": JSON.stringify({ files: ["a.md", "b.md"] }) });
  const failed = spawnSync(process.execPath, [PREFLIGHT, bad], { encoding: "utf8" });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /preflight found 2 gaps:\n  - file a\.md: not found\n  - file b\.md: not found/);
  const good = repo({ ".meridian/preflight.json": JSON.stringify({ files: ["a.md"] }), "a.md": "x" });
  assert.equal(spawnSync(process.execPath, [PREFLIGHT, good]).status, 0);
  assert.equal(spawnSync(process.execPath, [PREFLIGHT, repo()]).status, 1);
});
