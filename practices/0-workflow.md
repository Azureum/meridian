# Workflow

Workflow sits on top of the pyramid. The five layers below say what makes an agent's work trustworthy. Workflow is how agents are put to work on them: how what a person types becomes a prompt, and how the prompt becomes finished work.

## The path

```
the user's text
      ↓
    prompt
      ↓
  work done          through the layers below
      ↓
    merge
      ↓
tell the user        with the account of the work
      ↓
    watch
      ↓
fine: it stays       not fine: revert it
```

1. **Text.** The user says what they want, in their own words.
2. **Prompt.** That text becomes a prompt an agent can act on.
3. **Work done.** The agent does the work through the layers below: in a clean codebase, with every check clean, and verified.
4. **Merge.**
5. **Tell the user.** At the merge, the agent tells the user and gives them the account of the work.
6. **Watch.** The agent stays with the change and observes what happens.
7. **Stay or revert.** If everything is fine, the change stays. If it is not, the agent reverts it.

## Merging

A repository either merges finished work on its own or waits for a person to approve each merge. The person using Meridian chooses, and the choice is recorded at first-time setup.

When the repository merges on its own, an agent merges only work that has been through every layer: the loop is clean, the change is verified, and the account is written. Merging on its own is not permission to skip a layer.

## At the merge

The agent tells the user that the change has merged and gives them the account described in [human review](5-human-review.md): what it did, what it tried that worked, what it tried that did not, what it did not like, and what is not verified, with the evidence.

The user is informed, not asked. The account is how they understand what happened.

## After the merge

The work is not finished at the merge. The agent watches what the change does, and reverts it when any of these happens:

- the checks fail on the main branch
- the release breaks
- errors appear where users are
- the agent uses the product afterwards and finds it broken

When the agent reverts, it tells the user at once: what it saw, that the change is undone, and what it will do next. The fix then comes as a new change through the same path.

When none of those happens, the change stays.
