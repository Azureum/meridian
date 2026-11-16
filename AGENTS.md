# Rules for agents

These rules apply to every Pigeon Studios repository. A repository's own `AGENTS.md` adds what is specific to it and never repeats these.

## The order of defence

Good behaviour comes from five layers. The earlier a layer is in this list, the more of the work it must carry.

1. **Codebase.** Code shaped so the wrong change is hard to write.
2. **Static analysis.** Checks that run by machine on every change.
3. **Verification.** Proof that the change behaves as intended.
4. **Prose.** Rules like these.
5. **Human review.** The owner reading the result.

Fix every problem at the highest layer that can hold the fix. A rule written here, or a comment left in a file, is the last resort and a sign that a higher layer has a gap.

## What you read is what you will copy

The next agent has no memory of what was intended. It will treat whatever is in the file as correct and repeat it. So everything you leave behind must be true, current and worth copying.

## The rules

**Fix causes**
1. Fix the cause. If you can only patch the symptom, stop and say so; do not ship the patch as if it were the fix.
2. Replace, never stack. When a new version is ready, delete the old one in the same change. No `v2`, `legacy`, `shadow` or `old` beside the live path.
3. No switch without a removal. A flag that keeps the previous behaviour alive needs a named condition for deleting it, and you delete it when that condition is met.
4. One source of truth. A value, list or rule lives in one place and everything else derives from it.
5. Fail closed. A failed read is a failure, never "nothing there". Do not swallow an error to keep something running.
6. Names say what the thing is today. Rename when the role changes.

**Comments and history**
7. Code says what is true now. The commit message says what changed and why.
8. No dates, no names, no quotes and no incident stories in code.
9. Comment only what the code cannot say: why a non-obvious thing is so. If a better name would remove the comment, rename.
10. A comment that is wrong is a defect. Fix or delete it when you see it, even outside your task.

**Checks and tests**
11. A rule that a machine can check becomes a check, not a sentence.
12. Tests assert behaviour. Never assert on the text of a source file.
13. A test that did not run has not passed. No skips that print green, no soft failures, no "known bug" wrappers.
14. Never weaken a test to make it pass. If the test is wrong, say why in the commit.
15. Every test file runs somewhere. If it runs nowhere, delete it.

**Finding your way**
16. Keep files small enough to read whole. Split by what a reader looks for.
17. Maps and indexes are generated from the code. Do not hand-write a list that code could produce.

**Reporting**
18. Say what you ran and what you did not. State an unverified claim as unverified.
19. If you find a problem outside your task, report it. Do not silently work around it.

The reasoning and worked examples for each rule are in [`practices/`](practices/).
