# 3. Verification

Static checks show the change is well formed. Verification shows it does what was asked. They are different claims, and only the second is the task. Code can compile, lint clean, type-check and pass its tests, and still not do what was wanted.

## Two kinds

**Formal** verification proves a property for every possible case, by reasoning about the code or a model of it. Nothing needs to run. It gives the strongest answer and costs the most, so it is kept for logic where one wrong case is serious.

**Empirical** verification runs the thing and observes what happens. It covers the cases that were tried, so its strength depends on how many and how varied those cases are.

## User interfaces

A user interface is verified two ways. Use both.

### An agent uses it

Send an agent to use the interface the way a person would: open it, do the task, and report what it saw. This catches what only a reader notices, such as a layout that is broken, wording that misleads, or a flow that works and makes no sense.

The agent reports what it did and what happened, with a screenshot of anything it calls wrong. It states plainly what it did not try.

### Bombadil explores it

[Bombadil](https://github.com/antithesishq/bombadil) is a property-based testing tool for user interfaces. It drives a real browser on its own, clicking, typing and navigating without a scripted path, and checks written properties after every step. This is empirical verification: a clean run means no violation was found in what it explored, not that the interface is proven correct.

What makes it stronger than a scripted test is that nobody has to think of the path. It finds the sequences no one would have written a test for.

**Properties.** A property is a statement that must hold whatever path is taken. Good ones come from the feature's own file: its "How it behaves" section is a list of properties waiting to be written. Typical shapes:

- **Always:** something is never allowed to happen. A count never goes below zero; no page shows a raw error.
- **Eventually:** something must come to pass. After saving, the saved value shows; an error message goes away.
- **State machine:** the interface moves only between allowed states. A form goes from editing to saving to saved, never from saved back to saving on its own.

**Using it.**

- The specification is a TypeScript or JavaScript module that exports properties and action generators. It is kept in the repository beside the tests.
- Bombadil ships default properties and action generators. Start with those, then add one property per rule in a feature's file.
- Install it as a development dependency and run it against a running copy of the application:
  ```bash
  npm install --save-dev @antithesishq/bombadil
  bombadil browser test <address> --time-limit=5m --output-path bombadil-output
  ```
- When it reports a violation, open the result to see the steps that led to it, reproduce it, and let Bombadil shrink it to the shortest path that still fails:
  ```bash
  bombadil browser inspect bombadil-output
  ```
- Run it in CI with a time limit, so every change is explored before it is merged.

Read [the Bombadil manual](https://antithesishq.github.io/bombadil/) for the specification language before writing properties. Do not guess its interface.

**A violation is a finding.** Fix the interface. Do not weaken the property, shorten the run or exclude the path to make it pass, unless the property itself was wrong, and then say so.

## Everything else

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
