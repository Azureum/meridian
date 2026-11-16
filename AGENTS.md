# Rules for agents

When Meridian is in a repository, it is the guide for agents working there. The repository's own `AGENTS.md` adds what is specific to that project and never repeats these rules.

If the repository has no `CODEBASE.md` yet, it has not been set up: do [`SETUP.md`](SETUP.md) first.

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
7. Ban what needs nuance to use well. If something keeps being misused, forbid it in product code and allow it only inside the one place that uses it correctly.
8. Parts that must not mix live in separate top-level folders that may not import each other, and a check enforces it.

**Comments and history**
9. Code says what is true now. The commit message says what changed and why.
10. No dates, no names, no quotes and no incident stories in code.
11. Comment only what the code cannot say: why a non-obvious thing is so. If a better name would remove the comment, rename.
12. A comment that is wrong is a defect. Fix or delete it when you see it, even outside your task.
13. Never use a comment or a document to justify skipping the right fix. A written excuse is not a fix.

**Checks**
14. After every change: compile, build, lint, type-check, test. The work is not done until all are clean.
15. Keep types true. Never switch the checker off or reach for a catch-all type to get past an error.
16. Use types to say what things mean, so that code which is wrong in its logic does not compile.
17. A rule that a machine can check becomes a lint or a check, not a sentence. Every correction you are given becomes one.
18. A lint's message says what is wrong and how to fix the root cause.
19. CI runs every check on every change, and the full suite before anything reaches the main branch. The main branch stays green. Never make CI faster by hiding failures: no retries, wider timeouts or skipped tests.
20. Tests assert behaviour. Never assert on the text of a source file.
21. A test that did not run has not passed. No skips that print green, no soft failures, no "known bug" wrappers.
22. Never weaken a check to make it pass. If the check is wrong, say why in the commit.
23. Every test file runs somewhere. If it runs nowhere, delete it.

**Finding your way**
24. Keep files small enough to read whole. Split by what a reader looks for.
25. The repository has a `CODEBASE.md` that says where things are and what each API route does. Read it first. Update it in the same change that adds, moves or removes anything it names; a check fails when it is out of step.
26. Each feature has its own file in `features/`: what it is, what it is for, how it is meant to behave. It states what is true now, never what was tried before. Read the feature's file before changing the feature, and update it in the same change.
27. `features/README.md` is the feature map: every feature by the name a user would use. Use those names in code, in tests and in conversation.

**Verification**
28. Passing checks is not the task. Show that the change does what was asked, by running it.
29. Be able to run what you change, and look inside it with the debugging tools a person would use.
30. Verify a user interface two ways: Bombadil explores it against written properties, and for a new or changed screen an agent uses it and reports what it saw.
31. A violation Bombadil finds is a finding. Fix the interface, not the property.
32. For formal verification, write a TLA+ specification. Start by agreeing the invariants with the user: the things that must always be true. Model nothing until they are agreed.
33. A violation the model checker finds is a flaw in the design. Fix the design, not the invariant.
34. Verification must earn its cost. Before adding a check, name the failure it would catch; if you cannot, or something cheaper already catches it, do not add it. A TLA+ specification is for logic where a mistake is expensive, one per feature and never one per task.
35. Put invariants where they are cheapest to hold: in types, in database constraints, and as assertions in the code.
36. Hand over evidence a reviewer can look at: screenshots, recordings, a diagram of the feature's states, and the results of the checks.

**Prose**
37. One correction is not a law. Apply it where it was meant; if it is truly general, make it a check.

**Reporting**
38. Say what you ran and what you did not. State an unverified claim as unverified.
39. If you find a problem outside your task, report it. Do not silently work around it.

The reasoning and worked examples for each rule are in [`practices/`](practices/).
