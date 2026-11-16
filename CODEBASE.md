# Codebase

Where things are in this repository. Read this first.

<!-- covers: checks/*.mjs practices/*.md templates/*.md -->

| Path | What is there |
| --- | --- |
| `AGENTS.md` | The rules every session loads |
| `practices/1-codebase.md` | Why the code itself is the main instruction, and the band-aid catalogue |
| `practices/2-static-analysis.md` | Turning rules into checks, and what makes a test worth having |
| `practices/3-verification.md` | Proving a change does what was asked |
| `practices/4-prose.md` | When a written rule is justified and what a project guide holds |
| `practices/5-human-review.md` | What reaches the owner and how to make review cheap |
| `checks/scan.mjs` | Counts patterns the rules forbid; `--ratchet` stops a count rising |
| `checks/map.mjs` | Keeps a repository's `CODEBASE.md` true |
| `checks/scan.test.mjs` | Tests for the scanner |
| `checks/map.test.mjs` | Tests for the map check |
| `checks/baseline.json` | This repository's own counts, all zero |
| `templates/AGENTS.md` | A starting guide for a project |
| `templates/CODEBASE.md` | A starting map for a project |
| `templates/pull-request.md` | A pull request description |
