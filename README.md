# steelman

An agent skill that refuses to answer a decision until it has argued both sides properly.

Most answers fail at the framing, not the reasoning. This skill makes the agent restate your real problem, build the strongest case *for* and *against* your position, find the **crux** — the one variable whose value flips the conclusion — and then ask you one question at a time until that crux is settled. Only then does it rule.

## Install

```bash
npx skills add coolTheWorld/steelman-skill
```

Works with Claude Code, Cursor, and any other agent that reads `SKILL.md`. To install by hand, copy `SKILL.md` into `~/.claude/skills/steelman/SKILL.md`.

## Use it

Invoke it by name, or just describe the situation — the skill is model-invoked, so the agent reaches for it on its own:

```
/steelman  should we move off Postgres onto DynamoDB?
```

```
Don't assume I've thought this through — steelman both sides first.
```

```
I'm about to commit to rewriting the auth layer. Argue me out of it.
```

## How it runs

| Step | What the agent does | Done when |
| --- | --- | --- |
| 1. Restate | Rebuilds your problem in a stronger, more complete form | It names the goal, the fixed constraints, and the win condition |
| 2. Steelman | Argues the strongest case for **and** against | Neither side is a strawman; each rests on premises the other concedes |
| 3. Isolate the crux | Finds where the cases actually diverge, ranks the deciding variables | Each crux reads *if X → A, if Y → B* |
| 4. Ask | Puts **one** question to you — the one that moves the verdict most, with its own recommended answer | You answer |
| 5. Rule | Crux still open → next question. Crux settled → verdict, reasons, next actions | The verdict cites the crux value that decided it |

The loop in step 4–5 is the point: the agent keeps the verdict held while the crux is unresolved, and asks one question per turn rather than burying you in a questionnaire.

## License

Apache-2.0
