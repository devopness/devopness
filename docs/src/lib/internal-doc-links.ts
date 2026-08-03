/**
 * Pure docs link helpers.
 *
 * This module is safe to import from React components, app routes, and other
 * runtime code because it does not touch `node:fs`, `node:path`, or any other
 * filesystem APIs. Keep I/O and markdown file reads in the MDX remark plugin
 * instead.
 */
/** Matches legacy mention syntax: `[/docs/path/to/page]` or `[/path/to/page]`. */
export const MENTION_PATTERN = /\[(\/(?:docs\/)?[^\]]+)\]/g;

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
  let path = rawPath === "/docs" ? "/" : rawPath.replace(/^\/docs\//, "/");
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // Legacy mentions sometimes include the file extension.
  path = path.replace(/\.md$/, "");

  // Folder index pages are served at the directory URL, not `/.../index`.
  if (path.endsWith("/index")) {
    path = path.slice(0, -"/index".length) || "/";
  }

  // Match Fumadocs slugs: `/mcp`, not `/mcp/`.
  if (path.length > 1 && path.endsWith("/")) {
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
  const [path, ...hashParts] = href.split("#");
  const hash = hashParts.length > 0 ? hashParts.join("#") : undefined;
  const normalized = normalizeDocPath(path);

  return hash ? `${normalized}#${hash}` : normalized;
}

/**
 * True when `href` is an in-site docs path that includes a redundant `/docs`
 * prefix (which would otherwise become `/docs/docs/...` under the Next.js
 * `basePath: '/docs'`).
 */
export function isRedundantDocsHref(href: string): boolean {
  return href === "/docs" || href.startsWith("/docs/");
}
