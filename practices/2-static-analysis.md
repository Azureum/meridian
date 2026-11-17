# 2. Static analysis

Static analysis is everything a machine checks about the code: the compiler, the build, the linter, the type checker, the tests, and the CI that runs them all. It is the second layer because it catches what the codebase did not prevent, and it holds for every agent whether or not that agent read a single rule.

An agent works in a loop: change, check, fix. The faster and more exact the check, the more the agent corrects itself before anyone sees the work. A compiler error that names the line is fixed in the same minute. A rule in a document is followed only by the agents that happened to read it.

## The loop

After every change, in this order:

1. **Compile.** The code is valid.
2. **Build.** The whole project still assembles.
3. **Lint.** No banned pattern was introduced.
4. **Type-check.** Every value is used as what it is.
5. **Test.** The behaviour is still right.

The work is not done until all five are clean. Do not hand over a change with a warning you did not read, and do not move on to the next change while the last one is red.

Run the fast ones constantly and the slow ones before you finish. If a project has no way to run one of them, that is a gap to report, not a step to skip.

## Types

### Keep them true

A type checker is only worth having if a type error always means a real mistake. Every escape hatch weakens that.

- Do not switch the checker off for a line, a file or a value to get past an error. Fix what the error is telling you.
- Do not use a catch-all type where the real type is known.
- Do not assert that a value is something without checking that it is.
- If an escape hatch is truly needed at a boundary with untyped code, keep it at that boundary and convert to a real type straight away.

### Use them to say what things mean

A type can do more than name a kind of data. It can carry the meaning of the value, so that code which is wrong in its logic does not compile.

| Weak | Expressive | What the compiler now catches |
| --- | --- | --- |
| A user id and an order id are both plain text | Each is its own type | Passing one where the other belongs |
| Three true/false flags: loading, ready, failed | One type with exactly those three cases | A state that is both ready and failed |
| A value that may be absent, typed as if always present | The type says it may be absent | Using it without handling the absent case |
| An amount as a bare number | A type that carries its unit or currency | Adding cents to dollars |
| A function that accepts any text for a status | A type listing the allowed statuses | A misspelled or unknown status |
| Data from outside used as it arrived | Parsed once into a checked type at the edge | Trusting input that was never validated |

The aim is that an invalid state cannot be written down. Knowledge that lives in a type is met by every agent at the moment it matters, and never goes stale, because the code will not compile if it does.

When you find yourself writing a comment that says "this must always be X" or "never pass Y here", try to say it in the type instead.

## Lints

A lint is how a rule becomes a machine's rule. When you are about to write a sentence telling agents not to do something, first ask whether a lint can refuse it.

- Turn on the linter's rules for real mistakes: unused values, unhandled errors, unreachable code, unsafe comparisons.
- Every time an agent is corrected, turn the correction into a lint rule or another check. A correction that stays in conversation, or goes into a guide, has to be given again.
- Write the rule's message for the agent that will read it: say what is wrong and how to fix the root cause. A message that only says "not allowed" invites a workaround.
- Add a project rule for a mistake that has happened more than once.
- Do not silence a lint for a line to get past it. If the rule is wrong for this project, change the rule in the configuration, where the decision is visible.
- Formatting is the formatter's job. Do not spend review or rules on it.

## Tests

- **Assert behaviour.** Call the code and check what it does. A test that reads a source file and matches a pattern in it pins the spelling of the implementation: it breaks on harmless edits and passes on broken behaviour.
- **Do not copy the answer.** A test that repeats a constant from the code proves only that the two copies match.
- **A pinned number says what a change would mean.** A test that expects an exact count, size or version fails on every intended change, and the habit of raising it by one is the habit of not reading it. Derive the number from its source, or state beside it what a rise would tell the reader, so that raising it is a decision.
- **Every test file runs.** Tests are found by rule, not by a hand-kept list.
- **A test that did not run has not passed.** A skip is reported as a skip, and fails the run where it was supposed to run.
- **Fast enough to run before finishing.** Make tests independent so they can run side by side.
- **A test gives the same answer every time.** A test that sometimes fails teaches agents to run it again instead of fixing the code. Find the cause. Do not skip it, add a wait or retry it. If the cause cannot be found, delete the test and record why in the commit, because a test nobody believes protects nothing.
- **Name tests for the feature,** not for the session or fix that added them.

## CI

CI runs the whole loop on every change, on a clean machine, so that nothing depends on an agent remembering or on how one computer is set up.

- Every step of the loop is in CI: compile, build, lint, type-check, test.
- CI runs on every change before it is merged, and again on the main branch.
- A step must be able to fail. A step that ends in an unconditional success, or whose trigger can never fire, is not a check.
- What the release would refuse is checked before the merge. The settings a host validates, the size and count limits it enforces and the files it expects are read by a check that runs with the tests. A fault that first shows when the main branch is released has passed every layer.
- The main branch stays green. A red main branch hides every new failure behind the old ones, so fixing it comes before other work.
- CI is fast enough to wait for. When it is slow, agents stop waiting and merge on hope.

Speed never outranks honesty. The full suite runs before anything reaches the main branch, and CI is never made faster by retrying, widening a timeout or skipping a test.

To speed a repository's CI up, an agent follows [`playbooks/fast-ci.md`](../playbooks/fast-ci.md): measure where the time goes, fix the biggest part first, and hold each part to a budget that fails the job when it is exceeded.

## A change cannot judge itself

A check is only worth something if the change it judges cannot alter it.

- The rules a change is held to are read from the main branch, never from the change. That covers review instructions, gate settings, the scanner's baseline and the list of what CI runs.
- A change that edits a check, a baseline or a gate says so in the first line of its account, and the edit is reviewed as its own purpose.
- A pass belongs to the commit it ran on. After another commit is added, the earlier pass says nothing, and the checks run again.

## Never weaken a check to pass

When a check fails after your change, one of three things is true: your change is wrong, the check is out of date because behaviour changed on purpose, or the check was always wrong. Decide which, fix that side, and say which in the commit message.

Loosening a pattern, adding an entry to an allow-list, raising a timeout, silencing a lint and widening a type are all the same move: making the signal go away.

## Three attempts, then a person

Nobody reads every change, so a failing check is how a change earns a person's attention. An agent fixes what a check reports and runs it again. When the same check still fails after three attempts, the agent stops and brings in the owner, with what it tried each time. A fourth and fifth attempt are where a check gets weakened to make it pass.

## Checks are checked too

A check is code, and it can be wrong in both directions: it can miss what it exists to catch, and it can stop work that was fine.

- **Watch before blocking.** A new gate first runs without blocking and records what it would have blocked. Read that record for work it would have stopped wrongly, fix the gate, and only then let it block.
- **Measure against what really went wrong.** Keep the changes that were reverted or that caused an incident. A check meant to catch that kind of fault is run against them, and against a matching set of changes that stayed clean, so that it is graded on real faults and on how often it cries wolf.
- **A miss becomes a rule.** When a fault got past every check, and it could have been seen in the change, add the check that would have caught it and show that it does.
- **Prune.** Checks, tests, rules and documents only grow unless someone removes them. Regularly delete the ones that no longer catch anything, and say in the commit what each one was for.

## Meridian's own checks

- [`checks/scan.mjs`](../checks/scan.mjs) counts patterns that the first two layers forbid. With `--ratchet`, the counts may fall and may not rise, which lets an existing codebase adopt these rules without a rewrite.
- [`checks/map.mjs`](../checks/map.mjs) keeps `CODEBASE.md` true.
