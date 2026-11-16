# Playbook: starting a piece of work

Use this when a user asks for something. It covers everything before the work itself, and its purpose is to move all the waiting to the front, where it happens once.

Read the repository's `SYSTEM.md` first. What matters most in this system decides how urgent a request can be, what done has to include, and what you may decide alone.

## 1. Understand the request

What a person types is rarely the whole of what they want. It is short, it leaves things out, and it can be read more than one way. Close that gap with the user in one exchange.

1. **Work out what was said and what is wanted.** Read the text for what it literally asks, then for what the person is trying to achieve. Where those differ, or where the text could mean two things, that difference is the thing to settle.
2. **Say it back.** Tell the user, in a few plain sentences, what you understand they want: the outcome, what is included, and what you are taking to be left out.
3. **Say how urgent you take it to be.** For example "this is blocking you now", "this should be done today" or "this can wait for the right fix". Urgency decides how much is done before anything is merged.
4. **Ask every open question now.** Read the whole task and list everything you would otherwise have to stop and ask later. The user answers them in one batch. An agent that stops five times, each time waiting hours for a reply, has spent a day on five questions.
5. **Let the user confirm or correct.** The confirmed version is the prompt.

Do not fill a gap with a guess and start. If the text was already clear and there are no questions, say it back in one line with the urgency and go on.

## 2. Write the job

The confirmed prompt becomes a written job that you can test yourself against. [`templates/job.md`](../templates/job.md) has its shape, and [`checks/shape.mjs`](../checks/shape.mjs) fails a job with a section left unwritten.

- **Done:** the commands that must pass and the things that must be observable. If done cannot be tested, it is not yet a definition.
- **Scope:** the files and areas the job may touch.
- **Out of scope:** what it must leave alone.
- **Follow-ups:** new ideas found along the way go on this list. They do not go into the current run. The scope is fixed once the job is written.

### Who decides what

- **Decide alone** anything that can be undone, such as naming, structure and how to build it. Decide, note the decision in your account, and carry on.
- **Escalate** only what the job's list names, such as deleting data, spending money, and anything public.

Anything not on the escalate list, you decide. An agent that asks about what it could have decided is spending the user's time to protect itself.

## 3. Preflight

Before any agent runs, a script checks that everything the job needs is in place. It is a script, not an agent, because it has to be cheap and give the same answer every time. The run does not start until it passes.

```bash
node checks/preflight.mjs <repository>
```

It runs what the repository lists in `.meridian/preflight.json`, which should cover:

- **Credentials and tools work,** by one real call to each.
- **The repository, data and documents are present** and readable.
- **The environment builds and the tests run.**
- **Budget, time limit and permissions are set.**

When something fails, it reports every gap once, as a single list. Give that list to the user. The alternative is discovering each gap twenty steps in, one at a time.

## Next

If the work is more than one chunk, go to [`swarm.md`](swarm.md). When it is done, go to [`merge-and-watch.md`](merge-and-watch.md).
