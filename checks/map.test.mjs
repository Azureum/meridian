import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkMap } from "./map.mjs";

function repo(files) {
  const dir = mkdtempSync(path.join(tmpdir(), "map-"));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    writeFileSync(path.join(dir, name), text);
  }
  return dir;
}
const MAP = "<!-- covers: api/*.js -->\n| `api/a.js` | `GET /api/a` | Reads a |\n| `api/b.js` | `POST /api/b` | Writes b |\nShared code is in `lib/`, set by `SOME_SETTING`.\n";

test("a true map passes; routes, settings and globs are not taken for paths", () => {
  const r = checkMap(repo({ "CODEBASE.md": MAP, "api/a.js": "", "api/b.js": "", "lib/x.js": "" }));
  assert.equal(r.ok, true);
  assert.deepEqual(r.paths, ["api/a.js", "api/b.js", "lib/"]);
});

test("a named path that does not exist fails", () => {
  const r = checkMap(repo({ "CODEBASE.md": MAP, "api/a.js": "", "lib/x.js": "" }));
  assert.equal(r.ok, false);
  assert.deepEqual(r.missing, ["api/b.js"]);
});

test("a covered file that is not listed fails", () => {
  const r = checkMap(repo({ "CODEBASE.md": MAP, "api/a.js": "", "api/b.js": "", "api/c.js": "", "api/notes.txt": "", "lib/x.js": "" }));
  assert.equal(r.ok, false);
  assert.deepEqual(r.unlisted, ["api/c.js"]);
});

test("no map file, and a covers line that names no folder, both fail", () => {
  assert.equal(checkMap(repo({ "a.js": "" })).absent, true);
  const r = checkMap(repo({ "CODEBASE.md": "<!-- covers: nowhere/*.js -->\n" }));
  assert.equal(r.ok, false);
  assert.deepEqual(r.malformed, ["nowhere/*.js"]);
});
