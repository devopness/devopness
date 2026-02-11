import { resolve } from 'path';
import 'dotenv-expand/config';
import { createMDX } from 'fumadocs-mdx/next';
import { validateEnv } from './src/lib/env.mjs';

validateEnv();

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  turbopack: {
    root: resolve(import.meta.dirname, '..'),
  },
};

export default withMDX(config);
