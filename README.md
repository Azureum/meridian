# Meridian (Pactory)

How agents work in Pigeon Studios repositories: the rules, the reasoning behind them, and a checker that enforces what a machine can enforce.

## The model

Agents build most of our code, and each one starts with no memory of what the last one intended. What it finds in the files is what it takes to be correct. So the codebase itself is the main instruction, and everything else is there to catch what the codebase lets through.

```
  ┌─────────────────────────────────────────┐
  │                codebase                 │  shape, names, one source of truth
  └┬───────────────────────────────────────┬┘
   │            static analysis            │   checks that run on every change
   └┬─────────────────────────────────────┬┘
    │            verification             │    proof that it behaves as intended
    └──┬───────────────────────────────┬──┘
       │             prose             │       rules like these
       └────┬─────────────────────┬────┘
            │    human review     │            the owner's attention
            └─────────────────────┘
```

The width of a layer is how much of the work it should carry. Fix a problem at the widest layer that can hold the fix.

## What is here

| Path | What it is |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | The rules, short enough to load in every session |
| [`practices/`](practices/) | One page per layer: the reasoning and worked examples |
| [`checks/scan.mjs`](checks/scan.mjs) | Counts the patterns the rules forbid, and can stop the counts from rising |
| [`templates/`](templates/) | A starting `AGENTS.md` for a project, and a pull request description |

## Using it in a project

Add this repository to the project as a submodule, load the rules from the project's own guide, and run the checker in CI.

```bash
git submodule add https://github.com/Azureum/meridian .practices
```

In the project's `CLAUDE.md`:

```
@.practices/AGENTS.md
@AGENTS.md
```

Start the project's own `AGENTS.md` from [`templates/AGENTS.md`](templates/AGENTS.md).

## The checker

```bash
node .practices/checks/scan.mjs .
```

It reads the tracked source files and counts:

| Count | What it finds |
| --- | --- |
| `dated-comment` | A date inside a comment |
| `history-comment` | A comment about what the code was |
| `stopgap-comment` | A marker for a patch that was never finished |
| `swallowed-error` | A failure turned into an empty answer |
| `forced-style` | A style override stacked on the rule it should have replaced |
| `soft-check` | A test or CI step that cannot fail |
| `test-reads-source` | A test that matches source text instead of calling the code |
| `big-file` | A source file too long to read whole |

The counts are signals. A single hit can be legitimate; a rising count is not.

### Adopting it in an existing codebase

An older codebase will have thousands of hits, and nobody should rewrite it in one go. Save today's counts, then let them fall and never rise:

```bash
node .practices/checks/scan.mjs . --baseline .practices-baseline.json   # once
node .practices/checks/scan.mjs . --ratchet  .practices-baseline.json   # in CI
```

When a count drops, save a new baseline in the same change so the gain is kept.

## Changing these rules

The rules follow their own advice. Before adding one, check whether the scanner could count it instead, and add the detector with a test. Keep `AGENTS.md` short: a rule that most sessions will never need belongs in `practices/`.

```bash
npm test         # the checker's tests
npm run check    # this repository against its own rules
```
