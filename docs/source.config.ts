import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { remarkDirectiveAdmonition } from 'fumadocs-core/mdx-plugins';
import remarkDirective from 'remark-directive';
import { remarkMentionLink } from './src/plugins/remark-mention-link';
import { z } from 'zod';

// Extended frontmatter schema with custom fields used in the existing markdown files.
// These fields (intro, slug, sidebar_position, links, required_permissions) were
// originally defined when the docs used Docusaurus. Rather than rewriting all markdown
// frontmatter, we extend Fumadocs' schema to recognize them as-is.
const docsSchema = frontmatterSchema.extend({
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
  dir: 'docs',
  docs: {
    files: ['**/*.md', '**/*.mdx', '!**/README.md'],
    schema: docsSchema,
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
      // Supports :::note, :::warning, :::danger admonition syntax used in the existing markdown files
      // @see https://fumadocs.dev/docs/mdx/admonition
      [remarkDirectiveAdmonition],
      // Converts [/docs/path/to/page] mention syntax to standard markdown links
      [remarkMentionLink],
    ],
  },
  plugins: [
    {
      name: 'intro-to-description',
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
