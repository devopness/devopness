import { join } from "node:path";
import { cache } from "react";

import { loader } from "fumadocs-core/source";
import { createOpenAPI, openapiPlugin } from "fumadocs-openapi/server";
import { apiRefCollection } from "fumadocs-mdx:collections/server";

const openApiSpecPath = join(process.cwd(), "openapi.yml");

export const API_REFERENCE_BASE_URL = "/api";

export const openapi = createOpenAPI({
  input: [openApiSpecPath],
});

/**
 * Build the API reference source used by the `/api` route.
 *
 * This keeps the manual API pages from `docs/docs/api` together with the
 * generated OpenAPI pages from `openapi.yml`.
 */
export const getApiReferenceSource = cache(async () => {
  const generatedSource = await openapi.staticSource({
    baseDir: "api/(generated)",
    groupBy: "tag",
    meta: { folderStyle: "separator" },
  });

  return loader(
    {
      api: apiRefCollection.toFumadocsSource(),
      openapi: generatedSource,
    },
    {
      baseUrl: API_REFERENCE_BASE_URL,
      plugins: [openapiPlugin()],
    },
  );
});
