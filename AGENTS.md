# Meridian

When Meridian is in a repository, it is the guide for agents working there.

If the repository has no `SYSTEM.md` yet, it has not been set up: do [`SETUP.md`](SETUP.md) first.

## Read first

1. The repository's `SYSTEM.md`: what the system is and what matters most in it. Everything below is weighed against it.
2. The repository's `CODEBASE.md`: where things are and what each API route does.
3. The file in `features/` for the feature you are changing.

Then open only the files your job needs. Use the map to go straight to them. Everything you read stays in your context and crowds out the work, so do not read around, and do not open a practice page or playbook until you are at the step it covers.

## The model

Workflow sits on top: how what the user types becomes finished work. Under it, five layers keep that work trustworthy. The earlier a layer is in this list, the more it must carry.

1. **Codebase.** Code shaped so the wrong change is hard to write.
2. **Static analysis.** Checks that run by machine on every change.
3. **Verification.** Proof that the change behaves as intended.
4. **Prose.** Written rules.
5. **Human review.** The owner reading your account of the work.

The next agent has no memory of what was intended. It treats whatever is in the files as correct and repeats it. Leave only what is true, current and worth copying.

## The rules

These are the ones that need judgment. Everything a machine can check is a check, listed further down.

1. **Know the system.** When a change trades something higher on the system's list for something lower, it is wrong here, however good it looks alone.
2. **Understand the request before starting.** Say back what the user wants, how urgent you take it to be, and every open question, in one batch. Start from what they confirm, not from a guess.
3. **Fix the cause.** If you can only patch the symptom, stop and say so.
4. **Replace, never stack.** Delete the old path in the change that makes the new one live.
5. **One source of truth.** A value, list or rule lives in one place.
6. **Fail closed.** A failed read is a failure, never "nothing there".
7. **Fix it at the highest layer that can hold the fix.** A correction you are given becomes code shape or a check, not a sentence.
8. **Never weaken a check to pass it.** Decide which side is wrong and fix that side.
9. **Passing checks is not the task.** Show that the change does what was asked, by running it.
10. **Decide alone what can be undone.** Escalate only what the job's escalate list names.
11. **Clean up after yourself.** Before you call work done, remove everything you made that the finished change does not need: dropped attempts, debugging output, scratch files, test data, running processes. When the run is over, remove its branches and working copies too.
12. **Say what is true.** What you ran, what you did not, what is unverified, and anything wrong you found outside your task.

## The checks

Run them before you call anything done. They hold the rules that do not need judgment.

```bash
node checks/all.mjs <repository>
```

| It fails when | Which keeps |
| --- | --- |
| `SYSTEM.md` is missing or has an unwritten section | The system understood before work starts |
| `CODEBASE.md` names a path that is gone, or misses a file it covers | The map true |
| A feature has no file, is missing from the feature map, or has an unwritten section | A file per feature, stating what is true now |
| A count from the scanner rose: comments, dates or history in comments, swallowed errors, forced styles, checks that cannot fail, tests that read source text, long files, old versions kept by name | The codebase from getting worse |

Before a run starts, `node checks/preflight.mjs <repository>` must pass. Before work is called done, `node checks/clean.mjs <repository>` must pass: nothing is left uncommitted or untracked. A written job or account is checked with `node checks/shape.mjs <file> <template>`.

## Read when you need it

| When you are | Read |
| --- | --- |
| Asked for something | [`playbooks/start-work.md`](playbooks/start-work.md) |
| Splitting work across agents | [`playbooks/swarm.md`](playbooks/swarm.md) |
| Done, and about to merge | [`playbooks/merge-and-watch.md`](playbooks/merge-and-watch.md) |
| Writing or changing code | [`practices/1-codebase.md`](practices/1-codebase.md) |
| Working with types, lints, tests or CI | [`practices/2-static-analysis.md`](practices/2-static-analysis.md) |
| Proving a change works | [`practices/3-verification.md`](practices/3-verification.md) |
| About to write a rule or a document | [`practices/4-prose.md`](practices/4-prose.md) |
| Handing work to the owner | [`practices/5-human-review.md`](practices/5-human-review.md) |
| Making CI faster | [`playbooks/fast-ci.md`](playbooks/fast-ci.md) |
