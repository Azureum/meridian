import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { checkShape } from "./shape.mjs";

const TEMPLATE = "## Outcome\n\nWhat the user wants.\n\n## Done\n\n- [ ] \n\n## Where\n\n| Part | Path |\n| --- | --- |\n| | |\n";

test("a file with every section written passes", () => {
  const text = "# Job\n\n## Outcome\n\nSign-in works with a passkey.\n\n## Done\n\n- [ ] `npm test` passes\n\n## Where\n\n| Part | Path |\n| --- | --- |\n| Page | `login.html` |\n";
  assert.deepEqual(checkShape(text, TEMPLATE), []);
});

test("a missing section, an empty one and one left as the template are each named", () => {
  const text = "## Outcome\n\nWhat the user wants.\n\n## Done\n\n- [ ] \n";
  assert.deepEqual(checkShape(text, TEMPLATE), [
    "section still holds the template's text: Outcome",
    "section empty: Done",
    "section missing: Where",
  ]);
});

test("a table with only its header row is empty", () => {
  const text = "## Outcome\n\nReal.\n\n## Done\n\n- one\n\n## Where\n\n| Part | Path |\n| --- | --- |\n";
  assert.deepEqual(checkShape(text, TEMPLATE), ["section empty: Where"]);
});

test("Meridian's own templates read as unfilled against themselves", () => {
  for (const name of ["job.md", "feature.md", "pull-request.md"]) {
    const text = readFileSync(fileURLToPath(new URL(`../templates/${name}`, import.meta.url)), "utf8");
    assert.ok(checkShape(text, text).length > 0, name);
  }
});
