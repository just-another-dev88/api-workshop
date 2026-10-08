// Unit tests for the remark-repo-links plugin. Run with: npm test
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import remarkRepoLinks, { rewriteRepoLink } from './remark-repo-links.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const opts = {
  repoRoot,
  docsDir: path.join(repoRoot, 'docs'),
  repoUrl: 'https://github.com/owner/repo',
  branch: 'main',
};
const moduleFile = path.join(repoRoot, 'docs', 'modules', '04-building-an-api.md');

test('rewrites links to source files outside docs into GitHub blob URLs', () => {
  assert.equal(
    rewriteRepoLink('../../demo/app/main.py', moduleFile, opts),
    'https://github.com/owner/repo/blob/main/demo/app/main.py',
  );
});

test('keeps the #hash fragment', () => {
  assert.equal(
    rewriteRepoLink('../../demo/README.md#tests', moduleFile, opts),
    'https://github.com/owner/repo/blob/main/demo/README.md#tests',
  );
});

test('uses tree/ for directories', () => {
  assert.equal(
    rewriteRepoLink('../../demo', moduleFile, opts),
    'https://github.com/owner/repo/tree/main/demo',
  );
});

test('leaves links inside docs untouched', () => {
  assert.equal(rewriteRepoLink('../facilitator-guide.md#-setup-checklist', moduleFile, opts), null);
  assert.equal(rewriteRepoLink('05-api-security.md', moduleFile, opts), null);
});

test('leaves absolute, anchor and site-root links untouched', () => {
  assert.equal(rewriteRepoLink('https://owasp.org/API-Security/', moduleFile, opts), null);
  assert.equal(rewriteRepoLink('mailto:a@b.c', moduleFile, opts), null);
  assert.equal(rewriteRepoLink('#section', moduleFile, opts), null);
  assert.equal(rewriteRepoLink('/docs/agenda', moduleFile, opts), null);
});

test('transformer rewrites link nodes in an mdast tree', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'paragraph', children: [{ type: 'link', url: '../../.github/workflows/ci.yml', children: [] }] },
      { type: 'definition', url: '../agenda.md' },
    ],
  };
  remarkRepoLinks(opts)(tree, { path: moduleFile });
  assert.equal(tree.children[0].children[0].url, 'https://github.com/owner/repo/blob/main/.github/workflows/ci.yml');
  assert.equal(tree.children[1].url, '../agenda.md');
});
