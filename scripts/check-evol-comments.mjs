#!/usr/bin/env node
/**
 * Lint check: each level-3 heading in release notes must be immediately
 * followed by an evol HTML comment:
 *   <!-- evol: <id> -->
 *
 * H3 headings under "Compatibility breaking changes" are exempt.
 *
 * Applies to all Markdown files in docs/versions/release-notes/, except the
 * legacy versions listed in EXCLUDED_RELEASE_NOTES (remove entries as they
 * become compliant).
 *
 * Usage:
 *   node ./scripts/check-evol-comments.mjs
 *   node ./scripts/check-evol-comments.mjs --severity=error
 *   node ./scripts/check-evol-comments.mjs --severity=warn
 *
 * --severity=error (default): print errors and exit 1
 * --severity=warn: print warnings and exit 0
 *
 * Called from `npm run lint`, which is also used by `npm run build` / `start`.
 */
import {readdirSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {unified} from 'unified';
import remarkParse from 'remark-parse';

const RELEASE_NOTES_DIR = 'docs/versions/release-notes';
const EXEMPT_UNDER = 'Compatibility breaking changes';
const EVOL_PATTERN = /evol:\s*\S+/i;

/** Basenames (without .md) not yet required to have evol comments. */
const EXCLUDED_RELEASE_NOTES = [
  'v5-0',
  'v5-1',
  'v5-2',
  'v5-3',
  'v6-0',
  'v6-1',
  'v6-2',
  'v6-3',
];

const severity = parseSeverity(process.argv.slice(2));
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const releaseNotesDir = path.join(rootDir, RELEASE_NOTES_DIR);
const excluded = new Set(EXCLUDED_RELEASE_NOTES);

const targets = readdirSync(releaseNotesDir)
  .filter((name) => name.endsWith('.md'))
  .filter((name) => !excluded.has(name.replace(/\.md$/, '')))
  .sort()
  .map((name) => path.join(releaseNotesDir, name));

if (targets.length === 0) {
  console.warn(
    `[check-evol-comments] no release notes to check under ${RELEASE_NOTES_DIR}`,
  );
  process.exit(0);
}

const allViolations = [];
for (const targetPath of targets) {
  const value = readFileSync(targetPath, 'utf8');
  const tree = unified().use(remarkParse).parse(value);
  for (const violation of findViolations(tree)) {
    allViolations.push({...violation, filePath: targetPath});
  }
}

const log = severity === 'error' ? console.error : console.warn;

for (const {filePath, headingText, line} of allViolations) {
  const relPath = path.relative(rootDir, filePath);
  const location = line ? `${relPath}:${line}` : relPath;
  const message =
    `H3 "${headingText}" must be immediately followed by <!-- evol: <id> -->`;
  log(`[check-evol-comments] ${location}: ${message}`);
}

log(
  `[check-evol-comments] total: ${allViolations.length} H3 heading(s) missing a required evol comment`,
);

if (severity === 'error' && allViolations.length > 0) {
  process.exit(1);
}

process.exit(0);

function parseSeverity(argv) {
  const arg = argv.find((item) => item.startsWith('--severity='));
  const value = arg ? arg.slice('--severity='.length) : 'error';
  if (value !== 'warn' && value !== 'error') {
    console.error(
      `[check-evol-comments] invalid --severity=${value} (expected warn|error)`,
    );
    process.exit(1);
  }
  return value;
}

function findViolations(tree) {
  const children = Array.isArray(tree.children) ? tree.children : [];
  let underExemptSection = false;
  const violations = [];

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type !== 'heading') {
      continue;
    }

    const headingText = getHeadingText(node);

    if (node.depth === 2) {
      underExemptSection = headingText === EXEMPT_UNDER;
      continue;
    }

    if (node.depth !== 3 || underExemptSection) {
      continue;
    }

    if (isEvolComment(children[i + 1])) {
      continue;
    }

    violations.push({
      headingText,
      line: node.position?.start?.line,
    });
  }

  return violations;
}

function getHeadingText(node) {
  if (!node?.children?.length) {
    return '';
  }
  return node.children
    .map((child) => {
      if (child.type === 'text' || child.type === 'inlineCode') {
        return child.value || '';
      }
      if (child.children) {
        return getHeadingText(child);
      }
      return '';
    })
    .join('')
    .trim();
}

function isEvolComment(node) {
  return (
    node?.type === 'html' &&
    typeof node.value === 'string' &&
    /<!--[\s\S]*-->/.test(node.value) &&
    EVOL_PATTERN.test(node.value)
  );
}
