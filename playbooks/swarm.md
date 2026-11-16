# Playbook: splitting work across agents

Use this when a job is more than one chunk. If it is one chunk, one agent does it and this playbook does not apply.

## Plan and hand out

1. **Decide what to do.** From the job and the codebase's own files (`SYSTEM.md`, `CODEBASE.md`, the feature map and the feature files), work out everything the outcome needs.
2. **Split what has no dependencies.** Work that does not depend on other work goes to separate agents and runs at the same time: research, tests, documents, independent parts of the change. Two chunks can run together when neither needs the other's result and they do not change the same files.
3. **Keep dependent steps in one agent.** Steps that build on each other stay together. Splitting them only adds handovers.
4. **Attach the right agent to each chunk.** See below. Review and verification go to a separate agent with no view of the others' reasoning.
5. **Give each agent a complete brief.** Every agent starts cold and knows only what its brief says: the outcome wanted, its own chunk and the files it owns, what done looks like, what it may decide, the urgency, and who owns the code. An agent that is not told the code is its own will add to it and will not clean it.
6. **Bring the results together.** Collect what the swarm produced, check each piece against its brief, and put the work through every layer.

Every agent in the swarm follows Meridian. Splitting the work up does not let any piece skip a layer.

## Choosing the agent for a chunk

Models come in tiers, from the most capable and most expensive down to the smallest and fastest. Match the tier to the chunk.

| Chunk | Tier |
| --- | --- |
| Leading the swarm, planning an architecture, a major refactor or migration, a long run nobody is watching | The most capable |
| Everyday engineering and debugging, and anything you are not yet sure about | The strong default |
| Well-scoped work against a clear job, and tasks that are run again and again | The mid tier |
| Searching files, reading logs, summarising, sorting and extracting at volume | The smallest |

A clear job does not by itself mean a smaller model. A migration can be fully specified and still be hard enough to need the strong one.

**Keep judgment on the strong model.** Give smaller models only work where a mistake is cheap to spot: finding files, running tests, reading logs. Keep code edits and judgment calls on the main model. When a small model misreads something, the main model acts on the wrong answer and pays for it.

**Keep the lead's context lean.** The most expensive agent holds the decisions. Cheaper agents do the long reading and hand back a summary.

**When an agent is not good enough for its chunk,** take these steps in order:

1. Make sure it can check its own work, with a test, a build or a script. This usually helps more than anything else and costs least.
2. Raise how hard it thinks, one level.
3. Move up a tier, starting at a lower level of effort than before.

**When outcomes can be checked automatically,** run every chunk cheaply first and run only the failures again on a stronger setting.

**A lead with many cheaper workers** suits work that is bigger than one agent can hold in its head at once. Do not use it for one chain of dependent steps, or for work that fits in one agent's context. There the planning and merging cost more than they save.

**Hand over at a natural break.** A new agent starts from a short written summary of the work so far, not from the whole history.

**Let code choose where the rule is simple.** If each kind of step always goes to the same tier, write that in code. Do not ask a model to decide it each time.

**Measure on your own work.** A higher price per token is not always a higher cost per finished task. Take a sample of real tasks, give each an outcome that can be checked, and run the candidates on them. Keep a mix of models only if it beats every single model on both result and cost.

## Checkpoints

At set points, each agent writes its progress and anything blocking it to the run's checkpoint file. A stuck run is then seen in minutes, and a run that stops can resume from its last checkpoint and does not start again.

The checkpoint file belongs to the run, not to the codebase. It is not committed.
