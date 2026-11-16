# 4. Prose

Prose is a narrow layer on purpose. It costs context every time it is loaded, it is followed only when it is read and understood, and it goes stale without any check noticing.

## When to write a rule

Write one only when all of these hold:

1. The code cannot be shaped to make the mistake impossible.
2. No check can catch the mistake.
3. An agent who has read the code would still get it wrong.

A rule that fails the first two tests is a note about a missing fix. Record it as work to do, and remove the rule when the fix lands.

## How to write one

- State what to do and the reason in a sentence each. A rule without its reason gets followed in the wrong cases and broken in the right ones.
- Describe the present. No history.
- Keep the whole file short enough to read in a minute or two. Every added rule makes each other rule less likely to be followed.
- Put a rule where it applies. What is true for all repositories lives here; what is true for one lives in that repository; what is true for one folder lives in that folder.

## What a repository's own guide holds

- What the project is, in a paragraph.
- Where each area starts, as a short table.
- How to run it and how to run the tests.
- The few facts a reader could not learn from the code.

It does not hold a list of traps. A trap is a defect in the codebase; list it as work to do and fix it. [`templates/AGENTS.md`](../templates/AGENTS.md) is a starting point.

## Documents

- A document describes what is true now. When the system changes, rewrite the paragraph. Do not add a note above it saying it is out of date.
- Delete a document that describes something that no longer exists.
- Research and decision records are history. Keep them apart from documents that describe the system, and mark them with their date.
- Do not claim completeness ("every setting is listed") unless a check enforces it.

## Maps

A map of the code is worth writing: it is the cheapest way for an agent to find what it needs. Every repository keeps one in `CODEBASE.md` (see [the codebase file](1-codebase.md#the-codebase-file)).

A map nobody checks is wrong within weeks, so the map is checked: the paths it names must exist, and the folders it covers must be fully listed. Write only what the check can hold you to, plus one plain line on what each thing is for.
