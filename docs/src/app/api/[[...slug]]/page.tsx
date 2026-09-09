import type { ComponentProps } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { createRelativeLink } from "fumadocs-ui/mdx";

import { LLMCopyButton, ViewOptions } from "@/components/ai/page-actions";
import { OpenAPIPage } from "@/components/openapi-page";
import { getGithubDocsEditUrl, getGithubDocsRawUrl } from "@/lib/constants";
import { isRedundantDocsHref, normalizeInternalDocUrl } from "@/lib/internal-doc-links";
import { getApiReferenceSource } from "@/lib/openapi";
import { getMDXComponents } from "@/mdx-components";

type ApiPageData = {
  body?: React.FC<{ components?: Record<string, unknown> }>;
  toc?: ComponentProps<typeof DocsPage>["toc"];
  getText?: (kind: "processed") => Promise<string>;
  getAPIPageProps?: () => ComponentProps<typeof OpenAPIPage>;
};

/**
 * Render the API reference pages.
 */
export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const source = await getApiReferenceSource();

  if (!params.slug) {
    const first = source.getPages()[0];
    if (first) redirect(first.url);
    notFound();
  }

  const page = source.getPage(params.slug ?? []);
  if (!page) notFound();

  const data = page.data as ApiPageData;

  if (typeof data.body === "function" && data.getText) {
    const markdown = await data.getText("processed");
    const RelativeLink = createRelativeLink(source, page);

    const DocsLink = (linkProps: ComponentProps<"a">) => {
      const href =
        typeof linkProps.href === "string" && isRedundantDocsHref(linkProps.href)
          ? normalizeInternalDocUrl(linkProps.href)
          : linkProps.href;

      return <RelativeLink {...linkProps} href={href} />;
    };

    const MDX = data.body;

    return (
      <DocsPage toc={data.toc}>
        <DocsTitle>{page.data.title}</DocsTitle>
        {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <LLMCopyButton markdown={markdown} />
          <ViewOptions
            markdownUrl={getGithubDocsRawUrl(page.path)}
            githubUrl={getGithubDocsEditUrl(page.path)}
          />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: DocsLink,
            })}
          />
        </DocsBody>
      </DocsPage>
    );
  }

  if (!data.getAPIPageProps) notFound();

  return (
    <DocsPage>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
      <DocsBody>
        <OpenAPIPage {...data.getAPIPageProps()} />
      </DocsBody>
    </DocsPage>
  );
}

/**
 * Build metadata for the API reference route.
 */
export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const source = await getApiReferenceSource();
  if (!params.slug) {
    const first = source.getPages()[0];
    if (!first) notFound();

    return {
      title: first.data.title,
      description: first.data.description,
    };
  }

  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

/**
 * Generate static params for the API reference route.
 */
export async function generateStaticParams() {
  const source = await getApiReferenceSource();
  return source.generateParams();
}
