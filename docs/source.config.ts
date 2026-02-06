import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { remarkDirectiveAdmonition } from 'fumadocs-core/mdx-plugins';
import remarkDirective from 'remark-directive';
import { remarkMentionLink } from './src/plugins/remark-mention-link';
import { z } from 'zod';

// Extended frontmatter schema to support Docusaurus-originated fields.

const docusaurusCompatSchema = frontmatterSchema.extend({
  intro: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  sidebar_position: z.number().nullable().optional(),
  required_permissions: z.array(z.string()).nullable().optional(),
  links: z
    .object({
      overview: z.string().nullable().optional(),
      quickstart: z.string().nullable().optional(),
      previous: z.string().nullable().optional(),
      next: z.string().nullable().optional(),
      guides: z.array(z.string()).nullable().optional(),
      related: z.array(z.string()).nullable().optional(),
      featured: z.array(z.string()).nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    files: ['**/*.md', '**/*.mdx', '!**/README.md'],
    schema: docusaurusCompatSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      // Required by remarkDirectiveAdmonition
      [remarkDirective],
      // Supports :::note, :::warning, :::danger admonition syntax from Docusaurus
      // @see https://fumadocs.dev/docs/mdx/admonition
      [remarkDirectiveAdmonition],
      // Converts [/docs/path/to/page] mention syntax to standard markdown links
      [remarkMentionLink],
    ],
  },
  plugins: [
    {
      name: 'docusaurus-frontmatter-compat',
      doc: {
        frontmatter: (data: Record<string, unknown>) => {
          // Map `intro` to `description` so Fumadocs renders it under the title
          if (data.intro && !data.description) {
            data.description = data.intro;
          }
          return data;
        },
      },
    },
  ],
});
