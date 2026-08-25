---
name: min-experiment
description: Find the assumption a decision hangs on and design a low-cost, reversible experiment that tests it within a week or the cycle you set.
argument-hint: <the choice or idea you are stuck on, and the cycle you can accept if not 7 days>
disable-model-invocation: true
license: Apache-2.0
---

Some decisions get no clearer on paper; the only information left is reality's feedback. Trade the argument for a test: find the assumption the decision hangs on and design the **minimum experiment** that could **falsify** it — cheap, **reversible**, finished inside the cycle — so the user takes a first step tomorrow instead of a decision today.

Write in the language the user writes in.

## 1. Pin the decision and the cycle

If the argument names no choice or idea, ask one question for it and stop. Take the cycle from the user; when they give none, it is 7 days.

State the decision in one sentence: the option under consideration and what taking it commits the user to.

Done when the option is stated in one sentence and the cycle is a fixed number of days.

## 2. Surface the three assumptions

List the three assumptions behind the decision that most need verifying — the load-bearing claims that must hold for the decision to be right, which the user is treating as fact without evidence in hand.

A lazy list holds generic worries (*I might not have time*). Write each assumption as a claim reality can falsify: *customers in segment X will pay Y for this*, not *there is demand*. An assumption that a search, a file, or a quick calculation can settle, settle now (`WebSearch`/`WebFetch`, the user's own files): report the answer and take the next assumption in its place.

Done when three assumptions are listed, each a falsifiable claim, each unsettled by anything you could look up, and each able to move the conclusion if false.

## 3. Pick the decisive one

Select the assumption most likely to change the final conclusion. This is a different question from "most uncertain" or "easiest to test": ask of each, *if this turned out false, would the user still take the option?* The one where the answer changes most is the one to test.

Done when one assumption is chosen and its weight reads as a conditional: *if it holds, do A; if it fails, do B.*

## 4. Design the minimum experiment

Around that one assumption, design the smallest action that could falsify it. A lazy design is a pilot of the whole idea — build the product, run the programme, move the family. Strip to the cheapest probe that yields the signal: a landing page and an ad before a product, five conversations before a survey, one week of living the change before committing to it.

Check three constraints separately:

- **Low-cost** — the spend in hours and money is small enough that a stop result costs nothing the user will regret.
- **Reversible** — on the last day the user can walk it back: nothing announced, signed, quit, or spent that cannot be recovered.
- **Within the cycle** — the result is in hand by the cycle's end. When the true signal takes longer, test a leading indicator that arrives in time and say what it stands in for.

Write down what to do, concrete enough to hand to someone else, and the time and resources it takes: hours per day, money, people, tools.

Done when the experiment targets the chosen assumption, passes all three constraints, and its actions and costs are written as specifics rather than categories.

## 5. Fix the signals before it runs

Name the metrics to observe and how each is captured during the cycle. Then set the two thresholds — the result that supports continuing, and the result that says stop — as observable outcomes with a number wherever a number exists, so the user reads the outcome against a line drawn in advance rather than arguing it afterwards.

Where a result can land between the two, name that case and give it its own next step.

Last, state what the user will know once the experiment ends that they cannot know now — information that more thinking could not have produced.

Done when the metrics, the continue threshold, the stop threshold, and the new information are each written down, the thresholds carry a number wherever one exists, and every plausible result maps to continue, stop, or a named middle case.

## 6. Name tomorrow's first action, then deliver

The first action is the first step of the experiment itself, small enough to finish tomorrow with what the user already has and without waiting on anyone: send the message, book the room, publish the page. Preparation (*think about which customers to call*) is a plan, and the user already has one.

Deliver, in this order:

- **Assumptions** — the three, each as a falsifiable claim, with why each needs verifying.
- **Decisive assumption** — the one selected, and the conditional showing how it changes the conclusion.
- **What to do** — the experiment's concrete steps.
- **Time and resources** — hours, money, people, tools.
- **Metrics** — what to observe and how it is captured.
- **Continue signal** — the result that supports going ahead.
- **Stop signal** — the result that says stop.
- **New information** — what the user will know at the end that they cannot know now.
- **First action** — the one thing to start tomorrow.

Done when all nine items are delivered in this order and the first action is one the user can complete tomorrow.
