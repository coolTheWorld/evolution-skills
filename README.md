# evolution-skills

[中文](#中文说明) | English

Eleven agent skills for thinking better, one per method: clarify the question, learn something new, solve the problem, decide, and know yourself. Each skill turns a proven prompt into a workflow the agent runs step by step — with a completion bar on every step — instead of a paragraph it can skim.

Works with Claude Code, Cursor, and any other agent that reads `SKILL.md`.

## Install

```bash
# all eleven skills
npx skills add coolTheWorld/evolution-skills

# just one
npx skills add coolTheWorld/evolution-skills --skill socratic
```

To install by hand, copy `skills/<name>/SKILL.md` into `~/.claude/skills/<name>/SKILL.md`.

Every skill is **user-invoked** (`disable-model-invocation: true`): in Claude Code the agent never fires one on its own, so they cost no context until you type the name. Invoke with `/<name>` followed by the thing you want it applied to.

## The skills

| Phase | Skill | What it does |
| --- | --- | --- |
| Ask | [`socratic`](skills/socratic/SKILL.md) | Socratic diagnosis, one question at a time, until the question actually worth answering surfaces |
| Learn | [`two-layer-explain`](skills/two-layer-explain/SKILL.md) | Explain a concept twice — layperson and expert — then map one to the other and test understanding |
| Learn | [`deconstruct`](skills/deconstruct/SKILL.md) | Reverse-engineer why a great piece of work works, and extract what transfers |
| Learn | [`two-axis-research`](skills/two-axis-research/SKILL.md) | Deep research on two axes — how it got here (history) and how it compares (landscape) — into a sourced report |
| Learn | [`fact-check`](skills/fact-check/SKILL.md) | Split a claim into facts, inferences, and values; verify the facts; audit the reasoning |
| Solve | [`first-principles`](skills/first-principles/SKILL.md) | Strip a problem to bedrock facts, goal, and constraints, then re-derive the path |
| Solve | [`cross-domain`](skills/cross-domain/SKILL.md) | Abstract the problem, find the same structure in distant fields, borrow their mechanisms |
| Decide | [`steelman`](skills/steelman/SKILL.md) | Steelman both sides of a decision, isolate the crux, and drive to a verdict |
| Decide | [`min-experiment`](skills/min-experiment/SKILL.md) | Replace deliberation with a minimum experiment that tests the assumption that matters most |
| Know yourself | [`hidden-talents`](skills/hidden-talents/SKILL.md) | A guided interview that reconstructs your underlying talents into a personal talent manual |
| Know yourself | [`life-design`](skills/life-design/SKILL.md) | A guided interview in the Stanford *Designing Your Life* method, ending in three five-year plans and prototypes |

The one method from the same family that is **not** here is the expert panel (专家会诊): it is implemented as `/storm:discuss` in [stanford-oval-storm-skills](https://github.com/coolTheWorld/stanford-oval-storm-skills).

## Use them

### Ask

**`/socratic`** — when what you are asking is probably not what you want answered. The agent holds all advice, asks at most six questions (one per turn, each prefaced by what your last answer changed), then hands back the original question, the real problem, confirmed facts, unverified assumptions, the key variable, and one precise new question. It gives its judgement only after you confirm that question.

```
/socratic  our onboarding conversion dropped 30% after the redesign and I think it's the new pricing page
```

### Learn

**`/two-layer-explain`** — a concept you do not understand. Layer one uses everyday language and one concrete example; layer two uses exact terms and covers mechanism, boundaries, and common misconceptions. Ends with a layperson→technical mapping, the places you are most likely to get it wrong, and three questions that a memorised analogy cannot answer.

```
/two-layer-explain  MVCC in Postgres
```

**`/deconstruct`** — a finished piece of work you admire (a page, a plan, a dashboard, a process) and what you want to learn from it. Ends with 3–5 reusable rules, a checklist you can follow, and one small exercise to try first.

```
/deconstruct  https://example.com/pricing — I want to learn how they structure the tiers
```

**`/two-axis-research`** — a product, company, person, technology, industry, or event you want to understand systematically. Vertical axis: origin, turning points, and which early choices became today's capabilities or baggage. Horizontal axis: the comparators worth comparing, on uniform dimensions, and why the market picks or drops it. The two axes cross into three future paths with their preconditions and warning signals. Primary sources, dated citations, facts kept apart from inferences and opinions; a long report (10,000–30,000 characters in Chinese, roughly 6,000–18,000 words in English). Pair it with your platform's deep-research mode.

```
/two-axis-research  DuckDB
```

**`/fact-check`** — a claim, a statistic, an opinion, or a plan. Facts get one of five verdicts (verified / holds but narrower / disputed / insufficient evidence / wrong); the reasoning is checked for hidden assumptions, correlation-as-causation, and missing alternatives. Ends with the strongest repaired version and how far you can trust it.

```
/fact-check  "remote teams ship 20% slower than co-located ones"
```

### Solve

**`/first-principles`** — a problem that has been patched over so many times the patches are the problem. Separates unavoidable facts, unverified habitual assumptions, the real goal, and the real constraints, then re-derives a path from the facts alone. Ends with what in the current plan is surface repair, the new path, its premises, and the first step to verify it.

```
/first-principles  our deploy pipeline takes 45 minutes and every fix has added another stage
```

**`/cross-domain`** — a problem your field seems unable to solve. Strips the jargon, finds the underlying structure and core tension, then looks for the same structure in history and in at least three distant fields. Ends with the three mechanisms most worth borrowing, translated to your situation, and one low-cost reversible experiment.

```
/cross-domain  reviewers rubber-stamp PRs because the queue is always full
```

### Decide

**`/steelman`** — two options and you keep flip-flopping. Restates the real decision, argues the strongest case for *and* against, finds the **crux** — the one variable whose value flips the verdict — and asks you one question per turn until it is settled. Then a verdict with reasons and next actions.

```
/steelman  should we move off Postgres onto DynamoDB?
```

**`/min-experiment`** — a decision that more thinking will not clarify. Finds the three assumptions behind it, picks the one most likely to change the outcome, and designs a low-cost, reversible experiment you can finish in 7 days (or a cycle you set): what to do, what it costs, what to measure, what says continue, what says stop, what you will know afterwards — and the first action for tomorrow.

```
/min-experiment  quitting to build the side project full-time
```

### Know yourself

**`/hidden-talents`** — a 30-minute-plus interview (up to ten main questions, one per turn) that digs through what you did obsessively before sixteen, what feels too easy to need learning, what leaves you tired but lit up, and whom you have envied. Ends with a personal talent manual (~10,000 characters in Chinese, roughly 6,000 words in English): the talents with their evidence chains, their shadow sides, your energy map, environments that help or hurt, working and career fits, and 30 days of experiments.

```
/hidden-talents
```

**`/life-design`** — an interview in four phases (six to nine main questions): where you are, your compass (workview vs lifeview), wayfinding through flow moments, and getting unstuck. Separates gravity problems you must accept from problems you can design. Ends with a life design blueprint (8,000–12,000 characters in Chinese, roughly 5,000–7,000 words in English) built around three genuinely different five-year Odyssey plans, plus prototypes you can start this week.

```
/life-design
```

The two interviews are long by design. Answer concretely and keep going — the output is only as good as the stories you put in.

## How the skills are written

Each `SKILL.md` is a numbered workflow. Every step states what to do, the judgement that makes it hard, and a `Done when` line that tells the agent when it can move on. Interactive skills ask exactly one question per turn and hold their verdict until the deciding variable is settled. Every skill writes in the language you write in. The full conventions — frontmatter, step shape, fidelity rules, and the pre-PR checklist — are in [HOUSE-STYLE.md](HOUSE-STYLE.md).

## Credits

The methods are adapted from [this article](https://mp.weixin.qq.com/s/NAdhdFrUq9-BKelqzqpwBQ) by [Khazix](https://github.com/KKKKhazix). The prompts there are written for chat; this repo rewrites them as agent workflows.

## License

Apache-2.0

---

# 中文说明

[English](#evolution-skills) | 中文

十一个帮助你把事情想清楚的 agent skill，每个对应一种方法：问清问题、学习新东西、解决问题、做决定、认识自己。每个 skill 把一条经过验证的 Prompt 改写成 agent 逐步执行的工作流——每一步都有完成标准——而不是一段可以一扫而过的文字。

适用于 Claude Code、Cursor，以及任何能读取 `SKILL.md` 的 agent。

## 安装

```bash
# 安装全部十一个
npx skills add coolTheWorld/evolution-skills

# 只装一个
npx skills add coolTheWorld/evolution-skills --skill socratic
```

手动安装：把 `skills/<name>/SKILL.md` 复制到 `~/.claude/skills/<name>/SKILL.md`。

所有 skill 都是**手动触发**（`disable-model-invocation: true`）：在 Claude Code 中 agent 不会自己调用它们，不占上下文；需要时输入 `/<name>` 加上你要处理的内容。

## Skill 一览

| 阶段 | Skill | 作用 |
| --- | --- | --- |
| 问清问题 | [`socratic`](skills/socratic/SKILL.md) | 苏格拉底式问诊，每次一个问题，直到找出真正值得回答的问题 |
| 学习 | [`two-layer-explain`](skills/two-layer-explain/SKILL.md) | 双层解释法：小白版 + 专业版，再对照术语、检验理解 |
| 学习 | [`deconstruct`](skills/deconstruct/SKILL.md) | 反向拆解：拆出优秀成品为什么有效，提炼可迁移的规律 |
| 学习 | [`two-axis-research`](skills/two-axis-research/SKILL.md) | 横纵分析法：纵看它怎么走到今天，横看它和竞品的差别，输出可追溯的深度研究报告 |
| 学习 | [`fact-check`](skills/fact-check/SKILL.md) | 事实核查：拆成事实 / 推论 / 价值判断，联网核查事实，审查推理链 |
| 解决问题 | [`first-principles`](skills/first-principles/SKILL.md) | 第一性原理：拆回基本事实、目标和约束，重新推导路径 |
| 解决问题 | [`cross-domain`](skills/cross-domain/SKILL.md) | 跨领域借解：抽象问题结构，在相距较远的领域里找同构解法 |
| 决策 | [`steelman`](skills/steelman/SKILL.md) | 双向钢人论证：为两边各建最强论证，找到 crux，给出裁决 |
| 决策 | [`min-experiment`](skills/min-experiment/SKILL.md) | 用最小实验替代空想：找出最关键的假设，设计低成本可逆的实验 |
| 认识自己 | [`hidden-talents`](skills/hidden-talents/SKILL.md) | 挖掘隐藏天赋：多轮深度问诊，生成《个人天赋使用说明书》 |
| 认识自己 | [`life-design`](skills/life-design/SKILL.md) | 人生设计术：斯坦福人生设计方法，生成三个五年版本和原型行动 |

同一体系里唯一**不在**本仓库的方法是专家会诊：它已实现为 [stanford-oval-storm-skills](https://github.com/coolTheWorld/stanford-oval-storm-skills) 中的 `/storm:discuss`。

## 使用

### 问清问题

**`/socratic`** —— 当你嘴上问的和心里想问的可能不是一回事。agent 先不给建议，最多问 6 个问题（每次一个，提问前先说一句上一条回答让它更新了什么判断），然后整理出：最开始的问题、真正想解决的问题、已确认的事实、仍未验证的假设、最可能改变结论的关键变量，以及一个准确、具体、可以继续行动的新问题。等你确认这个新问题后，才给出判断、理由和下一步行动。

```
/socratic  改版之后新用户转化掉了 30%，我觉得是新定价页的问题
```

### 学习

**`/two-layer-explain`** —— 一个完全听不懂的概念。第一层小白版：生活化语言加一个具体例子；第二层专业版：准确术语，讲清核心机制、适用边界和常见误解。最后给出小白说法与专业术语的对应关系、最容易理解错的地方，以及 3 个靠背类比答不出来的检验问题。

```
/two-layer-explain  Postgres 的 MVCC
```

**`/deconstruct`** —— 一个你想模仿学习的优秀成品（页面、方案、看板、流程）和你想从中学到什么。最后给出 3 到 5 条可复用规律、一份可以照着执行的操作清单，以及一个最值得先尝试的小练习。

```
/deconstruct  https://example.com/pricing —— 我想学它是怎么设计定价档位的
```

**`/two-axis-research`** —— 想系统研究的产品、公司、人物、技术、行业或事件。纵轴：诞生背景、重要转折、哪些早期选择变成了今天的能力或包袱。横轴：最值得比较的对象、统一维度的对比、市场为什么选它又为什么放弃它。两轴交叉，推出未来最可能的 3 条路径及其前提和预警信号。优先一手来源、就近标注来源与日期、事实与推断与观点分开写；报告 10000～30000 字。建议配合平台的深度研究功能使用。

```
/two-axis-research  DuckDB
```

**`/fact-check`** —— 一个说法、一个数据、一个观点或一份方案。事实部分逐条联网核查并标记五档之一（已证实 / 基本成立但需收窄 / 存在争议 / 证据不足 / 明显错误）；推理部分检查隐藏假设、相关与因果的混淆、遗漏的解释。最后给出补强后的最合理版本，以及你目前可以相信到什么程度。

```
/fact-check  "远程团队的交付速度比坐在一起的团队慢 20%"
```

### 解决问题

**`/first-principles`** —— 一个补丁打到补丁本身成了问题的方案。区分无法绕开的基本事实、习惯性接受却没验证过的假设、真正的目标和现实约束，只从事实出发重新推导。最后给出原方案里只在修补表面的部分、新路径、它成立的前提，以及验证它的第一步。

```
/first-principles  我们的部署流水线要跑 45 分钟，每次修问题都又加了一段
```

**`/cross-domain`** —— 在本行业里似乎无解的问题。剥掉行业术语，找出底层结构和核心矛盾，再到历史案例和至少 3 个相距较远的领域里找同构问题。最后选出最值得借用的 3 种机制，翻译成适合你处境的方案，并推荐一个低成本、可逆的实验。

```
/cross-domain  评审队列永远是满的，所以 reviewer 都在走过场
```

### 决策

**`/steelman`** —— 两个选项来回摇摆。先重述你真正要做的选择，为两边各建立最强论证，找出 **crux**——那个一旦翻转结论就翻转的变量——每轮只问你一个问题，直到 crux 落定，再给出裁决、理由和下一步行动。

```
/steelman  要不要从 Postgres 迁到 DynamoDB？
```

**`/min-experiment`** —— 继续纸上谈兵也不会更清楚的决定。找出背后最需要验证的 3 个假设，选出最可能改变结论的那一个，围绕它设计一个低成本、可逆、7 天内（或你定的周期）能完成的最小实验：做什么、投入多少、观察什么指标、什么结果支持继续、什么结果提醒停止、结束后能获得什么新信息——以及明天就能开始的第一个动作。

```
/min-experiment  辞职全职做副业项目
```

### 认识自己

**`/hidden-talents`** —— 半小时以上的问诊（最多 10 个主问题，每次一个），从 16 岁以前废寝忘食做的事、"这还需要学吗"的无意识胜任区、身体累但精神亢奋的事、以及你嫉妒过的人里，挖出被忽视或压抑的天赋。最后输出一万字左右的《个人天赋使用说明书》：每项天赋及其经历链、天赋的阴影面、能量地图、最容易发挥和失效的环境、适合的工作与职业方向，以及接下来 30 天的低成本实验。

```
/hidden-talents
```

**`/life-design`** —— 四个阶段的问诊（6 到 9 个主问题）：你在这里、你的指南针（工作观 vs 人生观）、寻路（心流时刻）、摆脱困境。区分必须接受的重力问题和可以动手设计的真问题。最后输出 8000 到 12000 字的《个人人生设计蓝图》，核心是三个完全不同的五年奥德赛计划，以及本周就能开始的原型行动。

```
/life-design
```

这两个问诊交互时间都比较长，是有意为之。回答得越真实、越具体，最后得到的东西就越有用——一定要坚持下去。

## Skill 的写法

每个 `SKILL.md` 都是一条编号的工作流。每一步写清要做什么、难点在哪、以及一行 `Done when` 告诉 agent 什么时候才算做完可以往下走。交互型 skill 每轮只问一个问题，在关键变量落定之前不给结论。所有 skill 都用你使用的语言回复。完整规范（frontmatter、步骤写法、忠实度规则、提 PR 前的检查清单）见 [HOUSE-STYLE.md](HOUSE-STYLE.md)。

## 致谢

这些方法改编自 [Khazix](https://github.com/KKKKhazix) 的[这篇文章](https://mp.weixin.qq.com/s/NAdhdFrUq9-BKelqzqpwBQ)。原文中的 Prompt 面向聊天场景；本仓库把它们改写为 agent 工作流。

## 许可证

Apache-2.0
