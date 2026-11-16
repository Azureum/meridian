# Workflow

Workflow sits on top of the pyramid. The five layers below say what makes an agent's work trustworthy. Workflow is how agents are put to work on them: how what a person types becomes a prompt, and how the prompt becomes finished work.

## The path

```
the user's text
      ↓
understand it        say it back, with urgency and every open question
      ↓
  the job            done, scope, and who decides what, in writing
      ↓
  preflight          a script checks everything the job needs
      ↓
  the swarm          chunks in parallel, each with its own agent and brief
      ↓
    merge
      ↓
tell the user        with the account of the work
      ↓
    watch
      ↓
fine: it stays       not fine: revert it
```

Most of what slows an agent down is not the work. It is waiting: for an answer, for an approval, for a credential that turned out to be missing. Everything before the swarm exists to move that waiting to the front, where it happens once.

## 1. Understand the request

What a person types is rarely the whole of what they want. It is short, it leaves things out, and it can be read more than one way. Before any work starts, the agent closes that gap with the user, in one exchange.

1. **Work out what was said and what is wanted.** Read the text for what it literally asks, then for what the person is trying to achieve. Where those differ, or where the text could mean two things, that difference is the thing to settle.
2. **Say it back.** Tell the user, in a few plain sentences, what you understand they want: the outcome, what is included, and what you are taking to be left out.
3. **Say how urgent you take it to be.** For example "this is blocking you now", "this should be done today" or "this can wait for the right fix". Urgency decides how much is done before anything is merged.
4. **Ask every open question now.** Read the whole task and list everything you would otherwise have to stop and ask later. The user answers them in one batch. An agent that stops five times, each time waiting hours for a reply, has spent a day on five questions.
5. **Let the user confirm or correct.** The confirmed version is the prompt.

Do not fill a gap with a guess and start. If the text was already clear and there are no questions, say it back in one line with the urgency and go on.

## 2. Write the job

The confirmed prompt becomes a written job that the agent can test itself against. [`templates/job.md`](../templates/job.md) has its shape.

- **Done:** the commands that must pass and the things that must be observable. If done cannot be tested, it is not yet a definition.
- **Scope:** the files and areas the job may touch.
- **Out of scope:** what it must leave alone.
- **Follow-ups:** new ideas found along the way go on this list. They do not go into the current run. The scope is fixed once the job is written.

### Who decides what

The job says what the agent decides alone and what it must bring to a person.

- **Decides alone:** anything that can be undone, such as naming, structure and how to build it. The agent decides, notes the decision in its account, and carries on.
- **Must escalate:** a short written list, such as deleting data, spending money, and anything public.

Anything not on the escalate list, the agent decides. An agent that asks about what it could have decided is spending the user's time to protect itself.

## 3. Preflight

Before any agent runs, a script checks that everything the job needs is in place. It is a script, not an agent, because it has to be cheap and it has to give the same answer every time. The run does not start until it passes.

It checks that:

- **Credentials and tools work,** by making one real call to each.
- **The repository, data and documents are present** and readable.
- **The environment builds and the tests run.**
- **Budget, time limit and permissions are set.**

When something fails, it reports every gap to the user once, as a single list. The alternative is an agent discovering each gap twenty steps in, one at a time.

[`checks/preflight.mjs`](../checks/preflight.mjs) runs the checks a repository lists in `.meridian/preflight.json` and prints that single list.

## 4. The swarm

With the job written and the preflight passed, the agent that received the prompt plans the work and hands it out.

1. **Decide what to do.** From the job and the codebase's own files (`CODEBASE.md`, the feature map and the feature files), work out everything the outcome needs.
2. **Split what has no dependencies.** Work that does not depend on other work goes to separate agents and runs at the same time: research, tests, documents, independent parts of the change. Two chunks can run together when neither needs the other's result and they do not change the same files.
3. **Keep dependent steps in one agent.** Steps that build on each other stay together. Splitting them only adds handovers.
4. **Attach the right agent to each chunk.** A strong model for design, for clean-up across many files and for anything where a mistake is expensive; a lighter one for narrow, mechanical work; a separate one, with no view of the others' reasoning, for review and for verification.
5. **Give each agent a complete brief.** Every agent starts cold and knows only what its brief says: the outcome wanted, its own chunk and the files it owns, what done looks like, what it may decide, and the urgency.
6. **Bring the results together.** The planning agent collects what the swarm produced, checks each piece against its brief, and puts the work through the layers below.

Every agent in the swarm follows Meridian. Splitting the work up does not let any piece skip a layer. A small piece of work needs no swarm: if it is one chunk, one agent does it.

### Checkpoints

At set points, each agent writes its progress and anything blocking it to the run's checkpoint file. A stuck run is then seen in minutes, and a run that stops can resume from its last checkpoint and does not start again.

The checkpoint file belongs to the run, not to the codebase. It is not committed.

## 5. Merge

A repository either merges finished work on its own or waits for a person to approve each merge. The person using Meridian chooses, and the choice is recorded at first-time setup.

When the repository merges on its own, an agent merges only work that has been through every layer: the loop is clean, the change is verified, and the account is written. Merging on its own is not permission to skip a layer.

## 6. Tell the user

At the merge, the agent tells the user that the change has merged and gives them the account described in [human review](5-human-review.md): what it did, what it tried that worked, what it tried that did not, what it did not like, and what is not verified, with the evidence.

The user is informed, not asked. The account is how they understand what happened.

## 7. Watch, then stay or revert

The work is not finished at the merge. The agent watches what the change does, and reverts it when any of these happens:

- the checks fail on the main branch
- the release breaks
- errors appear where users are
- the agent uses the product afterwards and finds it broken

When the agent reverts, it tells the user at once: what it saw, that the change is undone, and what it will do next. The fix then comes as a new change through the same path.

When none of those happens, the change stays.

## Price the delay

For every run, record how long was spent working, how long was spent waiting, and how many calls were retried.

If most of the time went on waiting for approvals or on failed tool calls, the work was not the problem. The staging was. Each of those waits names something to add to the preflight, to the escalate list or to the questions asked up front, so that the next run does not wait for it.
