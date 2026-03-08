import { resolve } from 'path';

import 'dotenv-expand/config';

import { createMDX } from 'fumadocs-mdx/next';

import { validateEnv } from './src/lib/env.mjs';

validateEnv();

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  // basePath: Where this app is served (e.g., /docs makes all routes start with /docs/)
  // This is the ONLY place that should know about the /docs prefix
  // Fumadocs' baseUrl should be '/' since Next.js adds the prefix automatically
  basePath: '/docs',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  turbopack: {
    root: resolve(import.meta.dirname, '.'),
  },
};

export default withMDX(config);
