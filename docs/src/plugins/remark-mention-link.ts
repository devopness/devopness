import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

interface TextNode extends Node {
  type: 'text';
  value: string;
}

/** Options for {@link remarkMentionLink}. */
export interface RemarkMentionLinkOptions {
  /**
   * Absolute path to markdown content (`docs/docs`).
   * Required. Resolved in `source.config.ts` so it works in dev and in the
   * bundled `.source/source.config.mjs` build.
   */
  docsRoot: string;
}

/** Matches legacy mention syntax: `[/docs/path/to/page]` or `[/path/to/page]`. */
const MENTION_PATTERN = /\[(\/(?:docs\/)?[^\]]+)\]/g;

/**
 * Normalize a mention path to a Fumadocs route URL (no `/docs` prefix).
 *
 * Next.js `basePath: '/docs'` adds the public prefix at runtime.
 *
 * @example
 * normalizeDocPath('/docs/mcp/index.md') // => '/mcp'
 * normalizeDocPath('/docs/api/')         // => '/api'
 */
export function normalizeDocPath(rawPath: string): string {
  let path = rawPath === '/docs' ? '/' : rawPath.replace(/^\/docs\//, '/');
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  // Legacy mentions sometimes include the file extension.
  path = path.replace(/\.md$/, '');

  // Folder index pages are served at the directory URL, not `/.../index`.
  if (path.endsWith('/index')) {
    path = path.slice(0, -'/index'.length) || '/';
  }

  // Match Fumadocs slugs: `/mcp`, not `/mcp/`.
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path;
}

/**
 * Normalize an internal docs href for Fumadocs/Next.js `basePath: '/docs'`.
 *
 * Strips a duplicate `/docs` prefix from markdown links and mention paths.
 * Preserves URL fragments (`#heading`).
 */
export function normalizeInternalDocUrl(href: string): string {
  const [
    path,
    ...hashParts
  ] = href.split('#');
  const hash = hashParts.length > 0 ? hashParts.join('#') : undefined;
  const normalized = normalizeDocPath(path);

  return hash ? `${normalized}#${hash}` : normalized;
}

/**
 * True when `href` is an in-site docs path that includes a redundant `/docs`
 * prefix (which would otherwise become `/docs/docs/...` under the Next.js
 * `basePath: '/docs'`).
 */
export function isRedundantDocsHref(href: string): boolean {
  return href === '/docs' || href.startsWith('/docs/');
}

/**
 * Resolve a route path to a markdown file under `docsRoot`.
 *
 * Tries `<path>.md` first, then `<path>/index.md`.
 */
function resolveMarkdownFile(docPath: string, docsRoot: string): string | null {
  if (docPath === '/') {
    const home = join(docsRoot, 'index.md');
    return existsSync(home) ? home : null;
  }

  const relative = docPath.replace(/^\//, '');
  const direct = join(docsRoot, `${relative}.md`);
  if (existsSync(direct)) return direct;

  const index = join(docsRoot, relative, 'index.md');
  if (existsSync(index)) return index;

  return null;
}

/**
 * Read `title` from a page's YAML frontmatter.
 * Returns `null` when the file or title field is missing.
 */
function readPageTitle(docPath: string, docsRoot: string): string | null {
  const file = resolveMarkdownFile(docPath, docsRoot);
  if (!file) return null;

  const content = readFileSync(file, 'utf8');
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return null;

  const title = frontmatter[1].match(/^title:\s*(.+)$/m);
  if (!title) return null;

  let value = title[1].trim();

  // Support quoted YAML titles.
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return value;
}

/**
 * Best-effort label when the target page file or `title` field is missing.
 * Prefer setting `title` in frontmatter instead of relying on this.
 */
function fallbackMentionLabel(docPath: string): string {
  const segments = docPath.split('/').filter(Boolean);
  const slug = segments.at(-1) ?? 'home';
  return slug.replaceAll('-', ' ').replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Link text for a mention: target page `title`, or {@link fallbackMentionLabel}.
 */
function mentionLabel(docPath: string, docsRoot: string): string {
  return readPageTitle(docPath, docsRoot) ?? fallbackMentionLabel(docPath);
}

/**
 * Convert `[/docs/...]` mention syntax in text into markdown link nodes.
 *
 * The link text is the target page `title` from frontmatter, so labels stay in
 * sync when a page is renamed. The generated `href` has no `/docs` prefix; the
 * Next.js `basePath: '/docs'` re-adds it at runtime.
 *
 * Standard markdown links (`[label](/docs/...)`) are intentionally left
 * untouched here. Their redundant `/docs` prefix is normalized at render time
 * by the link component in `app/[[...slug]]/page.tsx`, which is robust against
 * MDX caching in dev.
 *
 * @example
 * `Use [/docs/api]` → `[Devopness API Reference](/api)`
 */
export function remarkMentionLink(options: RemarkMentionLinkOptions) {
  const { docsRoot } = options;

  if (!docsRoot) {
    throw new Error(
      'remarkMentionLink: `docsRoot` is required. Pass it from source.config.ts.'
    );
  }

  return (tree: Node) => {
    visit(
      tree,
      'text',
      (
        node: TextNode,
        index: number | undefined,
        parent: Parent | undefined
      ) => {
        if (!parent || index === undefined || !node.value) return;

        if (!MENTION_PATTERN.test(node.value)) return;
        MENTION_PATTERN.lastIndex = 0;

        const parts: Node[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = MENTION_PATTERN.exec(node.value)) !== null) {
          if (match.index > lastIndex) {
            parts.push({
              type: 'text',
              value: node.value.slice(lastIndex, match.index),
            } as TextNode);
          }

          const docPath = normalizeDocPath(match[1]);

          parts.push({
            type: 'link',
            url: docPath,
            children: [
              {
                type: 'text',
                value: mentionLabel(docPath, docsRoot),
              } as TextNode,
            ],
          } as Node);

          lastIndex = MENTION_PATTERN.lastIndex;
        }

        if (lastIndex < node.value.length) {
          parts.push({
            type: 'text',
            value: node.value.slice(lastIndex),
          } as TextNode);
        }

        if (parts.length > 0) {
          parent.children.splice(index, 1, ...parts);
        }
      }
    );
  };
}
