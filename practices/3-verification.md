# 3. Verification

Static checks show the change is well formed. Verification shows it does what was asked. They are different claims, and only the second is the task. Code can compile, lint clean, type-check and pass its tests, and still not do what was wanted.

Verification also shows whether the agent understood the goal. A change that passes every check and misses the intent is caught here or not at all.

## Spend on verification

Most of an agent's effort belongs here. On a healthy project, well over half of the tokens go to verifying work, not to writing it.

None of the techniques below is new. They are ordinary good engineering that used to be too expensive to write, understand and maintain, so teams did little of it. Agents cut that cost sharply. Test and verify far more than used to be affordable.

Layer the techniques. No single one is a complete answer, and each catches what the others miss:

- types, lints, database constraints and assertions, which hold all the time at almost no cost
- tests of behaviour, of whole user flows first
- property tests, and old against new for a rewrite
- the agent running the application and looking inside it
- Bombadil exploring the interface
- agents using the product like real users, and fuzzing each release
- a TLA+ model of the major flows
- a proof, in a tool such as Lean, of an algorithm that must be exactly right

## Two kinds

**Formal** verification proves a property for every possible case, by reasoning about a model of the design or about the code itself. The application does not need to run.

**Empirical** verification runs the thing and observes what happens. It covers the cases that were tried, so its strength depends on how many and how varied those cases are.

## Invariants, everywhere

An invariant is something that must be true in every state, whatever has happened before. Agree them first, then put each one in every place that can hold it:

- in the feature's file, in plain words, under "What must always be true"
- in types, so the wrong state cannot be written down
- **in the database:** uniqueness, required fields, allowed values and links between records, declared in the schema so that the database itself refuses a bad state
- **as assertions in the code,** so that a violation stops the program when it happens and does not corrupt data quietly
- as properties for Bombadil and as invariants in the TLA+ model

## Formal: a TLA+ specification, invariants first

For the major flows of a product, and for any logic where several things happen at once, an agent writes a specification in TLA+ and has a model checker examine every state the design can reach.

### Start with the invariants

The agent raises the invariants with the user first, in plain words, before any modelling detail:

- A balance is never below zero.
- An order is never paid twice.
- Two workers never hold the same job.
- The amount paid out never exceeds the amount received.

This conversation is the most valuable part. Asking "what must always be true here?" surfaces disagreements and forgotten cases before a line of code exists. Do not start writing the model until the invariants are agreed.

### Then the specification

1. Describe the state: the few variables that matter.
2. Describe how it starts.
3. Describe each action that can change it, including the ones that happen at the same time or fail halfway.
4. Write each agreed invariant into the specification.
5. Run the model checker. It tries every ordering of the actions and reports any state that breaks an invariant, with the shortest sequence of steps that leads there.

A violation is a flaw in the design. Fix the design and run it again. Do not weaken the invariant to make the checker pass, unless the invariant itself was wrong, and then agree the new one with the user.

### What it does and does not prove

- It proves the design, not the code. The code must then be written to match the specification, and changed together with it.
- It covers the model at the size it was checked, for example three users and two orders. State those sizes when reporting the result.
- Where a specification exists, check the running system against it: record what the system did and check that sequence against the model.
- Keep the specification in the repository beside the feature's file.

### Proving an algorithm

Where one algorithm must be exactly right, such as a layout calculation or anything whose small errors show up as visible faults, prove its properties in a proof assistant such as Lean. This proves the algorithm itself, which model checking does not.

## The agent can run it

An agent must be able to run what it changes: start the application, drive it, and look inside it with the debugging tools a person would use. An agent that can only read code is guessing.

- Give agents a way to start the application and reach any part of it without a person's help.
- Give them the debugger, the network and console views and the performance tools, not only screenshots.
- Use the feature map's names when saying where to look.
- Put the commands that drive the application into small command-line tools kept with the project's skills. An agent then reuses one tested tool, and does not spend tokens working out the same steps again in every session.
- Give those tools one entry point, a skill named `verify`, that starts the application and exercises a change the way this project needs. Every agent runs it before committing. It is the project's smoke test, so it is improved and tested like any other code.

A test of a whole flow, driven through the running application, is worth more than a test of one function. It is hard to satisfy by accident, and when it fails it shows the step, the screen and the error, where a unit test often shows only that something timed out. Write the flows from the feature map: each feature's file already lists what a user does and what should happen.

## User interfaces

A user interface is verified two ways. Use both.

### An agent uses it

Send an agent to use the interface the way a person would: open it, do the task, and report what it saw. This catches what only a reader notices, such as a layout that is broken, wording that misleads, or a flow that works and makes no sense.

The agent reports what it did and what happened, with a screenshot or recording of anything it calls wrong. It states plainly what it did not try.

On each release, have agents fuzz the whole build this way: use everything, report every fault, and open a fix for each.

### Bombadil explores it

[Bombadil](https://github.com/antithesishq/bombadil) is a property-based testing tool for user interfaces. It drives a real browser on its own, clicking, typing and navigating without a scripted path, and checks written properties after every step. This is empirical verification: a clean run means no violation was found in what it explored, not that the interface is proven correct.

What makes it stronger than a scripted test is that nobody has to think of the path. It finds the sequences no one would have written a test for.

**Properties.** A property is a statement that must hold whatever path is taken. Good ones come from the feature's own file: its "What must always be true" and "How it behaves" sections are lists of properties waiting to be written. Typical shapes:

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

## Properties in code

The same idea works without an interface. State something that must hold for every input, and let a library generate thousands of inputs that try to break it: fast-check for JavaScript and TypeScript, Hypothesis for Python, proptest for Rust. The agent did not choose the cases, so they do not share its blind spots.

Shapes that come up again and again:

- **There and back:** encoding a value and decoding it returns the value.
- **Invariant:** a balance is never below zero, whatever sequence of actions ran.
- **Twice is once:** doing the action a second time changes nothing.
- **Same as the simple version:** the fast code gives the answer the slow, obviously correct code gives.

## Old against new

For a rewrite or a migration, where behaviour is meant to stay the same, run the old code and the new code on the same inputs and compare every result.

- Use generated inputs, and real ones where they exist: recorded requests, stored rows, past months.
- Remove differences that do not matter, such as spacing and ordering that was never promised, before comparing.
- Every remaining difference is either a fault or an intended change. Keep the list of intended ones in the change, each with its reason, so the comparison can run clean again.

This is the strongest check a rewrite can have when the written description of the old behaviour has drifted from what the old code does.

## A checklist from what went wrong

Some faults cannot be made into a type, a lint or a test, and come back anyway. Keep those as a checklist in the repository. Each item has three parts:

- **a trigger** that can be read from the change itself, such as "the stored format of a session changed"
- **the question to answer,** such as "does a record written before this change still load?"
- **where it came from:** the incident or the reverted change that taught it

Before finishing, the agent reads its own change against the triggers and works through only the items that match, which is usually a handful. The account says which items matched and what each one showed.

An item earns its place by pointing at something that happened. When an item can become a check, make it one and delete the item.

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
