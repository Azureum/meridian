# Rules for agents

When Meridian is in a repository, it is the guide for agents working there. The repository's own `AGENTS.md` adds what is specific to that project and never repeats these rules.

If the repository has no `CODEBASE.md` yet, it has not been set up: do [`SETUP.md`](SETUP.md) first.

## Workflow, then five layers

Workflow sits on top: it is how agents are put to work. The user's text is understood and confirmed, written as a job, checked by a preflight, done by a swarm, merged, reported to the user, and watched. See [`practices/0-workflow.md`](practices/0-workflow.md).

Underneath it, good behaviour comes from five layers. The earlier a layer is in this list, the more of the work it must carry.

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
10. Do not write comments. They go stale, they cannot be enforced, and they give a shortcut somewhere to hide. Say it with a name, a type or a check.
11. The rare exception is a fact from outside the code that no name, type or check can carry, in one line with no dates, people, quotes or stories.
12. Delete the comments you find in the code you touch.
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
30. Verify a user interface two ways: Bombadil explores it against written properties, and an agent uses it like a real user and reports what it saw.
31. A violation Bombadil finds is a finding. Fix the interface, not the property.
32. For formal verification, write a TLA+ specification of the major flows, and prove an algorithm that must be exactly right in a proof assistant such as Lean. Start by agreeing the invariants with the user: the things that must always be true. Model nothing until they are agreed.
33. A violation the model checker finds is a flaw in the design. Fix the design, not the invariant.
34. Spend most of your effort on verification. Layer the techniques; none of them is a complete answer on its own.
35. Put each invariant everywhere that can hold it: in types, in database constraints, as assertions in the code, and as properties in Bombadil and the model.
36. Hand over evidence a reviewer can look at: screenshots, recordings, a diagram of the feature's states, and the results of the checks.

**Prose**
37. One correction is not a law. Apply it where it was meant; if it is truly general, make it a check.

**Review**
38. The owner reviews by reading your account, not the code. With every change, write it so they understand what you did: what you did, what you tried that worked, what you tried that did not, what you did not like, and what is not verified.
39. Say what you ran and what you did not. State an unverified claim as unverified.
40. If you find a problem outside your task, report it. Do not silently work around it.

**Workflow**
41. Before starting, work out what the user said and what they actually want. Say it back with how urgent you take it to be and every open question you have, in one batch. Start from what they confirm, not from a guess.
42. Work from a written job: done as commands that must pass, the files you may touch, and what is out of scope. New ideas go on the follow-up list, not into this run.
43. No run starts until the preflight script passes. It reports every gap to the user once, as one list.
44. Decide alone anything that can be undone, and note it. Escalate only what the job's escalate list names, such as deleting data, spending money and public actions.
45. Split work that has no dependencies across agents, attach the right agent to each chunk, and give each a complete brief. Keep dependent steps in one agent.
46. Write progress and blockers to the run's checkpoint file at set points, so a stuck run is seen and a stopped one can resume.
47. Work is finished when it has been through every layer, merged, and watched, not when the code is written.
48. If the repository merges on its own, merge only work that is clean, verified and has its account written. If it waits for approval, wait.
49. At the merge, tell the user and give them the account of the work.
50. After the merge, watch. Revert the change if the checks fail on the main branch, the release breaks, errors appear where users are, or you use the product and find it broken. Tell the user at once when you revert.
51. Record working time, waiting time and retries for each run. Where the time went on waiting, add a preflight check, an escalate rule or an up-front question.

The reasoning and worked examples for each rule are in [`practices/`](practices/).
