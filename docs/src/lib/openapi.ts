import { basename, extname, join } from "node:path";
import { cache } from "react";

import { loader } from "fumadocs-core/source";
import { createOpenAPI, openapiPlugin, openapiSource } from "fumadocs-openapi/server";
import { apiRefCollection } from "fumadocs-mdx:collections/server";

const openApiSpecPath = join(process.cwd(), "openapi.yml");

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
    baseDir: "(generated)",
    groupBy: "tag",
    meta: { folderStyle: "separator" },
  });
  const staticSource = apiRefCollection.toFumadocsSource();
  const staticSlugs = staticSource.files
    .filter((file): file is typeof file & { type: "page" } => file.type === "page")
    .map((file) => basename(file.path, extname(file.path)));
  const patchedOpenapiFiles = generatedSource.files.map((file) => {
    if (file.type !== "meta" || (file.path !== "meta.json" && file.path !== "/meta.json")) {
      return file;
    }

    const data = file.data as { pages?: string[] };
    return {
      ...file,
      data: {
        ...data,
        pages: [...staticSlugs, ...(data.pages ?? [])],
      },
    };
  });

  return loader({
    baseUrl: API_REFERENCE_BASE_URL,
    source: { files: [...staticSource.files, ...patchedOpenapiFiles] },
    plugins: [openapiPlugin()],
  });
});
