# 5. Human review

The owner's attention is the scarcest thing in the system. It is the last layer, and the work of every layer above is to leave it as little to catch as possible.

## The review is a reading

The owner reviews by reading an account of the work, not by reading the code. The aim is that they understand what the agent did. Every change a person will review comes with that account, written by the agent in plain language for someone who was not there.

It has these parts, in this order:

1. **What I did.** What is different now, from the user's point of view first and then in the system. A few sentences.
2. **What I tried that worked.** The approach that was kept, and why it was the right one.
3. **What I tried that did not work.** Each thing that was attempted and dropped, and what went wrong with it. This is where the owner sees the judgment that went into the change, and it stops the next agent trying the same dead end.
4. **What I did not like.** Anything about the codebase, the tools, the checks or the instructions that got in the way: something confusing, slow, misleading or missing. Say it even if you worked around it. Each one is a defect in a higher layer waiting to be fixed.
5. **What is not verified.** What was not run or could not be checked, and anything still unknown.

Write it so the owner could explain the change to someone else after one read. No file-by-file list, no restating the diff.

[`templates/pull-request.md`](../templates/pull-request.md) has this shape.

## The evidence

The account comes with what the owner can look at to see the change working:

- screenshots and recordings of the change in use
- a diagram of the states a feature can be in and how it moves between them, drawn from the user's point of view
- the result of the checks, the Bombadil run and any model checking

A diagram and a recording are faster to judge than a diff, and they show whether the agent understood the intent.

## When the code itself is read

Rarely. When the layers above are doing their work, most code does not need a line-by-line read. The account says so plainly when it does: point at the one or two places that deserve a careful look, and say why.

## What reaches the owner

- **Decisions that are theirs:** what the product does, what users are told, what is paid, what cannot be undone.
- **Things only they know:** intent, taste, agreements made outside the code.
- **Approval to merge and release,** unless they have said otherwise for a class of change.

A question about how to build something is rarely theirs. Decide, say what you decided in the account, and carry on.

## Keep each review small

- One purpose per change. The owner should be able to say what it does in a sentence.
- Keep unrelated clean-up in its own change.
- State what was left out on purpose.

## Do not hand over your own doubts unlabelled

If you are unsure about part of a change, say which part. A confident account over an uncertain change spends the owner's trust, and that is harder to rebuild than the code.

## Review by another agent

A second agent can review before the owner does. For the review to be worth anything:

- Give it the change, not your opinion of the change.
- Do not share your conclusions first; an agent handed a hypothesis tends to confirm it.
- Treat its findings as claims to verify, not as verdicts.

## After the merge

Merged is not done. Confirm the release happened and the thing works where users meet it, and report that separately from the merge.
