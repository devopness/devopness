import { basename, extname, join } from "node:path";
import { cache } from "react";

import { loader } from "fumadocs-core/source";
import { createOpenAPI, openapiPlugin, openapiSource } from "fumadocs-openapi/server";
import { apiRefCollection } from "fumadocs-mdx:collections/server";

import { acronymSpacingPlugin } from "@/lib/page-tree";

const openApiSpecPath = join(process.cwd(), "openapi.json");

export const API_REFERENCE_BASE_URL = "/api";

export const openapi = createOpenAPI({
  input: [openApiSpecPath],
});

/**
 * Build the API reference source used by the `/api` route.
 *
 * Keep the API docs in a single source so the route can render both:
 * - manual MDX pages from `docs/docs/api`
 * - generated OpenAPI pages from the local spec file
 *
 * The manual pages stay first in the tree. The generated pages are appended
 * after them and share the same sidebar and URL space.
 */
export const getApiReferenceSource = cache(async () => {
  const generatedSource = await openapiSource(openapi, {
    baseDir: "(generated-openapi)",
    groupBy: "tag",
    // `separator` keeps the generated tag groups as sidebar sections.
    // `folder` would nest them as actual folders instead.
    meta: { folderStyle: "folder" },
  });

  const staticSource = apiRefCollection.toFumadocsSource();

  const staticSlugs: string[] = [];

  for (const file of staticSource.files) {
    if (file.type !== "page") {
      continue;
    }

    staticSlugs.push(basename(file.path, extname(file.path)));
  }

  const patchedOpenapiFiles = patchOpenapiRootMeta(generatedSource.files, staticSlugs);

  /**
   * Merge both file sets into one source object.
   *
   * Fumadocs reads this as one tree, so the API markdown pages stay at the
   * top of the section and the generated OpenAPI pages follow them.
   */
  return loader({
    baseUrl: API_REFERENCE_BASE_URL,
    source: { files: [...staticSource.files, ...patchedOpenapiFiles] },
    plugins: [openapiPlugin(), acronymSpacingPlugin],
  });
});

type OpenApiSource = Awaited<ReturnType<typeof openapiSource>>;

type OpenApiFile = OpenApiSource["files"][number];

type RootMetaData = {
  pages?: string[];
};

type RootMetaFile = OpenApiFile & {
  data: RootMetaData;
};

/**
 * Patch the generated root meta file so the manual API pages stay first.
 *
 * We only rewrite the root `meta.json` file. Every other generated file is
 * returned as-is.
 */
function patchOpenapiRootMeta(files: OpenApiFile[], staticSlugs: string[]): OpenApiFile[] {
  const patchedFiles: OpenApiFile[] = [];

  for (const file of files) {
    if (!isRootMetaFile(file)) {
      patchedFiles.push(file);
      continue;
    }

    /**
     * The generated root meta file is typed as OpenAPI page data, but this is
     * the one place where we need to treat it as a meta file so we can prepend
     * the manual API page slugs.
     */
    const rootMeta = file as RootMetaFile;

    /**
     * Cast back to the source file union after adding the root `pages` list.
     *
     * The generated file shape is correct at runtime, but Fumadocs keeps the
     * root meta file typed as a generic source file, so the patched object must
     * be re-asserted once we expand its `pages` array.
     */
    const patchedRootMeta = {
      ...rootMeta,
      data: {
        ...rootMeta.data,
        pages: [...staticSlugs, ...(rootMeta.data.pages ?? [])],
      },
    } as OpenApiFile;

    patchedFiles.push(patchedRootMeta);
  }

  return patchedFiles;
}

/**
 * Narrow the generated OpenAPI root file.
 *
 * `openapiSource()` returns generic file data, so we narrow only the root meta
 * file before we patch its `pages` list.
 */
function isRootMetaFile(file: OpenApiFile): file is OpenApiFile & { data: RootMetaData } {
  if (file.type !== "meta") {
    return false;
  }

  return file.path === "meta.json" || file.path === "/meta.json";
}
