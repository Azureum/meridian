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

## Each step has its own playbook

An agent reads the playbook for the step it is on, and nothing else from this layer.

| Step | Playbook |
| --- | --- |
| Understanding the request, writing the job, preflight | [`playbooks/start-work.md`](../playbooks/start-work.md) |
| Splitting the work, choosing agents, briefs, checkpoints | [`playbooks/swarm.md`](../playbooks/swarm.md) |
| Merging, telling the user, watching, reverting | [`playbooks/merge-and-watch.md`](../playbooks/merge-and-watch.md) |

Every step is read through the repository's `SYSTEM.md`: what matters most in this system sets how much is verified before a merge, what the agent may decide alone, and what counts as "not fine" afterwards. See [understand the system first](system.md).
