import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function markdownBlocks(markdown) {
  const blocks = [];
  const headingPath = [];
  let paragraph = [];
  let paragraphLine = 1;
  let lineNumber = 0;
  let fence = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({
        text: paragraph.join(' ').trim(),
        headings: headingPath.map(({ text }) => text).join(' '),
        line: paragraphLine,
      });
      paragraph = [];
    }
  };

  for (const line of markdown.split(/\r?\n/)) {
    lineNumber += 1;
    const trimmed = line.trim();
    const fenceMatch = trimmed.match(/^(```+|~~~+)/);
    if (fenceMatch) {
      flushParagraph();
      if (!fence) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;

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

    if (trimmed.startsWith('|')) {
      flushParagraph();
      blocks.push({ text: trimmed, headings: headingPath.map(({ text }) => text).join(' '), line: lineNumber });
      continue;
    }

    if (!paragraph.length) paragraphLine = lineNumber;
    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

export function findViolations(markdown, file = '<fixture>') {
  const violations = [];
  for (const block of markdownBlocks(markdown)) {
    const sentences = block.text.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      const scope = `${block.headings} ${sentence}`;
      if (/\bworkforce\b/i.test(scope)) {
        const threeAgentsOrBots = /\b(?:three|3)\b.{0,30}\b(?:hosted\s+)?(?:AI\s+)?(?:agents?|bots?|boxes)\b/i.test(sentence);
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

      if (/\bstarter\b/i.test(sentence)) {
        const zeroIntegrations = /\b(?:0|zero|no)\s+(?:connected\s+)?integrations?\b|\bintegrations?\s*[:=]\s*(?:0|zero)\b/i.test(sentence);
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
      if (/\benterprise\b/i.test(sentence) && fixedDollarFigure.test(sentence)) {
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
  const controls = [
    {
      label: 'unqualified three-agent Workforce copy',
      code: 'workforce-three-agents-without-legacy-qualifier',
      markdown: '## Workforce\n\nThe current Workforce price includes three hosted AI Bots.',
    },
    {
      label: 'Starter with zero integrations',
      code: 'starter-zero-integrations',
      markdown: '## Starter\n\nStarter has 0 integrations.',
    },
    {
      label: 'fixed Enterprise dollar price',
      code: 'fixed-enterprise-dollar-price',
      markdown: '## Enterprise\n\nEnterprise starts at $299 per month.',
    },
  ];

  for (const control of controls) {
    const detected = findViolations(control.markdown).some(({ code }) => code === control.code);
    if (!detected) throw new Error(`Negative control did not reject ${control.label}`);
    console.log(`PASS negative control: rejects ${control.label}`);
  }

  const legacyCopy = [
    '## Workforce',
    '### Companies that subscribed earlier',
    'Companies that subscribed to Workforce before per-box billing took effect keep three included boxes.',
  ].join('\n\n');
  if (findViolations(legacyCopy).length) {
    throw new Error('Positive control rejected the legacy-qualified three-box statement');
  }
  console.log('PASS positive control: permits the earlier-price grandfather statement');
}

function main() {
  runNegativeControls();
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
