// @ts-check
/**
 * Remark plugin: rewrite relative links that point OUTSIDE the docs folder
 * (e.g. `../../demo/app/main.py`, `../../.github/workflows/ci.yml`) into
 * absolute GitHub URLs.
 *
 * Why: the markdown in /docs is written to be browsed directly on GitHub,
 * where those relative links work. On the published site those files don't
 * exist, so without this plugin they would be broken links (or bundled as
 * raw assets). Links inside /docs are left untouched for Docusaurus to resolve.
 */
import fs from 'node:fs';
import path from 'node:path';

const SCHEME_RE = /^[a-z][a-z\d+.-]*:/i;

/**
 * Pure helper - exported for unit tests.
 * @param {string} url        link target as written in markdown
 * @param {string} filePath   absolute path of the markdown file
 * @param {{docsDir: string, repoRoot: string, repoUrl: string, branch: string}} opts
 * @returns {string | null}   the rewritten URL, or null if it should be left alone
 */
export function rewriteRepoLink(url, filePath, opts) {
  if (!url || url.startsWith('#') || url.startsWith('/') || SCHEME_RE.test(url)) {
    return null;
  }
  const hashIndex = url.indexOf('#');
  const target = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : url.slice(hashIndex);
  if (!target) return null;

  const resolved = path.resolve(path.dirname(filePath), decodeURI(target));
  const relToDocs = path.relative(opts.docsDir, resolved);
  const insideDocs = relToDocs !== '' && !relToDocs.startsWith('..') && !path.isAbsolute(relToDocs);
  if (insideDocs) return null;

  const relToRepo = path.relative(opts.repoRoot, resolved).split(path.sep).join('/');
  if (relToRepo.startsWith('..')) return null; // outside the repo - leave as-is

  let kind = 'blob';
  try {
    if (fs.statSync(resolved).isDirectory()) kind = 'tree';
  } catch {
    // file may not exist locally; default to blob
  }
  return `${opts.repoUrl}/${kind}/${opts.branch}/${relToRepo}${hash}`;
}

/**
 * @param {{docsDir: string, repoRoot: string, repoUrl: string, branch: string}} opts
 */
export default function remarkRepoLinks(opts) {
  /** @param {any} node @param {string} filePath */
  const walk = (node, filePath) => {
    if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
      const rewritten = rewriteRepoLink(node.url, filePath, opts);
      if (rewritten) node.url = rewritten;
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child, filePath);
    }
  };
  /** @param {any} tree @param {any} file */
  return (tree, file) => {
    const filePath = file?.path ?? file?.history?.[0];
    if (filePath) walk(tree, filePath);
  };
}
