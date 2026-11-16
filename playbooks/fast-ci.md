# Playbook: fast CI that does not lie

A task an agent carries out on a repository. It works for any language and any CI provider; where it names a kind of tool, pick the fastest one that works on this repository.

## Goal

Make CI as fast as possible without letting it lie. Target: a pull request gets its result in under 2 minutes at the median and under 3 minutes at the 95th percentile.

## Two rules outrank speed

1. **The full suite runs before anything reaches the main branch,** in a merge queue. Test selection only narrows the feedback on a pull request.
2. **Never get faster by hiding failures.** No retries, no wider timeouts, no skipped tests. A check that needs a retry has a bug; find it.

## First, audit

Pull the last 150 runs. Split every job into three parts, each at the median and the 95th percentile:

- **Waiting:** from queued to started.
- **Setup:** checkout, restoring caches, installing.
- **Running:** the actual check.

Fix the biggest part first. It is rarely the tests, so do not spend time deleting them.

## Then hit these budgets

| Part | Budget | How |
| --- | --- | --- |
| Waiting | Under 10 seconds | Move every job to runners that start at once, including the five-second jobs: a five-second job that queues ten minutes is a ten-minute job. Cancel a branch's run in progress when a new commit lands. |
| Setup | Under 30 seconds | Get cache hits on pull requests above 95% by seeding caches from the main branch. Cache the installed dependencies themselves, not only the download cache. Clone without file contents until they are needed (a partial clone), not a shallow clone. |
| Lint | Under 5 seconds | Use the fastest linter for the language and remove the slower one. Turn on every rule you can. |
| Type-check | Under 5 seconds | Use the fastest type checker that can check this repository, with a named fallback if it cannot. |
| Format | Seconds | One formatter, the fastest. Remove the others. |
| Install and scripts | Seconds | One package manager and script runner, the fastest. Remove the others. |
| Tests | Under 60 seconds per shard | See below. |
| Local | Under 9 seconds | A pre-push hook that formats, lints and type-checks the changed files. A hook, not a sentence in a guide, because agents skip steps. |

### Tests

- Stop reloading the application for every test file. Share it, and reset state after each file.
- Write the clean-up rules where the test tooling enforces them, and state them in the project's guide.
- Run in random order to flush out tests that leak state into each other.
- Split into shards by measured duration, on machines with many cores, each shard with its own database.
- Buy cores before shards, and match the number of parallel tests to the cores.

### Shape

- Run lint, type-check, build and tests side by side, not one after another.
- Move migration checks and other applications' tests out of the slowest job into jobs of their own.

### Selection

- On pull requests, run only what the change can reach, using the build tool's own dependency graph.
- Then hide a real change from it on purpose and confirm CI goes red, not green. Selection that can miss a change is CI that lies.

### Keep it fast

Fail any job that exceeds its budget. Speed that is not enforced is lost within weeks.

## Choosing tools

The fastest tool of each kind is the default. Keeping an older one needs a measured reason. Take anything newer that is faster on this repository.

Before each switch, run the old and the new side by side on the same code and list everything the new one misses. A faster tool that checks less is not faster; it is weaker.

## How to deliver it

- One small pull request per change, with before and after numbers taken from real runs.
- Do everything you can without the owner first.
- Bring everything that needs an account, a secret or a bigger bill as one list, with the expected monthly cost of each.
- End with the total CI time and cost, before and after.
