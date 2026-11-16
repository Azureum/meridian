# 2. Static analysis

Checks are the second layer because they hold without anyone remembering them. A rule in prose is followed by the agents that read it and understood it. A check is followed by all of them.

## Turn rules into checks

When you are about to write a rule, ask first whether the code can make the mistake impossible, then whether a check can catch it. Write the sentence only if both answers are no.

| Rule in prose | As a check | Better, in the code |
| --- | --- | --- |
| "Update the version stamp wherever the file is loaded" | Fail when a stamp does not match the file's hash | Stamp files automatically |
| "List every setting in the example file" | Fail when code reads a setting that is not listed | Read settings through one module and generate the list |
| "Keep these two tables alike" | Fail when they differ | One table |
| "Add new pages to the translation check" | Make the check find pages itself | Same |
| "Do not edit generated files" | Regenerate and fail on a difference | Same |

## Checks must be able to fail

A check that cannot fail is worse than no check, because it reports safety that is not there.

- A check that covers a hand-kept list of files misses every file not on the list. Checks discover what they cover.
- A step that ends in `|| true`, `continue-on-error` or an unconditional exit 0 is not a check.
- A job whose trigger can never fire is not a check.
- A test that prints "skipped" and exits 0 has not passed. Report it as skipped, and fail the run where the skipped thing was supposed to run.

## Tests

- **Assert behaviour.** Call the code and check what it does. A test that reads a source file and matches a pattern in it pins the spelling of the implementation. It breaks on harmless edits, passes on broken behaviour, and teaches agents to add magic strings.
- **Do not copy the answer.** A test that repeats a constant from the code proves only that the two copies match.
- **Every file runs.** Tests are found by rule, not by name in a list. A test file that no runner picks up is deleted or wired in.
- **Fast enough to run before pushing.** If the suite is too slow to run locally, agents will push to find out. Make tests independent so they can run side by side.
- **Name tests for the feature,** not for the session, fix or ticket that added them. Extend the existing file for a feature before adding a new one.
- **Test on what production runs.** A lock or a race proven on a different database engine is not proven.

## Never weaken a check to pass

If a check fails after your change, one of three things is true: your change is wrong, the check is out of date because behaviour changed on purpose, or the check was always wrong. Decide which, fix that side, and say which in the commit message.

Loosening a pattern, adding an entry to an allow-list, raising a timeout or wrapping a case in a soft failure are all the same move: making the signal go away. If you believe one of them is right, state the reason in the commit.

## The main branch stays green

A red main branch hides every new failure behind the old ones. Fixing it comes before other work, and nothing merges over failing checks without the owner deciding so.

## Use the scanner

[`checks/scan.mjs`](../checks/scan.mjs) counts the patterns this document and the previous one describe. Run it with `--ratchet` so that an existing codebase can adopt these rules without a rewrite: the counts may fall and may not rise.
