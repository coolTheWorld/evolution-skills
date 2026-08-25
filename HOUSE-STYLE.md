# House style — how skills in this repo are written

Every skill here is a rewrite of a proven prompt into an agent-facing workflow. The exemplar is [`skills/steelman/SKILL.md`](skills/steelman/SKILL.md): read it in full before writing a new skill, and match its voice, shape and density. A contribution is a *faithful rewrite*, not a translation — turn requests aimed at a chatbot into the process the agent executes, and add the judgement guidance the source implies.

## Frontmatter — exact keys, exact order

```yaml
---
name: <directory name>
description: <ONE sentence. Human-facing summary of what the skill does. No "Use when…" trigger list — every skill here is user-invoked, so the description is read by the human choosing from the slash menu, not by the model.>
argument-hint: <what the user types after /name, in angle brackets>
disable-model-invocation: true
license: Apache-2.0
---
```

## Body shape

1. **Framing paragraph** (1–3 sentences, no heading): the stance of the skill, naming its 1–3 **leading words** in bold on first use (steelman bolds **steelman** and **crux**). Leading words are compact concepts already native to the model (crux, gravity problem, flow, prototype, mechanism, falsify). Reuse them as tokens throughout; never re-explain them.
2. The sentence `Write in the language the user writes in.` appears once, as its own paragraph, directly after the framing paragraph. Identical wording in every skill.
3. **Numbered H2 steps**: `## 1. <Verb phrase>`, `## 2. …`. Each step contains, in prose: what to do, the judgement that makes it non-trivial (what a lazy run gets wrong and how to get it right), and closes with a line beginning `Done when` — a completion criterion that is both **checkable** (done vs not-done is unambiguous) and **exhaustive** (it binds every item the step must produce).
4. **Interactive skills** (anything that asks the user questions): the asking step says exactly `Ask exactly one, then stop and wait for the answer.` and the loop is explicit, like steelman's steps 4–5: a "still open → next question / settled → deliver" branch. Question budgets are hard numbers, paired with a stop-as-soon-as-you-have-enough rule.
5. **Final deliverable**: the last step lists what to output as a bold-labelled bullet list (`- **Verdict** — …`), in the order the source specifies, with one line each saying what the item must contain.
6. **Missing input**: if the user invokes the skill with no argument or too little, ask one question for the missing piece and stop. Say this in one sentence where it matters (usually step 1).
7. Headings go no deeper than H2. Tables only where the skill's own output requires one. No emoji. No closing pep talk.

## Fidelity — the hard rule

When rewriting from a source prompt, every requirement survives: every numbered item, every rule, every output artifact, every numeric limit, every ordering of the final output, every persona stance. You may reorganise, merge, and add the judgement guidance the source implies. You may not drop or weaken. Read the source twice and tick each requirement off against the draft before finishing.

Lengths given in Chinese characters (字) keep the source figure and add the English-word equivalent at roughly 0.6 words per character (e.g. "about 10,000 characters if the user writes Chinese, roughly 6,000 words in English"). Named artifacts keep their original title beside the English one (e.g. Personal Talent Manual — 《个人天赋使用说明书》).

## Density

- steelman is ~60 lines. Target 45–90; only a skill carrying a mandated question flow plus a long output spec (life-design) may run longer.
- Every sentence must change behaviour versus what the model would do anyway. Delete no-ops whole ("be thorough", "be careful", "think step by step").
- State the target behaviour positively. A prohibition appears only as a hard guardrail that cannot be phrased positively, and then it sits beside the positive target.
- One source of truth per meaning: say a rule once, in the step where it bites.
- Anything the model can look up (files, tools, the web) it looks up. Where the skill requires research, name `WebSearch`/`WebFetch` as the means and say what to do when a claim cannot be verified.

## Voice

Second-person-implied imperatives ("Build the strongest case…", "Ask the single question…"). Crisp, declarative, concrete. Skills are written in English; British or American spelling is fine but be consistent within a file (steelman is British). No adjective stacks, no hedging, no meta-commentary about the skill itself.

## Before opening a PR

- Frontmatter parses, keys in the order above, `name` equals the directory name.
- `npx skills add <path-to-your-clone> --list` discovers the new skill.
- Smoke-run it: from a temp project whose `.claude/skills` symlinks to `skills/`, run `claude -p "/<name> <realistic input>"` and check the first turn behaves as written (an interactive skill asks exactly one question and stops).
- Update the README: the skill table and a usage block, in both the English and 中文 sections.
