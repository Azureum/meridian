# Codebase

Where things are in this repository. Read this first.

<!-- covers: checks/*.mjs practices/*.md playbooks/*.md templates/*.md -->

| Path | What is there |
| --- | --- |
| `SETUP.md` | What an agent does the first time it finds Meridian in a repository |
| `AGENTS.md` | The rules every session loads |
| `practices/0-workflow.md` | The layer on top: understanding the request, the job, preflight, the swarm, merging, and watching the result |
| `practices/1-codebase.md` | Why the code itself is the main instruction, and the band-aid catalogue |
| `practices/2-static-analysis.md` | The loop of compile, build, lint, type-check and test; expressive types; CI |
| `practices/3-verification.md` | Proving a change does what was asked |
| `practices/4-prose.md` | When a written rule is justified and what a project guide holds |
| `practices/5-human-review.md` | What reaches the owner and how to make review cheap |
| `playbooks/fast-ci.md` | A task for an agent: make a repository's CI fast without letting it lie |
| `checks/scan.mjs` | Counts patterns the rules forbid; `--ratchet` stops a count rising |
| `checks/map.mjs` | Keeps a repository's `CODEBASE.md` true |
| `checks/preflight.mjs` | Runs the checks a repository lists in its preflight file and reports every gap as one list |
| `checks/preflight.test.mjs` | Tests for the preflight |
| `checks/scan.test.mjs` | Tests for the scanner |
| `checks/map.test.mjs` | Tests for the map check |
| `checks/baseline.json` | This repository's own counts, all zero |
| `templates/AGENTS.md` | A starting guide for a project |
| `templates/CODEBASE.md` | A starting map for a project |
| `templates/job.md` | A written job: done, scope, who decides what, follow-ups |
| `templates/feature.md` | A starting file for one feature |
| `templates/feature-map.md` | A starting list of every feature by the name users see |
| `templates/pull-request.md` | A pull request description |
