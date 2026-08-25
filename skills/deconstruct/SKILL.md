---
name: deconstruct
description: Reverse-engineer why a finished piece of work succeeds and extract what transfers to your own — rules, a checklist, and a first exercise.
argument-hint: <the exemplar — pasted or a URL — and what you want to learn from it>
disable-model-invocation: true
license: Apache-2.0
---

Admiring a finished work teaches nothing; the lessons sit in the choices its maker made and never wrote down. **Deconstruct** the exemplar to recover those choices, then keep only what is **transferable** to the user's own work.

Write in the language the user writes in.

## 1. Take in the exemplar and the goal

The user supplies two things: the exemplar (a product page, webpage, plan, process doc, dashboard, or other finished work) and what they want to learn from it. If either is missing, ask one question for it and stop.

When the exemplar is a URL, fetch it with `WebFetch` and work from the fetched page; when the fetch returns nothing usable, ask the user to paste the content and stop.

Hold the learning goal as the filter for every later step: the same page deconstructed for "how it sells" and for "how it organises information" yields different rules.

Done when the full exemplar is in hand and the learning goal is stated in one sentence you can test a rule against.

## 2. Name the problem it solves

Open with one sentence: what problem this work solves, and for whom. Describe the problem from the audience's side ("lets a first-time visitor decide in thirty seconds whether the tool fits"); "a SaaS landing page" names a category, not a problem.

Done when the sentence names the problem and the person who has it, and contains no feature of the artifact.

## 3. Deconstruct why it works

Reverse-engineer the exemplar through four lenses, each backed by something you can point to in the artifact:

- **Who it serves and what its goal is.** The specific person in a specific moment, and the single outcome the maker built it to produce. "Users" and "to inform" are placeholders; the real answer says what the maker counts as success.
- **What structure or flow it uses.** The order of parts and the reason for the order: what each part sets up for the next, where the audience is taken first and why. Listing the sections is inventory, not structure.
- **Which key choices create the quality gap.** Picture the ordinary version of the same thing and name the few choices this maker made differently. A choice earns the list only if removing it would drop the work back to ordinary; praising everything it does well buries the choices that matter.
- **What its completion standard is.** What the maker evidently checked before calling it done, inferred from what holds across the whole artifact without exception (every claim has a number, every screen has one action).

Where a lens needs context the artifact does not carry (who made it, what the ordinary version looks like), look it up with `WebSearch` rather than guess.

Done when each of the four lenses has a finding tied to evidence from the exemplar, and the quality-gap lens names the ordinary version it was measured against.

## 4. Sort transferable from case-specific

Sort the findings into patterns that transfer and details that fit only this case. A pattern is transferable when it would still hold with a different audience, medium and subject; a detail is case-specific when it depends on this maker's brand, resources, domain or moment.

Name the case-specific details as fully as the transferable patterns; they tell the user what to leave out of their own version.

Done when every finding from step 3 sits in exactly one of the two piles.

## 5. Deliver

Deliver in this order: the problem sentence, the deconstruction under its five lenses (four from step 3, the sort from step 4), and then:

- **Reusable rules** — three to five, chosen for the user's learning goal, each a transferable pattern phrased as an instruction the user can apply to their own work, with the evidence from the exemplar that backs it.
- **Checklist** — the steps the user follows to produce their own version, ordered, each one checkable as done or not, with the completion standard from step 3 as the closing item.
- **First exercise** — the one small exercise most worth trying first: bounded to a single sitting, and practising the rule whose absence would cost the user's work the most.

Done when the output runs in that order, the rules number three to five, every checklist item is checkable, and the exercise names one rule and one concrete thing to make.
