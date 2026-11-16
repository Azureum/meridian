# Playbook: merging, and after

Use this when the work is done: verified, and with its account written.

## 0. Clean up what you made

Work leaves things behind, and what is left behind is read by the next agent as part of the codebase. Before the work is called done, remove everything you produced that the finished change does not need.

In the code:

- code from approaches you tried and dropped
- debugging output, and code switched off or parked "for later"
- files, functions, settings and dependencies you added and no longer use
- tests and fixtures written for an approach that did not survive

Around the code:

- scratch files, scripts and notes made while working
- output, logs, screenshots and downloads that are not evidence for the account
- test data you created in a database or an outside service
- servers, watchers and other processes you started

Then run the check. It fails while anything is left uncommitted or untracked:

```bash
node checks/clean.mjs <repository>
```

If the work made a mess you cannot fully undo, say so in the account under "What is not verified". Do not leave it for someone to find.

## 1. Merge

A repository either merges finished work on its own or waits for a person to approve each merge. The choice was recorded at first-time setup, in the repository's own `AGENTS.md`.

- **It merges on its own:** merge only work that has been through every layer. The loop is clean, the change is verified, and the account is written. Merging on your own is not permission to skip a layer.
- **It waits for approval:** hand over the account and wait.

In a system that puts accuracy or audit first, `SYSTEM.md` may name changes that always wait for a person. Follow it.

## 2. Tell the user

At the merge, tell the user that the change has merged and give them the account from [`templates/pull-request.md`](../templates/pull-request.md): what you did, what you tried that worked, what you tried that did not, what you did not like, and what is not verified, with the evidence. [`checks/shape.mjs`](../checks/shape.mjs) fails an account with a section left unwritten.

The user is informed, not asked. The account is how they understand what happened.

## 3. Watch

The work is not finished at the merge. Stay with the change and observe what it does.

Revert it when any of these happens, or anything `SYSTEM.md` lists as "not fine" for this system:

- the checks fail on the main branch
- the release breaks
- errors appear where users are
- you use the product afterwards and find it broken

When you revert, tell the user at once: what you saw, that the change is undone, and what you will do next. The fix then comes as a new change through the same path.

When none of those happens, the change stays.

## 4. Clear away after the work

When the change has stayed, or has been reverted and reported, remove what the run itself needed:

- the branch and any working copy made for it
- the run's checkpoint file
- every agent you started that is still running
- anything a reverted change left behind, in the code or in stored data

Nothing of a finished run should be left for the next one to trip over.

## 5. Price the delay

For the run, record how long was spent working, how long was spent waiting, and how many calls were retried.

If most of the time went on waiting for approvals or on failed tool calls, the work was not the problem. The staging was. Each of those waits names something to add to the preflight, to the escalate list or to the questions asked up front, so that the next run does not wait for it.
