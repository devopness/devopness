"use client";

import { createCodeUsageGeneratorRegistry } from "fumadocs-openapi/requests/generators";
import { curl } from "fumadocs-openapi/requests/generators/curl";
import { javascript } from "fumadocs-openapi/requests/generators/javascript";
import { python } from "fumadocs-openapi/requests/generators/python";
import { createOpenAPIPage } from "fumadocs-openapi/ui";

/**
 * Registry of example code tabs shown in the API docs.
 *
 * We keep this separate so the docs only expose the example languages we
 * support and test.
 */
const codeUsages = createCodeUsageGeneratorRegistry();

codeUsages.add("curl", curl);
// TODO: Add custom generators so these examples use the Devopness SDK
// instead of raw JS and Python.
codeUsages.add("js", javascript);
codeUsages.add("python", python);

/**
 * Client wrapper for the generated OpenAPI page component.
 */
export const OpenAPIPage = createOpenAPIPage({ codeUsages });
