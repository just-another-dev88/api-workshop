export interface RepoLinkOptions {
  docsDir: string;
  repoRoot: string;
  repoUrl: string;
  branch: string;
}

export function rewriteRepoLink(url: string, filePath: string, opts: RepoLinkOptions): string | null;

declare function remarkRepoLinks(opts: RepoLinkOptions): (tree: unknown, file: unknown) => void;
export default remarkRepoLinks;
