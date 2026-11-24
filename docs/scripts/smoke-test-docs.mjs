#!/usr/bin/env node

/**
 * Smoke test for the built docs.
 *
 * Serves the static export locally and requests a deterministic sample of
 * routes, checking for 404/error shells that a successful build can hide.
 */

import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const buildRoot = path.resolve(process.cwd(), process.env.DOCS_SMOKE_BUILD_DIR ?? "out");
const publicRoot = path.join(buildRoot, process.env.DOCS_SMOKE_PUBLIC_ROOT ?? "docs");
const basePath = process.env.DOCS_SMOKE_BASE_PATH ?? "/docs";
const seed = process.env.DOCS_SMOKE_SEED ?? process.env.GITHUB_SHA ?? "docs-smoke-v1";

const canaries = new Map([
  [
    `${basePath}/`,
    ["Get started with Devopness", "Deploy applications and provision cloud infrastructure"],
  ],
  [`${basePath}/api/`, ["Devopness API Reference", "REST API endpoints"]],
]);

// Ordered by specificity: the last entry is the catch-all for manual pages.
// Add a new entry here when another docs section needs guaranteed coverage.
const sections = [
  { name: "api", prefix: `${basePath}/api/` },
  { name: "manual", prefix: `${basePath}/` },
];

main().catch((error) => {
  console.error(`smoke-test: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});

async function main() {
  const sampleCount = Number.parseInt(process.env.DOCS_SMOKE_SAMPLE_COUNT ?? "4", 10);
  if (!Number.isInteger(sampleCount) || sampleCount < 1) {
    throw new Error(`invalid DOCS_SMOKE_SAMPLE_COUNT: ${process.env.DOCS_SMOKE_SAMPLE_COUNT}`);
  }

  await assertDirectory(publicRoot);

  const routes = await discoverRoutes(publicRoot);
  for (const route of canaries.keys()) {
    if (!routes.includes(route)) throw new Error(`expected canary route ${route} to exist`);
  }

  const grouped = groupRoutes(routes);
  const perSection = Math.max(sampleCount, 5);
  const routesToCheck = [
    ...canaries.keys(),
    ...sections.flatMap(({ name }) => sample(grouped[name] ?? [], `${seed}:${name}`, perSection)),
  ];

  console.log(`smoke-test: build root ${buildRoot}`);
  for (const { name } of sections) {
    console.log(`smoke-test: ${name} routes ${grouped[name]?.length ?? 0}`);
  }
  console.log(
    `smoke-test: checking ${new Set(routesToCheck).size} routes (${perSection} per section, seed ${seed})`,
  );

  const server = createStaticServer(buildRoot);
  const port = await listen(server);
  try {
    for (const route of new Set(routesToCheck)) {
      await checkRoute(`http://127.0.0.1:${port}`, route);
    }
    console.log("smoke-test: all sampled routes passed");
  } finally {
    await close(server);
  }
}

/** Assign every discovered route to exactly one section. */
function groupRoutes(routes) {
  const grouped = Object.fromEntries(sections.map(({ name }) => [name, []]));

  for (const route of routes) {
    if (canaries.has(route)) continue;
    const section = sections.find(({ prefix }) => route.startsWith(prefix));
    if (section) grouped[section.name].push(route);
  }

  return grouped;
}

/** Pick a stable subset using a hash of the seed and route. */
function sample(routes, tag, count) {
  return [...routes]
    .sort((left, right) => hash(`${tag}:${left}`) - hash(`${tag}:${right}`))
    .slice(0, count);
}

function hash(text) {
  let value = 2166136261;
  for (const character of text) {
    value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  }
  return value >>> 0;
}

/** Serve the static export with the same path resolution a host would use. */
function createStaticServer(root) {
  return createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      const file = await resolveFile(root, pathname);

      if (!file) {
        response.writeHead(404, { "content-type": "text/plain" });
        response.end("not found");
        return;
      }

      response.writeHead(200, { "content-type": contentType(file) });
      response.end(await readFile(file));
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain" });
      response.end(error instanceof Error ? error.message : String(error));
    }
  });
}

async function resolveFile(root, pathname) {
  const relative = pathname.replace(/^\/+/, "");
  const candidates = relative
    ? [
        path.join(root, relative),
        path.join(root, `${relative}.html`),
        path.join(root, relative, "index.html"),
      ]
    : [path.join(root, "index.html")];

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  return null;
}

function contentType(file) {
  const types = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
  };
  return types[path.extname(file)] ?? "application/octet-stream";
}

async function checkRoute(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  const html = await response.text();

  if (response.status !== 200) throw new Error(`${route} returned HTTP ${response.status}`);
  if (html.includes('id="__next_error__"'))
    throw new Error(`${route} rendered the Next.js error shell`);

  const text = visibleText(html);
  if (text.includes("Page Not Found")) throw new Error(`${route} rendered the 404 shell`);
  if (!text) throw new Error(`${route} rendered no visible content`);

  for (const snippet of canaries.get(route) ?? []) {
    if (!text.includes(snippet))
      throw new Error(`${route} is missing expected content: ${snippet}`);
  }

  await checkAssets(baseUrl, route, html);
  console.log(`smoke-test: ok ${route}`);
}

/** Verify that a sample of the page's static assets is actually served. */
async function checkAssets(baseUrl, route, html) {
  const prefix = `${basePath}/_next/static/`;
  const assets = [...new Set(html.match(new RegExp(`${prefix}[^"'\\s>]+`, "g")) ?? [])].slice(0, 5);

  for (const asset of assets) {
    const response = await fetch(`${baseUrl}${asset}`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status !== 200) {
      throw new Error(`${route} asset ${asset} returned HTTP ${response.status}`);
    }
  }
}

/** Strip markup and scripts so checks apply to what a visitor can actually read. */
function visibleText(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
    "&quot;": '"',
    "&#39;": "'",
  };
  return body
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:amp|lt|gt|nbsp|quot|#39);/g, (entity) => entities[entity])
    .replace(/\s+/g, " ")
    .trim();
}

/** Discover routes from the generated HTML files. */
async function discoverRoutes(root) {
  const routes = [];
  for (const file of await findHtmlFiles(root)) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    if (relative === "404.html" || relative.startsWith("404/")) continue;

    const route =
      relative === "index.html"
        ? "/"
        : relative.endsWith("/index.html")
          ? `/${relative.slice(0, -"/index.html".length)}/`
          : `/${relative.replace(/\.html$/, "")}`;

    routes.push(`${basePath}${route}`.replace(/\/+/g, "/"));
  }
  return routes.sort();
}

async function findHtmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "_next") continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(entryPath)));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(entryPath);
  }
  return files;
}

async function assertDirectory(directory) {
  const info = await stat(directory);
  if (!info.isDirectory()) throw new Error(`expected ${directory} to be a directory`);
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
