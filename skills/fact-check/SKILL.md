---
name: fact-check
description: Decompose a claim into facts, conclusions and value judgements, verify every fact online, audit the inference, and say how far to trust it.
argument-hint: <the claim to check — paste the opinion, conclusion, data or proposal>
disable-model-invocation: true
license: Apache-2.0
---

Humans and models both hallucinate, and the text in front of you may be either's. Doubt it by default: split the claim into what can be checked and what cannot, trace every fact to its **primary source** and give it a **verdict**, and audit the **inference** from those facts before granting the conclusion.

Write in the language the user writes in.

## 1. Decompose the claim

If the user gave no claim, or a bare topic with nothing to check, ask one question for the text itself and stop.

Split the claim into three bins:

- **Facts** — statements the outside world can confirm or refute: numbers, events, quotes, attributions.
- **Conclusions** — what the claim infers from those facts.
- **Value judgements** — what it holds good, bad, or worth doing; no evidence settles these, so name them and set them aside.

A sentence usually mixes all three ("the study shows X, so we should Y") — cut at the seams rather than binning whole sentences. Rewrite each fact as one checkable proposition with its who, what, when and where. For a plan or proposal the facts are its premises and the conclusion is that the plan reaches its aim.

Done when every statement in the claim sits in exactly one bin and every fact is a single proposition specific enough to be found true or false.

## 2. Verify each fact

Check every fact with `WebSearch` and `WebFetch`, tracing it to its primary source. A page that repeats the number is a copy of the claim, not evidence for it; your own recollection is a claim to check, never a source. At the primary source read four things:

- **Source** — who originally produced it, and whether they are in a position to know.
- **Sample** — what was measured, on whom, how many, how selected.
- **Date** — when it was measured, and whether it is still current.
- **Full context** — what the source says around the quoted part; a true sentence lifted from its qualifications is the commonest way a fact goes wrong.

Tag each fact with exactly one verdict:

1. **Verified** — the primary source says this, in this scope.
2. **Holds but must be narrowed** — true for a smaller population, period, or definition than the claim states; write the narrowed form.
3. **Disputed** — credible sources disagree; name who and on what.
4. **Insufficient evidence** — no primary source found either way; record what you searched and what would settle it.
5. **Clearly wrong** — the primary source contradicts it; write the correction.

The lazy verdict is 1 for anything roughly true. A number right for a different year, country, or metric is verdict 2.

Done when every fact from step 1 carries one of the five verdicts with the URLs it rests on (the search record, for verdict 4), and every verdict-2 and verdict-5 fact carries its corrected statement.

## 3. Audit the inference

Grant every fact exactly as the claim states it — the verdict-5 ones included — and test whether the conclusion follows. This isolates the reasoning from the facts: a hole found here stays a hole even if every verdict in step 2 were reversed. Run five checks:

1. **Entailment** — do these facts, by themselves, produce this conclusion, or is a step missing between them?
2. **Hidden assumptions** — what unverified premise must also be true for the inference to work? Name each one.
3. **Correlation and causation** — where the claim moves from "together" to "because", what rules out reverse causation or a common cause?
4. **Omissions** — what alternative explanation fits the same facts, and what key information would a reader need that the claim leaves out?
5. **Conditions** — under what conditions does the conclusion hold, and under what conditions does it fail?

A claim whose facts all verify can still fail the five checks. Once they are answered, re-run entailment on the facts as step 2 left them, narrowed and corrected: most conclusions die on narrowing — a fact true for one population carried to a conclusion about another.

Done when each of the five checks has a written answer for every conclusion on the facts as claimed, entailment has a second answer on the narrowed and corrected facts, and the conditions check names at least one condition under which the conclusion holds and one under which it fails.

## 4. Deliver

Report, in this order:

- **Facts** — which are credible and which need correction, each with its verdict and, where corrected, the statement that replaces it.
- **Critical hole** — the single weakest link in the reasoning chain, chosen because fixing it moves the conclusion most.
- **Repaired claim** — the strongest version that survives: narrowed facts, assumptions made explicit, conditions stated — what an honest advocate would now say, not a hedge on every clause.
- **Trust level** — how far the user can rely on the claim now, in one committal sentence, and what evidence would raise it.

Done when every fact appears under the first item, the hole is a single link, the repaired claim reads as an assertion the user could pass on, and the trust level names one level and the evidence that would raise it.
