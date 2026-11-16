# 1. Codebase

The codebase is the widest layer because it is the one thing every agent reads. An agent arrives with no history, loads some files, and infers from them what is normal. A clean file teaches good habits without a word of instruction. A file full of patches teaches patching.

## Band-aids

A band-aid is a small local change that makes a symptom go away while the cause stays. It works today and costs every later reader, because the patch now looks like the intended design.

| Band-aid | What the next agent concludes | The fix |
| --- | --- | --- |
| A special case keyed on a name, id or date | "Special cases are how this is handled" | Find the general rule the case is an instance of |
| A clamp, floor or fallback added to stop one bad number | "This value is unreliable, clamp it" | Fix where the bad number comes from |
| An empty `catch`, or a failed read treated as an empty result | "Errors here are safe to ignore" | Let it fail, or record the failure where it will be seen |
| A retry, sleep or longer timeout to dodge a failure | "This is flaky by nature" | Find why it fails |
| A constant-false flag guarding old code | "This switch works; the old path is supported" | Delete the flag and the path |
| A field reused to hold a second meaning | "This field means what its name says" | Add a field |
| The same list or constant copied into two files | "Edit the copy in front of me" | One source, imported or generated |
| An override appended after the rule it overrides | "Add another override at the end" | Change the original rule |
| A wrapper that restyles or rewrites output at run time | "The source does not need to be right" | Make the source right |
| A comment that says "do not touch" or "keep in step with X" | "This is fragile, work around it" | Remove the reason the comment exists |

When you meet a band-aid in code you are changing, you have three honest options: remove it, leave it and report it, or extend it and say plainly that you extended a patch. Extending it quietly is the one option that is not allowed.

## Replace, never stack

New work goes in the place of old work. The pattern to avoid is a new model, stylesheet or handler added beside the old one, with the old one kept "just in case". After three rounds there are four implementations, one of them live, and no reader can tell which.

- Delete the old path in the change that makes the new one live.
- If the new path must be proven first, run it as an experiment outside the main code, or behind one switch with a written removal condition.
- Git is the way back. A flag is not.

## One source of truth

If two places must agree, one of them should be produced from the other.

- A value used by server and browser lives in one module both can load, or is sent by the server.
- A list of routes, actions, settings or pages is built from the code that defines them.
- A generated file is never edited by hand, and a check fails when it is out of date.

## Fail closed

When something a result depends on cannot be read, the result is "unknown". It is never zero, never empty and never the previous answer.

- Do not write `.catch(() => [])` around a read whose absence changes an outcome.
- Do not fall back to another calculation without saying so in the result itself.
- A limit that cuts off a read is a failed read.

## Names and shape

- A name describes the role today. `shadow`, `new`, `temp`, `today`, `v3` and `fix` describe a moment in history and go stale.
- A folder named `vendor` holds third-party code only.
- A table or field named for one use holds only that use.
- Keep a file to what one reader would look for in one sitting. A file that needs a table of contents is several files.

## Comments

Code says what is true now. History belongs to version control.

Write a comment when the code cannot carry the reason: a constraint from outside, an invariant another part relies on, a choice that looks wrong and is right. Keep it to the reason.

Do not write:
- dates, people, quotes, ticket or pull request numbers
- what the code used to do, or what was tried before
- the story of the bug that led to this line
- a description of what the next line plainly does
- instructions to future agents

A file header states what the file is for, in a few lines. If it lists the file's contents, the list is either generated or wrong.

## Finding things

Context is spent on reading. A codebase that is cheap to navigate leaves more of it for thinking.

- Name files and folders for what a reader searches for.
- Keep one area in one folder.

### The codebase file

A repository that uses Meridian has a `CODEBASE.md` at its root. An agent reads it before anything else, so that it opens the three files its task needs and not thirty. It holds:

- **Where things are:** one line per top-level folder.
- **Where each area starts:** the one or two files to open first for each part of the product.
- **What the API does:** one line per route, job or command, saying how it is reached and what it does for the caller.

Keep each entry to a line. The file is a map, and the detail lives in the code it points to.

It stays true because a check enforces it, not because people remember. [`checks/map.mjs`](../checks/map.mjs) fails when a path named in the file does not exist, and when a file in a folder the file claims to cover is not listed. A line such as `<!-- covers: api/*.js -->` makes that claim. Adding a route without adding its line turns the check red.

[`templates/CODEBASE.md`](../templates/CODEBASE.md) is a starting point.

### A file per feature

Each feature has its own file in `features/`. It says what the feature is, what it is for, and how it is meant to behave, so that an agent can judge a change against the intent and not only against the code in front of it.

It states what is true now. It does not record what was tried, what broke or how the feature got here; an agent that reads those takes them for the current design. [`templates/feature.md`](../templates/feature.md) is a starting point.
