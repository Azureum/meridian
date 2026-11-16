# First-time setup

Meridian works in any codebase. The first time an agent finds Meridian in a repository that has not been set up, it does the steps below without being asked for each one.

A repository has not been set up when it has no `SYSTEM.md` at its root.

## 1. Understand the system

This comes first, because everything else depends on it. [`practices/system.md`](practices/system.md) explains why.

Read the code and work out what the system is and what matters most in it: accuracy, a complete record, availability, speed, cost, and in what order. Propose that to the user, with what you saw that led you to it, and let them correct it. Then write `SYSTEM.md` from [`templates/SYSTEM.md`](templates/SYSTEM.md).

The order is the user's to set. Do not guess it and carry on.

## 2. Build what the codebase needs

Do these straight away. They add files and change no code.

1. **Write `CODEBASE.md`** from [`templates/CODEBASE.md`](templates/CODEBASE.md): where things are, where each area starts, and what each API route does. Read the code to write it; do not copy older documents.
2. **Write one file per feature** in `features/`, from [`templates/feature.md`](templates/feature.md): what the feature is, what it is for, what must always be true, and how it is meant to behave. State what is true now. Leave out what was tried before and how it got here.
3. **Write the feature map** in `features/README.md`, from [`templates/feature-map.md`](templates/feature-map.md): every feature by the name a user would use, where they meet it, and a link to its file.
4. **Write `.meridian/preflight.json`:** the environment variables, files and commands that work in this repository needs before a run can start, such as a real call to each service it uses, the build, and the tests.
5. **Save the scanner's counts,** so that from now on they can fall and cannot rise:
   ```bash
   node checks/scan.mjs <repository> --baseline <repository>/.meridian/baseline.json
   ```
6. **Run every check** and fix what it reports in the files you just wrote:
   ```bash
   node checks/all.mjs <repository>
   ```

## 3. Ask how to merge

Ask the user whether this repository merges finished work on its own or waits for them to approve each merge. Record the answer in the repository's own `AGENTS.md`. [`playbooks/merge-and-watch.md`](playbooks/merge-and-watch.md) describes both.

## 4. Ask about a clean-up

Show the user what the scanner finds:

```bash
node checks/scan.mjs <repository>
```

Then ask them whether they want the codebase cleaned up. Do not start a clean-up without a yes.

Before a clean-up begins, tell the user to make sure the agent doing it is a capable one. A clean-up changes working code across many files, and a weak model will make it worse. If you are not sure you are that agent, say so.

If they say yes, follow [`practices/1-codebase.md`](practices/1-codebase.md): remove dead paths, comments and band-aids, in small changes that each keep the checks passing. Save the scanner's counts again after each one, so the gain is kept.

## After setup

From then on Meridian is the guide for every agent in the repository: follow [`AGENTS.md`](AGENTS.md), and keep `SYSTEM.md`, `CODEBASE.md` and the feature files true in the same change that alters what they describe.
