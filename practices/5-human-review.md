# 5. Human review

The owner's attention is the scarcest thing in the system. It is the last layer, and the work of every layer above is to leave it as little to catch as possible.

## What reaches the owner

- **Decisions that are theirs:** what the product does, what partners and players are told, what is paid, what cannot be undone.
- **Things only they know:** intent, taste, agreements made outside the code.
- **Approval to merge and release,** unless they have said otherwise for a class of change.

A question about how to build something is rarely theirs. Decide, say what you decided, and carry on.

## Make the review cheap

- One purpose per pull request. A reviewer should be able to say what it does in a sentence.
- Lead with what changes for a user or for the business, then how.
- State what is not in it and why.
- Point at the one or two places that deserve a careful read.
- Keep unrelated clean-up in its own change.

## Do not hand over your own doubts unlabelled

If you are unsure about part of a change, say which part. A confident summary over an uncertain change spends the owner's trust, and that is harder to rebuild than the code.

## Review by another agent

A second agent can review before the owner does. For the review to be worth anything:

- Give it the change, not your opinion of the change.
- Do not share your conclusions first; an agent handed a hypothesis tends to confirm it.
- Treat its findings as claims to verify, not as verdicts.

## After the merge

Merged is not done. Confirm the release happened and the thing works where users meet it, and report that separately from the merge.
