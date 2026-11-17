# Playbook: landing several changes together

Use this when more than one finished change is waiting to reach the main branch. Changes that each pass alone can fail together: two take the same number, two edit the same paragraph, two each fit under a limit that their sum breaks. Merging them one at a time finds this on the main branch. This playbook finds it first.

## 1. List what is waiting

List every open change again, at the moment you start. Others may have merged, moved or been opened since anyone last looked.

Sort each one:

- **Ready:** finished, with its own account, and nothing in that account says "not done".
- **Unfinished:** its own account lists what is missing. Finish it first, or leave it out and say so.
- **Superseded:** the main branch already holds what it does. Close it.

A change that waits for the owner waits on a question. If nobody can say what that question is, it is not waiting, it is abandoned: ask the owner, or close it.

## 2. Build the combination

Make one branch from a fresh main branch and merge every ready change into it, in order of dependence: a change that others build on goes in first.

- **Resolve each conflict once, here.** Keep both sides' behaviour. Where two changes edited the same sentence, the result must say what both meant.
- **Shared counters are settled here.** Version numbers, sequence numbers and cache stamps that two changes both took get their final values on the combined branch, and every place that pins one is updated in the same step.
- **A change that only removes or reformats goes in last.** Where it overlaps another change, the other change's code stands.
- **The original commits stay in the history,** so that each change is recorded as merged when the combination is.

## 3. Verify the combination, not the parts

A pass on a part says nothing about the whole. Run every layer on the combined branch, once:

- the full loop of [static analysis](../practices/2-static-analysis.md), including the checks that count things, because the counts add up
- the [verification](../practices/3-verification.md) each change needed, again, on the combination
- whatever would only fail at release

A failure here belongs to the combination. Fix it on the combined branch and run again.

## 4. Merge once

Check the main branch and the list of open changes one more time. If either moved, bring it in and run the checks again. Then merge the combined branch as one merge, and follow [`merge-and-watch.md`](merge-and-watch.md) from "Tell the user": one account that names every change it holds, what was changed to make them fit, and what is not verified.

A revert then undoes the whole combination. Say so in the account, and prefer a fix that goes forward when only one part is at fault and the fault is small.

## 5. Keep the wait short

Changes that wait drift. Every day on a branch adds conflicts with the main branch and with each other. Keep one list of the changes that are waiting and the question each waits on, and put that list in front of the owner whenever it grows. When the same kind of change keeps waiting on the same question, that question belongs in the repository's escalate list or its `SYSTEM.md`, answered once.
