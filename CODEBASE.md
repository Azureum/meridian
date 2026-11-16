# Codebase

Where things are in this repository. Read this first.

<!-- covers: checks/*.mjs practices/*.md playbooks/*.md templates/*.md -->

| Path | What is there |
| --- | --- |
| `AGENTS.md` | What every session loads: the model, the rules that need judgment, the checks, and what to read when |
| `SETUP.md` | What an agent does the first time it finds Meridian in a repository |
| `practices/system.md` | Why an agent must understand the system and what matters most in it before anything else |
| `practices/0-workflow.md` | The layer on top: the path from the user's text to merged, watched work |
| `practices/1-codebase.md` | Why the code itself is the main instruction, and the band-aid catalogue |
| `practices/2-static-analysis.md` | The loop of compile, build, lint, type-check and test; expressive types; CI |
| `practices/3-verification.md` | Proving a change does what was asked: invariants, TLA+, Bombadil, running it |
| `practices/4-prose.md` | When a written rule is justified and what a project guide holds |
| `practices/5-human-review.md` | The owner reviews by reading the agent's account of the work |
| `playbooks/start-work.md` | Understanding a request, writing the job, preflight |
| `playbooks/swarm.md` | Splitting work across agents and choosing the agent for each chunk |
| `playbooks/merge-and-watch.md` | Merging, telling the user, watching the result and reverting |
| `playbooks/fast-ci.md` | Making a repository's CI fast without letting it lie |
| `checks/all.mjs` | Runs the system, map, feature and scanner checks together |
| `checks/scan.mjs` | Counts patterns the practices forbid; `--ratchet` stops a count rising |
| `checks/map.mjs` | Keeps a repository's `CODEBASE.md` true |
| `checks/features.mjs` | Keeps the feature map and the feature files in step |
| `checks/shape.mjs` | Fails a document that leaves a section of its template unwritten |
| `checks/preflight.mjs` | Runs the checks a repository lists in its preflight file and reports every gap as one list |
| `checks/clean.mjs` | Fails while anything is left uncommitted or untracked |
| `checks/clean.test.mjs` | Tests for the clean check |
| `checks/scan.test.mjs` | Tests for the scanner |
| `checks/map.test.mjs` | Tests for the map check |
| `checks/features.test.mjs` | Tests for the feature check and the single command |
| `checks/shape.test.mjs` | Tests for the shape check |
| `checks/preflight.test.mjs` | Tests for the preflight |
| `checks/baseline.json` | This repository's own counts, all zero |
| `templates/SYSTEM.md` | What a system is and what matters most in it |
| `templates/AGENTS.md` | A starting guide for a project |
| `templates/CODEBASE.md` | A starting map for a project |
| `templates/feature.md` | A starting file for one feature |
| `templates/feature-map.md` | A starting list of every feature by the name users see |
| `templates/job.md` | A written job: done, scope, who decides what, follow-ups |
| `templates/pull-request.md` | The account of a piece of work, for the owner to read |
