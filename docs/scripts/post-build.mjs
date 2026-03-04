/**
 * Post-build script: copies the build output into an out/docs/ subdirectory so the docs
 * can be served directly at /docs/ without requiring web server rewrite rules.
 *
 * WHY THIS IS NEEDED
 * ==================
 * Next.js is configured with `basePath: '/docs'` (see next.config.mjs).
 * This makes the built HTML reference all assets with a /docs/ prefix:
 *   <link href="/docs/_next/static/chunks/abc.css" />
 *
 * The static export outputs files to out/ without the basePath in the
 * file paths:
 *   out/_next/static/chunks/abc.css  (not out/docs/_next/...)
 *
 * When a server (nginx, CDN, etc.) serves out/ at root, a request for
 *   /docs/_next/static/chunks/abc.css
 * maps to:
 *   out/docs/_next/static/chunks/abc.css  ← does not exist → 404
 *
 * HOW THE COPY FIXES IT
 * =====================
 * By duplicating out/ into out/docs/, the same files are accessible at
 * both the root level and under /docs/:
 *   out/_next/...        → serves requests from the reverse proxy
 *                          (<https://<external consumer website> strips /docs/ before forwarding)
 *   out/docs/_next/...   → serves requests for direct access
 *                          (<https://docs website>/docs/_next/...)
 *
 * A symlink (out/docs → .) would also work for webservers and revere proxies (e.g: nginx) but is
 * not reliable when deploying to CDNs (S3, Cloudflare, etc.), which don't follow or preserve
 * symlinks. A real copy works everywhere.
 */

import { cpSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const buildOutputDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const buildOutputDocsDir = join(buildOutputDir, 'docs');

mkdirSync(buildOutputDocsDir, { recursive: true });

for (const entry of readdirSync(buildOutputDir)) {
  if (entry === 'docs') continue;
  cpSync(join(buildOutputDir, entry), join(buildOutputDocsDir, entry), { recursive: true });
}

console.log('post-build: copied out/ contents into out/docs/');
