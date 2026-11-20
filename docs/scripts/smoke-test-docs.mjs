#!/usr/bin/env node

/**
 * Docs route smoke test.
 *
 * This script runs against the built docs output to catch runtime regressions
 * that TypeScript and the build step can miss. It discovers routes from the
 * generated HTML, samples a few manual pages and API pages deterministically,
 * and always checks a small set of canary routes.
 *
 * The goal is to fail fast when a dependency update or routing change makes a
 * page render a 404 shell or return a non-200 response, even if the build still
 * succeeds.
 */

import { createServer } from "node:http";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";

const buildRoot = path.resolve(process.cwd(), process.env.DOCS_SMOKE_BUILD_DIR ?? "out");
const publicRoot = path.join(buildRoot, process.env.DOCS_SMOKE_PUBLIC_ROOT ?? "docs");
const basePath = process.env.DOCS_SMOKE_BASE_PATH ?? "/docs";
const sampleCount = Number.parseInt(process.env.DOCS_SMOKE_SAMPLE_COUNT ?? "4", 10);
const seed = process.env.DOCS_SMOKE_SEED ?? process.env.GITHUB_SHA ?? "docs-smoke-v1";

const routeCanaries = [
  {
    route: "/docs/",
    snippets: [
      "Get started with Devopness",
      "Deploy applications and provision cloud infrastructure",
    ],
  },
  {
    route: "/docs/api/",
    snippets: ["Devopness API Reference", "REST API endpoints"],
  },
];

const canaryRoutes = routeCanaries.map(({ route }) => route);

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

/**
 * Entry point for the smoke test.
 *
 * The flow stays simple on purpose:
 * 1. read the built docs output
 * 2. discover the routes that exist
 * 3. choose canaries and a deterministic sample
 * 4. serve the output locally
 * 5. request each route and check both status and content
 */
async function main() {
  await assertDirectory(publicRoot);

  const discoveredRoutes = await discoverRoutes(publicRoot, basePath);
  const groupedRoutes = groupRoutes(discoveredRoutes, basePath);

  const routesToCheck = buildRouteList(
    discoveredRoutes,
    groupedRoutes,
    seed,
    sampleCount,
    canaryRoutes,
  );

  if (routesToCheck.length === 0) {
    throw new Error(`smoke-test: no routes discovered under ${publicRoot}`);
  }

  const server = createLocalFileServer(buildRoot);
  const port = await listen(server);
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    console.log(`smoke-test: build root ${buildRoot}`);
    console.log(
      `smoke-test: discovered ${groupedRoutes.manual.length} manual routes and ${groupedRoutes.api.length} api routes`,
    );
    console.log(`smoke-test: using seed ${seed}`);
    console.log(`smoke-test: checking ${routesToCheck.length} routes`);

    for (const route of routesToCheck) {
      await validateRoute(baseUrl, route);
    }

    console.log("smoke-test: all sampled routes passed");
  } finally {
    await close(server);
  }
}

/**
 * Build the final route list to validate.
 *
 * Canary routes are always checked first. Then the script adds a deterministic
 * sample from manual pages and API pages so the CI run can cover more than a
 * fixed hand-written list without becoming flaky.
 */
function buildRouteList(discoveredRoutes, groupedRoutes, seedText, count, canaryCandidates) {
  return dedupe([
    ...resolveCanaries(discoveredRoutes, canaryCandidates),
    ...sampleRoutes(groupedRoutes.manual, count, `${seedText}:manual`),
    ...sampleRoutes(groupedRoutes.api, count, `${seedText}:api`),
  ]);
}

/**
 * Start a tiny static server for the built docs output.
 *
 * The smoke test needs a real HTTP server because the breakage we care about
 * happens at request time, not at build time.
 */
function createLocalFileServer(rootDirectory) {
  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const filePath = await resolveFileForRequest(rootDirectory, requestUrl.pathname);

      if (!filePath) {
        response.statusCode = 404;
        response.setHeader("content-type", "text/plain; charset=utf-8");
        response.end("not found");
        return;
      }

      const file = await readFile(filePath);
      response.statusCode = 200;
      response.setHeader("content-type", contentTypeFor(filePath));
      response.end(file);
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("content-type", "text/plain; charset=utf-8");
      response.end(error instanceof Error ? error.message : String(error));
    }
  });
}

/**
 * Validate one route against the local server.
 *
 * A healthy page must return HTTP 200 and must not render the visible 404 shell
 * content that appears when the route resolves to the wrong page. For the
 * scripted canaries, the response also needs to contain the expected page text
 * so we catch "200 but wrong content" regressions.
 */
async function validateRoute(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  const html = await response.text();
  const visibleText = extractVisibleText(html);

  if (response.status !== 200) {
    throw new Error(`smoke-test: ${route} returned HTTP ${response.status}`);
  }

  if (visibleText.includes("Page Not Found")) {
    throw new Error(`smoke-test: ${route} rendered the 404 shell`);
  }

  validateRouteContent(route, html, visibleText);

  console.log(`smoke-test: ok ${route}`);
}

/**
 * Check that a canary route still renders the expected content.
 *
 * The content checks stay deliberately small. They only guard a handful of
 * high-value pages whose text is stable and easy to recognize.
 */
