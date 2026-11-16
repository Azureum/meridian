# 3. Verification

Static checks show the change is well formed. Verification shows it does what was asked. They are different claims, and only the second is the task.

## Prove it where it runs

- A change to something a user sees is verified by looking at it: load the page, take the screenshot, read the response.
- A change to a calculation is verified on real inputs as well as fixtures. Fixtures show the code agrees with itself.
- A change that only acts on failure is verified by causing the failure.
- A new test is verified by watching it fail on the old code.

## Evidence travels with the change

The pull request states, in plain words:

- what was run, and the result
- what was not run, and why
- what was checked by hand, and what it showed
- what is still unknown

"Tests pass" is not evidence. Which tests, where, and whether they cover the change is.

## Be exact about what you know

Three states are easy to blur and must stay apart:

- **Verified:** you ran it and saw the result.
- **Inferred:** the code reads as though it works.
- **Reported:** another agent or tool said so.

Write the one that is true. A report from another agent is a claim to check, and its confident tone is not evidence.

## When you were wrong

If something you stated turns out false, correct it where you stated it and say so directly. A later reader trusts a record that contains its own corrections more than one that contains none.

## Higher stakes, more proof

Changes to money, to stored data and to anything that cannot be undone need more than a green suite:

- Replay the change against real history and compare the results before and after.
- Show that nothing changes when everything is healthy, if that is the intent.
- State how to undo it.
