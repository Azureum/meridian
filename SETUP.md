# First-time setup

Meridian works in any codebase. The first time an agent finds Meridian in a repository that has not been set up, it does the steps below without being asked for each one.

A repository has not been set up when it has no `CODEBASE.md` at its root.

## 1. Build what the codebase needs

Do these straight away. They add files and change no code.

1. **Write `CODEBASE.md`** from [`templates/CODEBASE.md`](templates/CODEBASE.md): where things are, where each area starts, and what each API route does. Read the code to write it; do not copy older documents.
2. **Write one file per feature** in `features/`, from [`templates/feature.md`](templates/feature.md): what the feature is, what it is for, and how it is meant to behave. State what is true now. Leave out what was tried before and how it got here.
3. **Run the checks** and fix what they report in the files you just wrote:
   ```bash
   node checks/map.mjs <repository>
   ```

## 2. Ask about a clean-up

When step 1 is done, show the user what the scanner finds:

```bash
node checks/scan.mjs <repository>
```

Then ask them whether they want the codebase cleaned up. Do not start a clean-up without a yes.

Before a clean-up begins, tell the user to make sure the agent doing it is a capable one. A clean-up changes working code across many files, and a weak model will make it worse. If you are not sure you are that agent, say so.

If they say yes, follow [`practices/1-codebase.md`](practices/1-codebase.md): remove dead paths, stale and historical comments and band-aids, in small changes that each keep the checks passing.

If they say no, save the scanner's counts so they cannot rise, and stop:

```bash
node checks/scan.mjs <repository> --baseline <repository>/.meridian-baseline.json
```

## After setup

From then on Meridian is the guide for every agent in the repository: follow [`AGENTS.md`](AGENTS.md), and keep `CODEBASE.md` and the feature files true in the same change that alters what they describe.
