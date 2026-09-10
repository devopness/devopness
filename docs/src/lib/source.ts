import { loader, type InferPageType } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docs } from "fumadocs-mdx:collections/server";

import { acronymSpacingPlugin } from "@/lib/page-tree";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  // baseUrl: Internal URL prefix for Fumadocs links (should be '/' when using Next.js basePath)
  // Since next.config.mjs has basePath: '/docs', this should NOT include /docs to avoid double prefix
  // Fumadocs generates /actions/, then Next.js adds /docs/ → final URL: /docs/actions/
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), acronymSpacingPlugin],
});

/**
 * Build the OpenGraph image URL for a docs page.
 *
 * We keep the segments explicit so the image path matches the page slug and
 * stays stable across route changes.
 */
export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

/**
 * Build the LLM text version of a docs page.
 *
 * The processed body is the best source for downstream tools, and the intro
 * stays separate so we can keep the page title and lead paragraph intact.
 */
export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");
  const intro = page.data.intro ? `${page.data.intro}\n\n` : "";

  return `# ${page.data.title}\n\n${intro}${processed}`;
}
