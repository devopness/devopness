import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from 'fumadocs-ui/layouts/notebook/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';

import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { RelatedLinks } from '@/components/related-links';
import { RequiredPermissions } from '@/components/required-permissions';
import { getGithubDocsEditUrl, getGithubDocsRawUrl } from '@/lib/constants';
import { getLLMText, getPageImage, source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdown = await getLLMText(page);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {!page.data.intro ? page.data.description : undefined}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <LLMCopyButton markdown={markdown} />
        <ViewOptions
          markdownUrl={getGithubDocsRawUrl(page.path)}
          githubUrl={getGithubDocsEditUrl(page.path)}
        />
      </div>
      <DocsBody>
        {page.data.intro && <p>{page.data.intro}</p>}
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
        {page.data.required_permissions &&
          page.data.required_permissions.length > 0 && (
            <RequiredPermissions permissions={page.data.required_permissions} />
          )}
        {page.data.links?.related && page.data.links.related.length > 0 && (
          <RelatedLinks links={page.data.links.related} />
        )}
      </DocsBody>
      <EditOnGitHub href={getGithubDocsEditUrl(page.path)} />
    </DocsPage>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

export async function generateStaticParams() {
  // Build the docs URL list for static export:
  // each docs page becomes a slug array that this catch-all route can pre-render (for example, `[]`, `['actions']`, `['users', 'api']`).
  // As we use Next.js static export, each route must return `{ slug: string[] }`.
  // Here we normalize and add `slug: []` only when index is missing.
  const params = source.generateParams();
  const normalized = params.map((entry: string[] | { slug?: string[] }) => {
    // `entry` can be either:
    // - `string[]`: already a ready-to-use slug list (for example `['actions']`, `['users','api']`).
    // - `{ slug?: string[] }`: object wrapper variant like `{ slug: ['actions'] }`
    // We normalize both so the rest of the function has a single deterministic shape.
    if (Array.isArray(entry)) {
      return { slug: entry };
    }

    return { slug: entry?.slug ?? [] };
  });
  const dynamicParams = normalized as { slug: string[] }[];
  const hasIndex = dynamicParams.some((entry) => entry.slug.length === 0);

  // If `source.generateParams()` already emitted the docs home route (`[]`), keep list as-is
  // to avoid duplicates.
  // Otherwise add `{ slug: [] }` so `/docs` gets a static path during export as well.
  return hasIndex
    ? dynamicParams
    : [
        { slug: [] },
        ...dynamicParams,
      ];
}
