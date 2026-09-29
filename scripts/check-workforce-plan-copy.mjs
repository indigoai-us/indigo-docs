import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function splitTableRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return splitTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

function markdownBlocks(markdown) {
  const blocks = [];
  const headingPath = [];
  let paragraph = [];
  let paragraphLine = 1;
  let tableRows = [];
  let tableStartLine = 1;
  let lineNumber = 0;
  let fence = null;

  const headings = () => headingPath.map(({ text }) => text).join(' ');
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ text: paragraph.join(' ').trim(), headings: headings(), line: paragraphLine, tableScoped: false });
      paragraph = [];
    }
  };
  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.map(splitTableRow);
    const header = rows[0];
    const dataStart = rows.length > 1 && isTableSeparator(tableRows[1]) ? 2 : 1;
    const planIndices = header.flatMap((cell, index) =>
      /\bstarter\b|\bworkforce\b|\benterprise\b/i.test(cell) ? [index] : []);
    const planColumnIndex = header.findIndex((cell) => /\b(?:plan|tier|subscription)\b/i.test(cell));

    if (planIndices.length) {
      for (const row of rows.slice(dataStart)) {
        for (const planIndex of planIndices) {
          const rowLabel = row.filter((_, index) => !planIndices.includes(index)).join(' ');
          const value = row[planIndex] ?? '';
          blocks.push({
            text: [header[planIndex], rowLabel, value].filter(Boolean).join(' '),
            headings: headings(),
            line: tableStartLine,
            tableScoped: true,
          });
        }
      }
    } else if (planColumnIndex >= 0) {
      for (const row of rows.slice(dataStart)) {
        const planName = row[planColumnIndex] ?? '';
        if (!/\b(?:starter|workforce|enterprise)\b/i.test(planName)) continue;
        for (let index = 0; index < row.length; index += 1) {
          if (index === planColumnIndex) continue;
          blocks.push({
            text: [planName, header[index] ?? '', row[index] ?? ''].filter(Boolean).join(' '),
            headings: headings(),
            line: tableStartLine,
            tableScoped: true,
          });
        }
      }
    } else {
      for (const row of rows.slice(dataStart)) {
        blocks.push({ text: row.join(' '), headings: headings(), line: tableStartLine, tableScoped: true });
      }
    }
    tableRows = [];
  };

  for (const line of markdown.split(/\r?\n/)) {
    lineNumber += 1;
    const trimmed = line.trim();
    const fenceMatch = trimmed.match(/^(```+|~~~+)/);
    if (fenceMatch) {
      flushParagraph();
      flushTable();
      if (!fence) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;

    if (trimmed.startsWith('|')) {
      flushParagraph();
      if (!tableRows.length) tableStartLine = lineNumber;
      tableRows.push(line);
      continue;
    }
    flushTable();

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      while (headingPath.length && headingPath.at(-1).level >= level) headingPath.pop();
      headingPath.push({ level, text: heading[2] });
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (!paragraph.length) paragraphLine = lineNumber;
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushTable();
  return blocks;
}

export function findViolations(markdown, file = '<fixture>') {
  const violations = [];
  for (const block of markdownBlocks(markdown)) {
    const sentences = block.text.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      const scope = `${block.headings} ${sentence}`;
      if (/\bworkforce\b/i.test(scope)) {
        const threeAgentsOrBots = /\b(?:three|3)\b.{0,30}\b(?:hosted\s+)?(?:AI\s+)?(?:agents?|bots?|boxes)\b|\b(?:hosted\s+)?(?:AI\s+)?(?:agents?|bots?|boxes)\b.{0,30}\b(?:three|3)\b/i.test(sentence);
        const inclusionClaim = /\b(?:include[sd]?|including|bundl(?:e|ed|es|ing)|comes?\s+with|provides?|has|keeps?)\b/i.test(sentence);
        const legacyQualifier = /\b(?:legacy|grandfather(?:ed|ing)?|earlier\s+(?:workforce\s+)?(?:price|plan|subscription)|previous\s+price|before\s+per[ -]box\s+billing|subscribed\b.{0,30}\b(?:earlier|before))\b/i.test(`${block.headings} ${sentence}`);
        if (threeAgentsOrBots && inclusionClaim && !legacyQualifier) {
          violations.push({
            code: 'workforce-three-agents-without-legacy-qualifier',
            file,
            line: block.line,
            message: 'three included Workforce agents/Bots must be scoped to the earlier price',
          });
        }
      }

      if (/\bstarter\b/i.test(scope)) {
        const zeroIntegrations = /\b(?:0|zero|no)\s+(?:connected\s+)?integrations?\b|\bintegrations?\s*(?:(?:are|is)\s*)?(?::|=|set\s+to)?\s*(?:0|zero|none|no)\b/i.test(sentence);
        if (zeroIntegrations) {
          violations.push({
            code: 'starter-zero-integrations',
            file,
            line: block.line,
            message: 'Starter copy must not say it has zero integrations',
          });
        }
      }

      const fixedDollarFigure = /(?:\$\s*\d[\d,]*(?:\.\d{1,2})?|\bUSD\s*\d[\d,]*(?:\.\d{1,2})?|\d[\d,]*(?:\.\d{1,2})?\s*USD\b)/i;
      const priceScopes = block.tableScoped ? [scope] : scope.split(/\b(?:while|whereas|but)\b|;/i);
      if (priceScopes.some((priceScope) => /\benterprise\b/i.test(priceScope) && fixedDollarFigure.test(priceScope))) {
        violations.push({
          code: 'fixed-enterprise-dollar-price',
          file,
          line: block.line,
          message: 'Enterprise copy must not give a fixed dollar price',
        });
      }
    }
  }
  return violations;
}

function walkMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(fullPath);
    return /\.mdx?$/.test(entry.name) ? [fullPath] : [];
  });
}

function runNegativeControls() {
  const failures = [];
  const columnPlanTable = [
    '| Feature | Starter | Workforce | Enterprise |',
    '| --- | --- | --- | --- |',
    '| Integrations | 0 integrations | 1 integration | Custom |',
    '| Included hosted agents | 0 | 3 AI Bots | Custom |',
    '| Monthly price | Free | $500 | $299 |',
  ].join('\n');
  const controls = [
    {
      label: 'unqualified three-agent Workforce copy in a comparison table',
      code: 'workforce-three-agents-without-legacy-qualifier',
      markdown: columnPlanTable,
    },
    {
      label: 'Starter with zero integrations in a comparison table',
      code: 'starter-zero-integrations',
      markdown: columnPlanTable,
    },
    {
      label: 'fixed Enterprise dollar price in a comparison table',
      code: 'fixed-enterprise-dollar-price',
      markdown: columnPlanTable,
    },
    {
      label: 'Starter zero integrations scoped by its heading',
      code: 'starter-zero-integrations',
      markdown: '## Starter\n\nNo integrations.',
    },
    {
      label: 'Enterprise price scoped by its heading',
      code: 'fixed-enterprise-dollar-price',
      markdown: '## Enterprise\n\nStarts at $299 per month.',
    },
  ];

  for (const control of controls) {
    const detected = findViolations(control.markdown).some(({ code }) => code === control.code);
    if (detected) console.log(`PASS negative control: rejects ${control.label}`);
    else {
      console.error(`FAIL negative control: did not reject ${control.label}`);
      failures.push(control.label);
    }
  }

  const legacyCopy = [
    '## Workforce',
    '### Companies that subscribed earlier',
    'Companies that subscribed to Workforce before per-box billing took effect keep three included boxes.',
  ].join('\n\n');
  if (findViolations(legacyCopy).length) {
    console.error('FAIL positive control: rejected the earlier-price grandfather statement');
    failures.push('legacy-qualified three-box statement');
  } else {
    console.log('PASS positive control: permits the earlier-price grandfather statement');
  }

  const accurateComparisons = [
    'Workforce costs $500 per month, while Enterprise uses custom pricing.',
    'Enterprise uses custom pricing; Workforce costs $500 per month.',
  ];
  if (accurateComparisons.some((copy) => findViolations(copy).some(({ code }) => code === 'fixed-enterprise-dollar-price'))) {
    console.error('FAIL positive control: misattributed Workforce price to Enterprise');
    failures.push('Workforce/Enterprise price comparison');
  } else {
    console.log('PASS positive control: does not attribute the Workforce price to Enterprise');
  }
  return failures;
}

function checkWorkflowConcurrency() {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const workflow = readFileSync(path.join(repositoryRoot, '.github/workflows/docs-smoke.yml'), 'utf8');
  const perPullRequestGroup = /^\s*group:\s*docs-smoke-\$\{\{\s*github\.event\.pull_request\.number\s*\|\|\s*github\.ref\s*\}\}\s*$/m.test(workflow);
  if (perPullRequestGroup) console.log('PASS: docs smoke concurrency isolates pull requests');
  else console.error('FAIL: docs smoke concurrency must isolate pull requests by number and fall back to ref');
  return perPullRequestGroup;
}

function main() {
  const selfTestFailures = runNegativeControls();
  if (!checkWorkflowConcurrency()) selfTestFailures.push('pull-request CI concurrency');
  if (selfTestFailures.length) throw new Error(`Negative control or workflow checks failed: ${selfTestFailures.join(', ')}`);
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const contentRoot = path.join(repositoryRoot, 'src/content/docs');
  const files = walkMarkdownFiles(contentRoot);
  const violations = files.flatMap((file) => findViolations(readFileSync(file, 'utf8'), path.relative(repositoryRoot, file)));

  if (violations.length) {
    for (const violation of violations) {
      console.error(`FAIL ${violation.file}:${violation.line}: ${violation.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`PASS: checked ${files.length} Workforce and plan-copy pages; no stale statements found`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