function validateRouteContent(route, html, visibleText) {
  const expectation = routeCanaries.find((candidate) => candidate.route === route);

  if (!expectation) {
    return;
  }

  const haystack = `${visibleText}\n${html}`;

  for (const snippet of expectation.snippets) {
    if (!haystack.includes(snippet)) {
      throw new Error(`smoke-test: ${route} is missing expected content: ${snippet}`);
    }
  }
}

/**
 * Read every route that exists in the built docs output.
 *
 * Routes are discovered from generated HTML files so the smoke test follows the
 * actual output of the docs build, not a hard-coded list.
 */
async function discoverRoutes(rootDirectory, docsBasePath) {
  const htmlFiles = await findHtmlFiles(rootDirectory);
  const routes = [];

  for (const filePath of htmlFiles) {
    const route = htmlFilePathToRoute(rootDirectory, filePath, docsBasePath);
    if (route) {
      routes.push(route);
    }
  }

  routes.sort((left, right) => left.localeCompare(right));
  return routes;
}

/**
 * Split discovered routes into manual pages and API reference pages.
 */
function groupRoutes(routes, docsBasePath) {
  const apiPrefix = `${docsBasePath}/api/`;

  return {
    manual: routes.filter((route) => route !== `${docsBasePath}/` && !route.startsWith(apiPrefix)),
    api: routes.filter((route) => route.startsWith(apiPrefix)),
  };
}

/**
 * Make sure the canary routes still exist in the built output.
 *
 * These are the routes that have historically caught breakage first, so the
 * smoke test fails immediately if one disappears.
 */
function resolveCanaries(routes, canaryCandidates) {
  const discovered = new Set(routes);
  return canaryCandidates.filter((route) => {
    if (!discovered.has(route)) {
      throw new Error(`smoke-test: expected canary route ${route} to exist`);
    }
    return true;
  });
}

/**
 * Pick a deterministic sample of routes.
 *
 * The seed keeps CI runs stable while still rotating which routes are checked
 * from run to run.
 */
function sampleRoutes(routes, count, seedText) {
  if (routes.length === 0) {
    return [];
  }

  const available = [...routes];
  const rng = seededRandom(seedText);
  shuffleInPlace(available, rng);
  return available.slice(0, Math.min(count, available.length));
}

/**
 * Shuffle an array in place using the provided pseudo-random generator.
 */
function shuffleInPlace(values, random) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
}

/**
 * Create a small deterministic pseudo-random generator.
 */
function seededRandom(seedText) {
  let seedValue = 0x811c9dc5;

  for (const character of seedText) {
    seedValue ^= character.charCodeAt(0);
    seedValue = Math.imul(seedValue, 0x01000193);
  }

  return () => {
    seedValue += 0x6d2b79f5;
    let value = seedValue;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Find every HTML file under the built docs directory.
 */
async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "_next") {
        continue;
      }

      files.push(...(await findHtmlFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

/**
 * Convert a built HTML file path into a public route.
 */
function htmlFilePathToRoute(rootDirectory, filePath, docsBasePath) {
  const relativePath = path.relative(rootDirectory, filePath).split(path.sep).join("/");

  if (
    relativePath === "404.html" ||
    relativePath.startsWith("404/") ||
    relativePath.startsWith("_next/")
  ) {
    return null;
  }

  let routePath;
  if (relativePath === "index.html") {
    routePath = "/";
  } else if (relativePath.endsWith("/index.html")) {
    routePath = `/${relativePath.slice(0, -"/index.html".length)}/`;
  } else if (relativePath.endsWith(".html")) {
    routePath = `/${relativePath.slice(0, -".html".length)}`;
  } else {
    return null;
  }

  return `${docsBasePath}${routePath}`.replace(/\/+/g, "/");
}

/**
 * Resolve a request path back to a file in the static export.
 */
async function resolveFileForRequest(rootDirectory, pathname) {
  const relativePath = pathname.replace(/^\/+/, "");
  const candidates = [];

  if (relativePath.length === 0) {
    candidates.push(path.join(rootDirectory, "index.html"));
  } else {
    candidates.push(path.join(rootDirectory, relativePath));
    candidates.push(path.join(rootDirectory, `${relativePath}.html`));
    candidates.push(path.join(rootDirectory, relativePath, "index.html"));
  }

  for (const candidate of candidates) {
    if (await isFile(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Check whether a path points to a file.
 */
async function isFile(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

/**
 * Pick a content type for the HTTP response.
 */
function contentTypeFor(filePath) {
  switch (path.extname(filePath)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

/**
 * Strip HTML markup down to visible text.
 */
function extractVisibleText(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Remove duplicate routes while keeping the list order simple.
 */
function dedupe(values) {
  return [...new Set(values)];
}

/**
 * Confirm the docs output directory exists before the smoke test starts.
 */
async function assertDirectory(directory) {
  await access(directory, fsConstants.R_OK);
  const directoryStat = await stat(directory);

  if (!directoryStat.isDirectory()) {
    throw new Error(`smoke-test: expected ${directory} to be a directory`);
  }
}

/**
 * Listen on a random localhost port and return that port number.
 */
function listen(server) {
  return new Promise((resolvePromise, rejectPromise) => {
    server.once("error", rejectPromise);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        rejectPromise(new Error("smoke-test: could not determine local port"));
        return;
      }
      resolvePromise(address.port);
    });
  });
}

/**
 * Close the temporary local server.
 */
function close(server) {
  return new Promise((resolvePromise, rejectPromise) => {
    server.close((error) => {
      if (error) {
        rejectPromise(error);
        return;
      }
      resolvePromise();
    });
  });
}
