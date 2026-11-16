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
2. **Prompt.** The agent says back what it understands the user wants and how urgent it is, and the user confirms or corrects. The confirmed version is the prompt.
3. **Work done.** The agent decides what to do, breaks it into chunks that can run at the same time, attaches the right agent to each and runs them as a swarm. The work goes through the layers below: in a clean codebase, with every check clean, and verified.
4. **Merge.**
5. **Tell the user.** At the merge, the agent tells the user and gives them the account of the work.
6. **Watch.** The agent stays with the change and observes what happens.
7. **Stay or revert.** If everything is fine, the change stays. If it is not, the agent reverts it.

## From text to prompt

What a person types is rarely the whole of what they want. It is short, it leaves things out, and it can be read more than one way. Before any work starts, the agent closes that gap with the user.

1. **Work out what was said and what is wanted.** Read the text for what it literally asks, then for what the person is trying to achieve. Where those differ, or where the text could mean two things, that difference is the thing to settle.
2. **Say it back.** Tell the user, in a few plain sentences, what you understand they want: the outcome, what is included, and what you are taking to be left out.
3. **Say how urgent you take it to be.** State the urgency you have read into the request, for example "this is blocking you now", "this should be done today" or "this can wait for the right fix". Urgency decides how much is done before anything is merged, so a wrong reading wastes the work either way.
4. **Let the user confirm or correct.** The confirmed version is the prompt. Work starts from that, not from the original text.

Do not fill a gap with a guess and start. A wrong guess costs the whole piece of work, and saying it back costs a few sentences.

Keep it short. This is a check of understanding, not a plan and not a list of questions. If the text was already clear, say it back in one line with the urgency and go on.

## From prompt to work

With the prompt confirmed, the agent that received it decides how the work gets done. It does not start typing code. It plans the work and hands it out.

1. **Decide what to do.** From the confirmed prompt and the codebase's own files (`CODEBASE.md`, the feature map and the feature files), work out everything the outcome needs.
2. **Break it into chunks that can run at the same time.** A chunk is a piece of the work that one agent can finish without waiting for another. Two chunks can run together when neither needs the other's result and they do not change the same files. Work that depends on an earlier piece waits for it; everything else runs in parallel.
3. **Attach the right agent to each chunk.** Match the agent to the job: a strong model for design, for clean-up across many files and for anything where a mistake is expensive; a lighter one for narrow, mechanical work; a separate one, with no view of the others' reasoning, for review and for verification.
4. **Build the swarm and brief it.** Start the agents together. Each one gets a brief that stands on its own: the outcome wanted, its own chunk and the files it owns, what done looks like, and the urgency. An agent knows only what its brief tells it.
5. **Bring the results together.** The agent that planned the work collects what the swarm produced, checks each piece against its brief, and puts them through the layers below as one change or several.

Every agent in the swarm follows Meridian. Splitting the work up does not let any piece skip a layer.

A small piece of work needs no swarm. If the work is one chunk, one agent does it.

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
