import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { leftBehind } from "./clean.mjs";

function repo() {
  const dir = mkdtempSync(path.join(tmpdir(), "clean-"));
  const git = (...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.com", ...args], { cwd: dir, stdio: "pipe" });
  git("init", "-q");
  writeFileSync(path.join(dir, "app.js"), "export const a = 1;\n");
  writeFileSync(path.join(dir, ".gitignore"), "ignored.log\n");
  git("add", "."); git("commit", "-q", "-m", "start");
  return dir;
}

test("a committed tree has nothing left behind, and ignored files do not count", () => {
  const dir = repo();
  writeFileSync(path.join(dir, "ignored.log"), "x");
  assert.deepEqual(leftBehind(dir), []);
});

test("a scratch file and an uncommitted edit are both left behind", () => {
  const dir = repo();
  writeFileSync(path.join(dir, "scratch-debug.js"), "x");
  writeFileSync(path.join(dir, "app.js"), "export const a = 2;\n");
  assert.deepEqual(leftBehind(dir).sort((a, b) => a.file.localeCompare(b.file)), [
    { state: "not committed", file: "app.js" },
    { state: "not tracked", file: "scratch-debug.js" },
  ]);
});
