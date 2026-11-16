# Meridian (Pactory)

A guide for agents that works in any codebase. When Meridian is in a repository, agents working there use it as their guide, and the first agent to find it sets the repository up: see [`SETUP.md`](SETUP.md).

## The model

Agents build most of our code, and each one starts with no memory of what the last one intended. What it finds in the files is what it takes to be correct. So the codebase itself is the main instruction, and everything else is there to catch what the codebase lets through.

```
                   workflow                       how what a person types becomes finished work
  ┌─────────────────────────────────────────┐
  │                codebase                 │  shape, names, one source of truth
  └┬───────────────────────────────────────┬┘
   │            static analysis            │   checks that run on every change
   └┬─────────────────────────────────────┬┘
    │            verification             │    proof that it behaves as intended
    └──┬───────────────────────────────┬──┘
       │             prose             │       written rules
       └────┬─────────────────────┬────┘
            │    human review     │            the owner reading the agent's account
            └─────────────────────┘
```

The width of a layer is how much of the work it should carry. Fix a problem at the widest layer that can hold the fix.

Before any of it applies, an agent has to understand the system it is in and what matters most there. A bank's ledger and an edge service want opposite things, and the same change can be right in one and wrong in the other.

## What is here

| Path | What it is |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | What every session loads: the model, the few rules that need judgment, the checks, and what to read when |
| [`SETUP.md`](SETUP.md) | What an agent does the first time it finds Meridian in a repository |
| [`practices/`](practices/) | The reasoning: understanding the system, workflow, and one page per layer. Read when relevant |
| [`playbooks/`](playbooks/) | What to do at one step of the work: starting, splitting across agents, merging, speeding up CI |
| [`checks/`](checks/) | Scripts that hold everything a machine can check |
| [`templates/`](templates/) | Starting files for a project |
| [`CODEBASE.md`](CODEBASE.md) | Where things are in this repository |

## Using it in a project

Add this repository to the project as a submodule and load its rules from the project's own guide.

```bash
git submodule add https://github.com/Azureum/meridian .practices
```

In the project's `CLAUDE.md`:

```
@.practices/AGENTS.md
@AGENTS.md
```

The first agent to work there then follows [`SETUP.md`](SETUP.md).

## The checks

One command runs them, and belongs in CI:

```bash
node .practices/checks/all.mjs .
```

| Check | It fails when |
| --- | --- |
| System | `SYSTEM.md` is missing or has an unwritten section |
| Map | `CODEBASE.md` names a path that is gone, or misses a file in a folder it covers |
| Features | A feature has no file, is missing from the feature map, or has an unwritten section |
| Scanner | Any count below rose above the saved one |

Two more run at their own moment:

```bash
node .practices/checks/preflight.mjs .                 # before a run starts
node .practices/checks/clean.mjs .                     # before work is called done: nothing left behind
node .practices/checks/shape.mjs <file> <template>     # a written job or account
```

### What the scanner counts

| Count | What it finds |
| --- | --- |
| `comment` | Any comment at all |
| `dated-comment` | A date inside a comment |
| `history-comment` | A comment about what the code was |
| `stopgap-comment` | A marker for a patch that was never finished |
| `swallowed-error` | A failure turned into an empty answer |
| `forced-style` | A style override stacked on the rule it should have replaced |
| `soft-check` | A test or CI step that cannot fail |
| `test-reads-source` | A test that matches source text instead of calling the code |
| `big-file` | A source file too long to read whole |
| `versioned-name` | A file named as an old version kept beside the live one |

The counts are signals. A single hit can be legitimate; a rising count is not.

An older codebase will have thousands of hits, and nobody should rewrite it in one go. Setup saves today's counts in `.meridian/baseline.json`. From then on they can fall and cannot rise. When a count drops, save the baseline again in the same change so the gain is kept:

```bash
node .practices/checks/scan.mjs . --baseline .meridian/baseline.json
```

## Changing Meridian

Meridian follows its own advice. `AGENTS.md` holds only the rules that need judgment. Before adding one, ask whether a check could hold it instead, and add the check with a test. Anything an agent needs only at one step goes in a playbook, and reasoning goes in `practices/`.

```bash
npm test         # the checks' tests
npm run check    # this repository against its own rules
```
