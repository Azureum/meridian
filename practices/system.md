# Understand the system first

Before anything else in Meridian applies, an agent has to understand the system it is working in: what it is, and what matters most in it. The same change can be right in one system and wrong in another.

## Why

Systems want different things, and those things pull against each other.

- **A banking system** puts accuracy first, then a complete record of what happened: logs, audit trails, the ability to reconstruct any past state. Speed comes well after both. A change that makes it faster and drops a log line is a bad change.
- **An edge service** that answers millions of requests puts speed first. Detailed logging and auditing on every request would cost it the thing it exists for. A change that adds an audit record to the hot path is a bad change.

Neither is the better system. An agent that brings one system's habits to the other does damage while following every rule it knows.

## The system file

A repository that uses Meridian has a `SYSTEM.md` at its root, written with the user at first-time setup and read before any work. [`templates/SYSTEM.md`](../templates/SYSTEM.md) has its shape:

- **What it is:** what the system does and who depends on it.
- **What matters most:** its qualities in order, for example accuracy, auditability, availability, speed, cost. When two pull against each other, the higher one wins.
- **What gives way:** what the system accepts less of so that the order holds.
- **What must never happen:** the failures that are not acceptable whatever they would save.
- **What this means for the work:** how the order changes the way work is done here.

The order is the user's to set. The agent proposes it from what it sees in the code and confirms it with them. It does not guess it and carry on.

## How it shapes everything else

| | Accuracy and audit first | Speed first |
| --- | --- | --- |
| Before a merge | Everything verified; a model of the flows that move money | Verified where users would notice; measured for speed |
| Logging | Every action recorded, never dropped to save time | Kept off the hot path |
| Deciding alone | Little: anything touching records is escalated | More: most choices can be undone |
| A failed read | Stop | Often serve the last good answer, if the file says so |
| "Not fine" after a merge | Any wrong figure, any missing record | Slower responses, more errors |
| A slower, safer fix | Take it | Often not worth it |

Every later page in Meridian is read through this file. Where a page says "verify" or "fail closed" or "decide alone", how far that goes in this repository is set here.

When a change would trade something higher on the list for something lower, it is wrong for this system, however good it looks alone. Say so and stop.
