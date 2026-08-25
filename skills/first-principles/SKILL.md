---
name: first-principles
description: Take a patched-over problem back to bedrock and re-derive the path from first principles instead of convention.
argument-hint: <the problem you want solved, and how it is handled today>
disable-model-invocation: true
license: Apache-2.0
---

A problem that keeps needing patches is being solved on the terms of its first solution: **path dependence**, where every fix inherits the assumptions of the one before. Take the problem back to **bedrock** — what is confirmed, what is merely accepted, what is actually wanted, what is actually available — and rebuild the path from **first principles** rather than from what the field does.

Write in the language the user writes in.

## 1. Pin the problem and the current solution

State the problem the user wants solved and the solution currently in place or currently proposed — the process, the architecture, the system as it runs today, patches included. Where none exists yet, the current solution is whatever the user would build by default. Where it lives somewhere you can read — the codebase, a process document, a config — read it rather than reconstruct it from the user's summary.

If no problem was given, ask one question for it and stop; anything else you need, infer or look up.

Done when the problem and the current solution are each stated in a form the user would sign, and the current solution's patches are listed by name.

## 2. Decompose to bedrock

Take the problem apart until nothing underneath it can be taken apart further, and show the user what you find, sorted into exactly four bins:

- **Basic facts** — confirmed and impossible to route around: physics, law, signed contracts, measured numbers, what users have actually done.
- **Unverified assumptions** — accepted by habit and never tested: "this has to be synchronous", "customers expect a form", "that team cannot own it". The current solution rests on these.
- **The real goal** — the outcome wanted. The stated ask usually names a means; the goal is what the means was for.
- **Resources and constraints** — what actually exists: people, money, time, hard deadlines, commitments already made.

The lazy run files everything as fact. The test for a fact is that someone could show it to you; anything believed because it has always been true, or because a vendor said so, goes into assumptions with a note of what would verify it. The test for a constraint is that violating it costs something real; a preference dressed as a constraint goes into assumptions too.

Done when the four bins are written out, every claim the problem or the current solution rests on sits in exactly one of them, and every assumption carries what would verify it.

## 3. Re-derive the path

For the duration of the derivation, set aside industry convention and every off-the-shelf solution, the one in place included. Start from the basic facts, the real goal, and the constraints, and derive the viable paths from those alone: given only these, what is the shortest route to the goal?

A run that arrives back at the current solution under new names is path dependence in disguise; a run that arrives at a textbook alternative has swapped one convention for another. Where several paths hold, carry the one that rests on the fewest unverified premises.

Done when the chosen path is traced from bedrock in steps that each cite a fact, the goal, or a constraint, and none cites a convention.

## 4. Deliver

Output, in this order:

- **Surface patches** — the parts of the current solution that only patch the surface: each one, and the unverified assumption it was compensating for.
- **The new path** — the path re-derived from basic facts, and where it parts company with the current solution.
- **Premises** — everything that must hold for the new path to stand: the facts and constraints it leans on and the assumptions it makes, each stated as a claim that could turn out false.
- **First verification step** — the minimum experiment: the single cheapest action, startable today, that tests the path at the premise whose failure would kill it.

Done when all four items are present in this order, every patch names its assumption, and the first step targets a named premise.
