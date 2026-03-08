import { loader, type InferPageType } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docs } from 'fumadocs-mdx:collections/server';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  // baseUrl: Internal URL prefix for Fumadocs links (should be '/' when using Next.js basePath)
  // Since next.config.mjs has basePath: '/docs', this should NOT include /docs to avoid double prefix
  // Fumadocs generates /actions/, then Next.js adds /docs/ → final URL: /docs/actions/
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [
    lucideIconsPlugin(),
  ],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [
    ...page.slugs,
    'image.png',
  ];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');
  const intro = page.data.intro ? `${page.data.intro}\n\n` : '';

  return `# ${page.data.title}\n\n${intro}${processed}`;
}
