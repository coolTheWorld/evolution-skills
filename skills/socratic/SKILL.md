---
name: socratic
description: Diagnose a confusion Socratically, one question at a time, until the question actually worth answering surfaces — then answer that one.
argument-hint: <your confusion — what happened, how you read it, and where you are stuck, as concretely as you can>
disable-model-invocation: true
license: Apache-2.0
---

What a person asks and what they mean are often two different questions, and the gap is where the answer goes wrong. Hold the advice: run a **Socratic** diagnosis — one question a turn, each aimed at the **crux** — until the question actually worth answering surfaces, and answer only that one.

Write in the language the user writes in.

## 1. Sort what the user said

Record the opening question verbatim. If the message lacks what happened, how the user reads it, or where they are stuck, ask one question for the missing piece and stop.

Tag every statement in the message with one of four labels: **verifiable fact**, **interpretation of fact**, **value judgement**, or **goal**. The lazy run takes the user's framing at face value and tags everything as fact; most confusions are an interpretation or a value judgement wearing the grammar of a fact, and the diagnosis turns on the mislabel. Mark every tag you could argue two ways as doubtful.

Done when the original question is recorded verbatim and every statement carries exactly one of the four tags, with the doubtful tags marked.

## 2. Find what could move the conclusion

Run five checks against the tagged statements: which keywords are vague enough to mean two things; which premises the user is carrying without stating them; where the evidence behind each claim comes from; what rival explanation fits the same evidence; and what it would mean if the user's conclusion held, and if it failed.

Each check that bites yields a candidate question. Keep a candidate only if you can say which answer would change the conclusion and how — a question whose answer leaves the conclusion in place is curiosity, and costs a turn of the budget. Rank the survivors by how far the conclusion moves with each; a question that settles a doubtful tag outranks one that adds detail. The top candidate is the **crux**.

Done when every candidate names the check it came from and the answer that would flip the conclusion, and the candidates are ranked.

## 3. Ask one question

Open the turn with one sentence saying what the previous answer changed in your judgement — for the first question, what the opening message settled. Then ask the crux question. Ask exactly one, then stop and wait for the answer.

Anything a file, a tool or the web can settle, settle there instead of spending a question.

Done when the turn holds one update sentence and one question whose answer could change the conclusion, and nothing else — judgement and advice wait for step 6.

## 4. Update, then decide whether to stop

When the answer lands, re-tag what it touched — an interpretation backed by evidence becomes a fact, a fact contradicted becomes an assumption — then run step 2's five checks against the answer itself: a vague keyword, an unstated premise, an unsourced claim or a rival explanation that first appears in an answer is a new candidate. Re-rank every candidate, old and new, against the new picture.

Enough is known when you can name the real problem and the variable most likely to change the conclusion, and no remaining candidate would move it. The ceiling for the whole diagnosis is 6 questions, counting any asked in step 1 for missing input — a budget rather than a target: stop the moment enough is known, since a question asked to fill the budget is an interrogation.

**Still open**, fewer than 6 asked — return to step 3 with the next crux question.

**Enough known**, or 6 asked — go to step 5.

Done when the branch is chosen and you can name either the variable that still moves the conclusion or the reason nothing left does.

## 5. Write up the diagnosis

Deliver, in this order:

- **Original question** — the question the user opened with, verbatim.
- **Real problem** — what the user actually wants solved, in the form they would have written with more time.
- **Confirmed facts** — what was verified, each with where the evidence came from.
- **Unverified assumptions** — the premises still carried on trust, including interpretations and value judgements that arrived dressed as facts.
- **Key variable** — the one variable most likely to change the conclusion, and how it would.
- **New question** — one precise, specific question the user can act on next.

Close by asking the user to confirm the new question, then stop and wait.

Done when all six items are present in this order, the new question is a single answerable sentence, and the turn ends on the request for confirmation with no judgement given.

## 6. Rule once the question is confirmed

When the user confirms the new question — or corrects it, in which case the corrected version is the question — deliver, in this order:

- **Judgement** — one committal answer to the confirmed question.
- **Reasons** — the confirmed facts the judgement rests on, and each unverified assumption it depends on, named as such.
- **Next actions** — ordered and concrete, each startable today; the first tests the key variable where one can.

Done when the judgement answers the confirmed question, the reasons cite only confirmed facts or named assumptions, and each next action is startable today.
