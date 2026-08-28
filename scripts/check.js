#!/usr/bin/env node
// Checks for evolution-skills — HOUSE-STYLE.md as executable assertions.
// Usage: node scripts/check.js [--selftest]
//   (no args)    every mechanical rule from HOUSE-STYLE.md: milliseconds, zero tokens
//   --selftest   additionally prove the checker can fail (injects violations into a
//                temp copy of the repo and asserts that copy's run goes red)
// Node built-ins only — no package.json, no dependencies. CI runs the same command
// (.github/workflows/check.yml); run it locally before opening a PR.
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

const argv = process.argv.slice(2);
const SELFTEST = argv.includes('--selftest');
const unknownArgs = argv.filter((a) => a !== '--selftest');
if (unknownArgs.length) {
  console.error(`unknown argument(s): ${unknownArgs.join(' ')}`);
  process.exit(2);
}

let fails = 0;
const pass = (m) => console.log(`PASS  ${m}`);
const fail = (m) => { console.log(`FAIL  ${m}`); fails += 1; };
const check = (ok, m) => (ok ? pass(m) : fail(m));
const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
const listing = (arr) => (arr.length ? ` — ${arr.join(', ')}` : '');
const sameSet = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');

process.chdir(ROOT);

// --- HOUSE-STYLE.md, as constants -------------------------------------------------
const FRONTMATTER_KEYS = ['name', 'description', 'argument-hint', 'disable-model-invocation', 'license'];
const LANGUAGE_LINE = 'Write in the language the user writes in.';
const ASK_ONE = 'Ask exactly one, then stop and wait for the answer.';
const MIN_LINES = 45;
const MAX_LINES = 90;
// "only a skill carrying a mandated question flow plus a long output spec (life-design) may run longer"
const EXEMPT_FROM_MAX = ['life-design'];
// Skills that ask the user questions. A script cannot infer this from prose, so the
// list is declared: a new interactive skill is added here in the same PR.
const INTERACTIVE = ['socratic', 'steelman', 'hidden-talents', 'life-design'];
const WORKFLOWS = ['check.yml', 'claude-code-review.yml', 'claude.yml'];
// The plugin coordinate. It is what gives every skill its `/evolution:<name>` form,
// so the manifests, the README usage blocks and the CI install test must all agree.
const PLUGIN = 'evolution';
const MARKETPLACE = 'evolution-skills';
// A skill is 45-90 lines; the parsers below are quadratic on pathological input, so cap what they see.
const MAX_BYTES = 64 * 1024;

// Emoji as a reader sees them: emoji-presentation characters, flags (regional
// indicator pairs), and the keycap / emoji-variation selectors. Text-presentation
// symbols such as © ® ™ ↔ stay allowed.
const EMOJI = /\p{Emoji_Presentation}|\p{Regional_Indicator}|⃣|️/u;

// --- helpers ----------------------------------------------------------------------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(path.relative(ROOT, p));
  }
  return out;
}
const ALL_FILES = walk(ROOT);

// Frontmatter parser for the one shape HOUSE-STYLE allows: `key: value` lines. It
// is not a YAML parser, so it refuses what a real one would refuse (the `skills`
// CLI parses this block with real YAML and silently skips a skill it cannot parse)
// and unwraps a quoted scalar the way YAML would.
// Returns { keys, map, body } or { error } when the block is missing or malformed.
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { error: 'no --- block at the top of the file' };
  const keys = [];
  const map = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const at = `line ${i + 2}`;
    const kv = line.match(/^([A-Za-z][\w-]*):(?:[ \t]+(.*))?$/);
    if (!kv) return { error: `${at}: not a \`key: value\` line (a space after the colon is required)` };
    let value = (kv[2] ?? '').trim();
    const dq = value.match(/^"(.*)"$/);
    const sq = value.match(/^'(.*)'$/);
    if (dq) {
      if (/(^|[^\\])(\\\\)*"/.test(dq[1])) return { error: `${at}: unescaped " inside a double-quoted value` };
      value = dq[1].replace(/\\(["\\])/g, '$1');
    } else if (sq) {
      if (/(^|[^'])'([^']|$)/.test(sq[1])) return { error: `${at}: lone ' inside a single-quoted value (write '' for an apostrophe, or use double quotes)` };
      value = sq[1].replace(/''/g, "'");
    } else if (/: |\s#|:$/.test(value)) {
      return { error: `${at}: unquoted value contains ": " or " #" — wrap it in quotes` };
    } else if (/^[[\]{}&*!|>'"%@`]|^[-?] /.test(value)) {
      return { error: `${at}: unquoted value opens with a YAML indicator — wrap it in quotes` };
    }
    keys.push(kv[1]);
    map[kv[1]] = value;
  }
  return { keys, map, body: m[2] };
}

// Reduce markdown to the lines that carry structure. Fenced code blocks become a
// `<fence>` sentinel line (so a fence still counts as content but never as a
// heading) and HTML comments are blanked. Line count is kept.
const FENCE = '<fence>';
function stripFences(text) {
  let open = null; // { ch, len }
  const lines = text.split(/\r?\n/).map((line) => {
    if (open === null) {
      const f = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (f && !(f[1][0] === '`' && f[2].includes('`'))) { open = { ch: f[1][0], len: f[1].length }; return FENCE; }
      return line;
    }
    const close = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
    if (close && close[1][0] === open.ch && close[1].length >= open.len) { open = null; return FENCE; }
    return '';
  });
  return lines.join('\n').replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ''));
}

const paragraphs = (text) => text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
const lineCount = (text) => text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
const count = (text, needle) => text.split(needle).length - 1;

// Everything CommonMark renders as a heading: ATX (up to three spaces of indent),
// setext underlines, and raw HTML <hN>. Returns [{ level, text }].
const CONTAINER = /^ {0,3}(?:>|[-*+]|\d{1,9}[.)])(?:[ \t]+|$)/;
function headingsOf(lines) {
  const out = [];
  lines.forEach((line, i) => {
    // ATX, including one nested in a blockquote or list item (CommonMark renders those too)
    let inner = line;
    while (CONTAINER.test(inner) && !/^ {0,3}(?:>|[-*+]|\d{1,9}[.)])[ \t]*$/.test(inner)) inner = inner.replace(CONTAINER, '');
    const atx = inner.match(/^ {0,3}(#{1,6})(?:[ \t]|$)/);
    if (atx) { out.push({ level: atx[1].length, text: line.trim() }); return; }
    // setext: an underline directly below a paragraph that is not a list, quote, table or code
    if (/^ {0,3}(=+|-+)[ \t]*$/.test(line) && i > 0 && lines[i - 1].trim() !== '') {
      let start = i - 1;
      while (start > 0 && lines[start - 1].trim() !== '') start -= 1;
      const run = lines.slice(start, i);
      const paragraph = run.every((l) => !/^ {0,3}(#|[-*+]\s|\d+[.)]\s|\||>|<)|^ {4}|^\t/.test(l) && !/^ {0,3}(=+|-+)[ \t]*$/.test(l));
      if (paragraph) out.push({ level: line.trim()[0] === '=' ? 1 : 2, text: `setext heading: ${lines[i - 1].trim()}` });
      return;
    }
    const html = line.replace(/`[^`\n]+`/g, '').match(/^ {0,3}<h([1-6])(?=[\s>/])/i);
    if (html) out.push({ level: Number(html[1]), text: `html heading: ${line.trim()}` });
  });
  return out;
}

// --- required files, no dependencies ------------------------------------------------
const REQUIRED = ['README.md', 'HOUSE-STYLE.md', 'LICENSE', 'scripts/check.js',
  '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json',
  '.codex-plugin/plugin.json', '.agents/plugins/marketplace.json',
  ...WORKFLOWS.map((w) => `.github/workflows/${w}`)];
for (const f of REQUIRED) check(fs.existsSync(f), `exists: ${f}`);

const DEP_FILES = ['package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'requirements.txt', 'pyproject.toml', 'Pipfile', 'Gemfile', 'Cargo.toml'];
const depsFound = ALL_FILES.filter((f) => DEP_FILES.includes(path.basename(f)));
check(depsFound.length === 0, `no dependency files anywhere${listing(depsFound)}`);

const ci = read('.github/workflows/check.yml') ?? '';
check(ci.includes('node scripts/check.js --selftest'), 'CI runs this script with --selftest');

// --- plugin manifests: the source of the /evolution:<name> namespace ----------------
const json = (f) => { try { return JSON.parse(read(f) ?? ''); } catch { return null; } };
const plugin = json('.claude-plugin/plugin.json');
const market = json('.claude-plugin/marketplace.json');
check(plugin !== null, 'plugin.json is valid JSON');
check(market !== null, 'marketplace.json is valid JSON');
check(plugin !== null && plugin.name === PLUGIN, `plugin name is '${PLUGIN}' (skills are invoked as /${PLUGIN}:<name>)`);
check(plugin !== null && /^\d+\.\d+\.\d+$/.test(plugin.version ?? ''), `plugin version is semver (found ${plugin && plugin.version})`);
check(plugin !== null && !plugin.hooks && !plugin.mcpServers, 'plugin.json declares no hooks and no mcpServers');
check(market !== null && market.name === MARKETPLACE, `marketplace name is '${MARKETPLACE}'`);
const entry = market && Array.isArray(market.plugins) ? market.plugins.find((e) => e.name === PLUGIN) : null;
check(entry != null && entry.source === './', `marketplace lists plugin '${PLUGIN}' with source './'`);
check(ci.includes(`claude plugin install ${PLUGIN}@${MARKETPLACE}`) && ci.includes(`codex plugin add ${PLUGIN}@${MARKETPLACE}`),
  "CI installs both plugins by the manifests' own coordinate");

// The same skills also ship as a Codex plugin, so all three manifests must name the
// same plugin at the same version — a drift would install a stale copy for one tool.
const codexPlugin = json('.codex-plugin/plugin.json');
const codexMarket = json('.agents/plugins/marketplace.json');
check(codexPlugin !== null, 'codex plugin.json is valid JSON');
check(codexMarket !== null, 'codex marketplace.json is valid JSON');
check(codexPlugin !== null && codexPlugin.name === PLUGIN, `codex plugin name is '${PLUGIN}'`);
check(codexPlugin !== null && codexPlugin.skills === './skills/', "codex plugin.json points at './skills/'");
check(codexMarket !== null && codexMarket.name === MARKETPLACE, `codex marketplace name is '${MARKETPLACE}'`);
const codexEntry = codexMarket && Array.isArray(codexMarket.plugins) ? codexMarket.plugins.find((e) => e.name === PLUGIN) : null;
check(codexEntry != null && codexEntry.source != null && codexEntry.source.source === 'local' && codexEntry.source.path === './',
  `codex marketplace lists plugin '${PLUGIN}' from './'`);
const versions = [plugin && plugin.version, codexPlugin && codexPlugin.version, codexEntry && codexEntry.version];
const versionsAgree = versions[0] != null && versions.every((v) => v === versions[0]);
check(versionsAgree, `every manifest declares the same version${versionsAgree ? ` (${versions[0]})` : ` — found ${versions.join(', ')}`}`);

// Nothing this plugin ships may execute on a user's machine: skills are prose, and
// hooks/, commands/ and .mcp.json are the component types Claude Code would run.
const EXEC_PATHS = ['hooks', 'commands', '.mcp.json', 'mcp'];
const execFound = EXEC_PATHS.filter((f) => fs.existsSync(f))
  .concat(ALL_FILES.filter((f) => /\.(py|sh)$/.test(f)));
check(execFound.length === 0, `no executable plugin components (hooks/, commands/, .mcp.json, .py, .sh)${listing(execFound)}`);

// --- skills/ ------------------------------------------------------------------------
const skillEntries = fs.existsSync('skills') ? fs.readdirSync('skills', { withFileTypes: true }) : [];
const strays = skillEntries.filter((e) => !e.isDirectory()).map((e) => e.name);
check(strays.length === 0, `skills/ contains only skill directories${listing(strays)}`);
const skills = skillEntries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
check(skills.length > 0, `skills/ holds at least one skill (${skills.length} found)`);

const unknownInteractive = INTERACTIVE.filter((s) => !skills.includes(s));
check(unknownInteractive.length === 0, `every INTERACTIVE entry is a skill${listing(unknownInteractive)}`);
const unknownExempt = EXEMPT_FROM_MAX.filter((s) => !skills.includes(s));
check(unknownExempt.length === 0, `every EXEMPT_FROM_MAX entry is a skill${listing(unknownExempt)}`);

for (const s of skills) {
  const file = `skills/${s}/SKILL.md`;
  const text = read(file);
  if (text === null) { fail(`${s}: SKILL.md exists`); continue; }
  if (text.length > MAX_BYTES) { fail(`${s}: SKILL.md is under ${MAX_BYTES / 1024} KB (${Math.round(text.length / 1024)} KB)`); continue; }

  // frontmatter — exact keys, exact order
  const fm = frontmatter(text);
  if (fm.error) { fail(`${s}: frontmatter parses — ${fm.error}`); continue; }
  const keysOk = fm.keys.join(',') === FRONTMATTER_KEYS.join(',');
  check(keysOk, `${s}: frontmatter keys are exactly [${FRONTMATTER_KEYS.join(', ')}] in that order` +
    (keysOk ? '' : ` — found [${fm.keys.join(', ')}]`));
  check(fm.map.name === s, `${s}: name equals directory name`);
  const desc = fm.map.description ?? '';
  const descBody = desc.replace(/\b(e\.g|i\.e|vs|etc|cf|No|Dr|Mr|Mrs|Ms|St)\./gi, '$1').replace(/\b[A-Z]\.(?=[A-Z]\.|\s)/g, '');
  check(desc.length > 0 && /[.!?]$/.test(desc) && !/[.!?]\s+[A-Z0-9]/.test(descBody),
    `${s}: description is one sentence`);
  check(!/(^|[.;:!?]\s+)(use (this |it )?when(ever)?|useful when|invoke when|trigger(s|ed)? when)\b/i.test(desc),
    `${s}: description has no "Use when" trigger list`);
  check(/^<.+>$/.test(fm.map['argument-hint'] ?? ''), `${s}: argument-hint is wrapped in angle brackets`);
  check(fm.map['disable-model-invocation'] === 'true', `${s}: disable-model-invocation is true`);
  check(fm.map.license === 'Apache-2.0', `${s}: license is Apache-2.0`);

  // body shape
  const paras = paragraphs(fm.body);
  const framing = paras[0] ?? '';
  check(framing.length > 0 && !/^(#|[-*+]\s|\d+[.)]\s|\||>|`{3}|~{3}|<)/.test(framing),
    `${s}: body opens with a framing paragraph, not a heading, list, quote or fence`);
  const bolds = (framing.match(/\*\*[^*\n]+\*\*/g) ?? []).length;
  check(bolds >= 1 && bolds <= 3, `${s}: framing paragraph bolds 1–3 leading words (${bolds} bold)`);
  check(paras[1] === LANGUAGE_LINE,
    `${s}: "${LANGUAGE_LINE}" is its own paragraph directly after the framing paragraph`);
  check(/^## 1\. \S/.test(paras[2] ?? ''), `${s}: step 1 follows the language line directly`);

  const struct = stripFences(fm.body);
  const lines = struct.split('\n');
  check(count(struct, LANGUAGE_LINE) === 1, `${s}: the language line appears exactly once (as instruction, not inside a fence or comment)`);
  const headings = headingsOf(lines);
  const deep = headings.filter((h) => h.level !== 2).map((h) => h.text);
  check(deep.length === 0, `${s}: headings are H2 only${listing(deep)}`);
  const h2 = headings.filter((h) => h.level === 2).map((h) => h.text);
  const numbered = h2.every((h, i) => new RegExp(`^## ${i + 1}\\. \\S`).test(h));
  check(h2.length > 0 && numbered,
    `${s}: steps are consecutively numbered H2s (## 1. …, ## 2. …)${numbered ? '' : listing(h2)}`);

  const sections = struct.split(/^(?= {0,3}## )/m).slice(1);
  const noDone = sections
    .map((sec, i) => [i + 1, sec.trim().split('\n').pop()])
    .filter(([, last]) => !/^Done when\b/.test(last))
    .map(([n]) => `step ${n}`);
  check(sections.length > 0 && noDone.length === 0, `${s}: every step closes with a "Done when" line${listing(noDone)}`);
  const finalSection = sections[sections.length - 1] ?? '';
  const bullets = finalSection.match(/^- .*$/gm) ?? [];
  const plainBullets = bullets.filter((b) => !/^- \*\*[^*\n]+\*\* — /.test(b));
  check(bullets.length > 0 && plainBullets.length === 0,
    `${s}: final step lists the deliverable as bold-labelled bullets (- **Label** — …)${listing(plainBullets.map((b) => b.slice(0, 40)))}`);

  check(!EMOJI.test(text), `${s}: no emoji`);

  const n = lineCount(text);
  if (EXEMPT_FROM_MAX.includes(s)) {
    check(n >= MIN_LINES, `${s}: ${n} lines, at least ${MIN_LINES} (exempt from the ${MAX_LINES} cap)`);
  } else {
    check(n >= MIN_LINES && n <= MAX_LINES, `${s}: ${n} lines within ${MIN_LINES}–${MAX_LINES}`);
  }

  if (INTERACTIVE.includes(s)) {
    check(struct.includes(ASK_ONE), `${s}: interactive skill contains "${ASK_ONE}" (as instruction, not inside a fence or comment)`);
  }
}

// --- README: bilingual, one table row and one usage block per skill -----------------
const readme = read('README.md') ?? '';
const zhAt = readme.search(/^# 中文说明/m);
check(zhAt !== -1, 'README has a "# 中文说明" section');
const SECTIONS = [
  ['English', stripFences(zhAt === -1 ? readme : readme.slice(0, zhAt))],
  ['中文', stripFences(zhAt === -1 ? '' : readme.slice(zhAt))],
];
for (const [label, section] of SECTIONS) {
  const rows = [];
  for (const m of section.matchAll(/^\|.*?\[`([a-z0-9-]+)`\]\((skills\/[a-z0-9-]+\/SKILL\.md)\).*\|[ \t]*$/gm)) {
    if (m[2] === `skills/${m[1]}/SKILL.md`) rows.push(m[1]);
  }
  const missingRows = skills.filter((s) => !rows.includes(s));
  const extraRows = rows.filter((s) => !skills.includes(s));
  const dupRows = [...new Set(rows.filter((r, i) => rows.indexOf(r) !== i))];
  check(sameSet(rows, skills),
    `README ${label} table lists exactly the skills in skills/` +
    (missingRows.length ? ` — missing: ${missingRows.join(', ')}` : '') +
    (extraRows.length ? ` — not a skill: ${extraRows.join(', ')}` : '') +
    (dupRows.length ? ` — listed twice: ${dupRows.join(', ')}` : ''));
  const noUsage = skills.filter((s) => !new RegExp(`^\\*\\*\`/${PLUGIN}:${s}\`\\*\\* `, 'm').test(section));
  check(noUsage.length === 0, `README ${label} section has a **\`/${PLUGIN}:<name>\`** usage block for every skill${listing(noUsage)}`);
}

// --- every relative markdown link resolves -------------------------------------------
const brokenLinks = [];
const oversized = [];
for (const f of ALL_FILES.filter((f) => f.endsWith('.md'))) {
  const raw = read(f) ?? '';
  if (raw.length > MAX_BYTES) { oversized.push(f); continue; }
  const md = stripFences(raw);
  const targets = [
    ...[...md.matchAll(/\]\(([^)\s#]+)/g)].map((m) => m[1]),               // inline links, with or without a title
    ...[...md.matchAll(/^ {0,3}\[[^\]]+\]:[ \t]*(\S+)/gm)].map((m) => m[1]), // reference definitions
  ];
  for (const target of targets) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    if (target.startsWith('/')) { brokenLinks.push(`${f} -> ${target} (absolute path; use a repo-relative one)`); continue; }
    if (!fs.existsSync(path.resolve(path.dirname(path.join(ROOT, f)), target))) brokenLinks.push(`${f} -> ${target}`);
  }
}
check(brokenLinks.length === 0, `every relative markdown link resolves${listing(brokenLinks)}`);
check(oversized.length === 0, `every markdown file is under ${MAX_BYTES / 1024} KB${listing(oversized)}`);

// --- validator self-test ----------------------------------------------------------------
// Prove the checker can fail: copy the repo, inject one violation per rule family, run
// the copy's own check.js, and assert it goes red with every expected FAIL line present.
if (SELFTEST) {
  let tmp = null;
  try { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'evolution-check-')); }
  catch (e) { fail(`selftest: cannot create a temp directory under ${os.tmpdir()} (${e.code ?? e.message})`); }
  if (tmp !== null) try {
    fs.cpSync('.', tmp, {
      recursive: true,
      filter: (src) => {
        const rel = path.relative(ROOT, src);
        return !(rel === '.git' || rel.startsWith(`.git${path.sep}`) || rel === 'node_modules');
      },
    });

    const injectionErrors = [];
    const inject = (file, transform) => {
      const p = path.join(tmp, file);
      let before;
      try { before = fs.readFileSync(p, 'utf8'); } catch (e) { injectionErrors.push(`anchor file missing: ${file} (${e.code})`); return; }
      const after = transform(before);
      if (after === before) injectionErrors.push(`injection no-oped (anchor drifted?): ${file}`);
      else fs.writeFileSync(p, after);
    };

    // [file, injection, expected FAIL line(s) — string prefix or RegExp]. One skill per
    // frontmatter injection: a frontmatter that fails to parse skips that skill's body checks.
    const cases = [
      ['skills/steelman/SKILL.md', (t) => t.replace(/^description: (.*)$/m, "description: 'Steelman the user's decision.'"),
        'FAIL  steelman: frontmatter parses — line 3: lone \' inside a single-quoted value'],
      ['skills/min-experiment/SKILL.md', (t) => t.replace(/^license: (.*)$/m, 'license:$1'),
        'FAIL  min-experiment: frontmatter parses — line 6: not a `key: value` line'],
      ['skills/cross-domain/SKILL.md', (t) => t.replace(/^(name: .*)\r?\n(description: .*)$/m, '$2\n$1'),
        'FAIL  cross-domain: frontmatter keys are exactly'],
      ['skills/cross-domain/SKILL.md', (t) => t.replace(/^name: cross-domain$/m, 'name: cross-domains'),
        'FAIL  cross-domain: name equals directory name'],
      ['skills/two-axis-research/SKILL.md', (t) => t.replace(/^argument-hint: <(.*)>$/m, 'argument-hint: $1'),
        'FAIL  two-axis-research: argument-hint is wrapped in angle brackets'],
      ['skills/life-design/SKILL.md', (t) => t.replace(/^license: Apache-2\.0$/m, 'license: MIT'),
        'FAIL  life-design: license is Apache-2.0'],
      ['skills/first-principles/SKILL.md', (t) => t.replace(/^description: (.*)\.$/m, 'description: $1. Use when stuck.'),
        ['FAIL  first-principles: description is one sentence',
          'FAIL  first-principles: description has no "Use when" trigger list']],
      ['skills/deconstruct/SKILL.md', (t) => t.replace(LANGUAGE_LINE, 'Write in English.\n\nAn extra paragraph before the steps.'),
        [`FAIL  deconstruct: "${LANGUAGE_LINE}" is its own paragraph`,
          'FAIL  deconstruct: step 1 follows the language line directly']],
      ['skills/socratic/SKILL.md', (t) => t.replace(/^## 2\. /m, ' ### 2. '),
        /FAIL {2}socratic: headings are H2 only — .*### 2\. /],
      ['skills/hidden-talents/SKILL.md', (t) => t.replace(/^(## 2\. .*)$/m, 'Big\n===\n\n$1'),
        'FAIL  hidden-talents: headings are H2 only — setext heading: Big'],
      ['skills/first-principles/SKILL.md', (t) => t.replace(/^Done when.*\r?\n/m, ''),
        'FAIL  first-principles: every step closes with a "Done when" line — step 1'],
      ['skills/two-axis-research/SKILL.md', (t) => { const i = t.lastIndexOf('\n## '); return t.slice(0, i) + t.slice(i).replace(/^- \*\*([^*\n]+)\*\* — /m, '- $1: '); },
        'FAIL  two-axis-research: final step lists the deliverable as bold-labelled bullets'],
      ['skills/socratic/SKILL.md', (t) => t.replace(/^(## 3\. .*)$/m, '> ### Source prompt\n> quoted for fidelity\n\n$1'),
        /FAIL {2}socratic: headings are H2 only — .*### 2\. [^\n]*, > ### Source prompt/],
      ['skills/life-design/SKILL.md', (t) => t.replace(/\*\*/g, ''),
        'FAIL  life-design: framing paragraph bolds 1–3 leading words (0 bold)'],
      ['skills/two-layer-explain/SKILL.md', (t) => t.replace(/^(## 1\. .*)$/m, '$1 1️⃣'),
        'FAIL  two-layer-explain: no emoji'],
      ['skills/fact-check/SKILL.md', (t) => t.replace(/\n(## 2\. )/, `\n${'\n'.repeat(40)}$1`),
        /FAIL {2}fact-check: \d+ lines within 45–90/],
      ['skills/hidden-talents/SKILL.md', (t) => t.replace(ASK_ONE, 'Ask one question and wait.'),
        'FAIL  hidden-talents: interactive skill contains'],
      ['README.md', (t) => t.replace(/^\|[^\n]*\[`socratic`\]\(skills\/socratic\/SKILL\.md\)[^\n]*\n/m, ''),
        'FAIL  README English table lists exactly the skills in skills/ — missing: socratic'],
      ['README.md', (t) => { const i = t.search(/^# 中文说明/m); return t.slice(0, i) + t.slice(i).replace(/^\*\*`\/evolution:steelman`\*\* /m, '`/evolution:steelman` '); },
        'FAIL  README 中文 section has a **`/evolution:<name>`** usage block for every skill — steelman'],
      ['.claude-plugin/plugin.json', (t) => t.replace('"name": "evolution"', '"name": "evolutions"'),
        "FAIL  plugin name is 'evolution'"],
      ['.claude-plugin/marketplace.json', (t) => t.replace('"source": "./"', '"source": "./skills"'),
        "FAIL  marketplace lists plugin 'evolution' with source './'"],
      ['.codex-plugin/plugin.json', (t) => t.replace('"name": "evolution"', '"name": "evolutions"'),
        "FAIL  codex plugin name is 'evolution'"],
      ['.agents/plugins/marketplace.json', (t) => t.replace('"version": "1.1.0"', '"version": "9.9.9"'),
        'FAIL  every manifest declares the same version — found'],
      ['HOUSE-STYLE.md', (t) => t.replace('](skills/steelman/SKILL.md)', '](skills/steelmen/SKILL.md "title")'),
        'FAIL  every relative markdown link resolves'],
      ['skills/two-layer-explain/SKILL.md', (t) => t.replace(/^disable-model-invocation: true$/m, 'disable-model-invocation: false'),
        'FAIL  two-layer-explain: disable-model-invocation is true'],
      ['skills/fact-check/SKILL.md', (t) => t.replace(/^## 2\. /m, '## 3. '),
        'FAIL  fact-check: steps are consecutively numbered H2s'],
      ['skills/cross-domain/SKILL.md', (t) => t.replace('\n## 1. ', `\n${LANGUAGE_LINE}\n\n## 1. `),
        'FAIL  cross-domain: the language line appears exactly once'],
      ['skills/socratic/SKILL.md', (t) => t.replace(/\n---\n\n/, '\n---\n\n# A title first\n\n'),
        'FAIL  socratic: body opens with a framing paragraph'],
      ['.github/workflows/check.yml', (t) => t.replace('node scripts/check.js --selftest', 'node scripts/check.js'),
        'FAIL  CI runs this script with --selftest'],
      ['scripts/check.js', (t) => t.replace("'hidden-talents', 'life-design'];", "'hidden-talents', 'life-design', 'ghost'];"),
        'FAIL  every INTERACTIVE entry is a skill — ghost'],
    ];
    for (const [file, transform] of cases) inject(file, transform);
    fs.writeFileSync(path.join(tmp, 'package.json'), '{}\n');
    fs.writeFileSync(path.join(tmp, 'skills/NOTES.md'), 'stray\n');
    fs.mkdirSync(path.join(tmp, 'skills/zzz-empty'));
    fs.mkdirSync(path.join(tmp, 'hooks'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'hooks/hooks.json'), '{"PreToolUse":[]}\n');
    const expected = [
      ...cases.flatMap((c) => c[2]),
      'FAIL  no dependency files anywhere — package.json',
      'FAIL  skills/ contains only skill directories — NOTES.md',
      'FAIL  zzz-empty: SKILL.md exists',
      'FAIL  no executable plugin components (hooks/, commands/, .mcp.json, .py, .sh) — hooks',
    ];

    let out = '';
    let status = 0;
    let spawnError = null;
    try {
      out = execFileSync(process.execPath, [path.join(tmp, 'scripts/check.js')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
      out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
      status = e.status ?? 1;
      if (e.status == null) spawnError = e.code ?? e.signal ?? String(e);
    }
    const missing = expected.filter((exp) => (exp instanceof RegExp ? !exp.test(out) : !out.includes(exp)));
    const distinct = new Set(expected.map(String)).size;
    check(injectionErrors.length === 0 && spawnError === null && status !== 0 && missing.length === 0,
      `selftest: ${distinct} injected violations turn the checker red (exit ${status})`
      + (spawnError ? ` — child did not run: ${spawnError}` : '')
      + (injectionErrors.length ? ` — ${injectionErrors.join('; ')}` : '')
      + (missing.length ? ` — not reported: ${missing.map(String).join(' | ')}` : ''));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

console.log('----');
if (fails === 0) { console.log('ALL CHECKS PASSED'); process.exit(0); }
console.log(`${fails} CHECK(S) FAILED`);
process.exit(1);
