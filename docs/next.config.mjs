import { createMDX } from 'fumadocs-mdx/next';
import { validateEnv } from './src/lib/env.mjs';
import envLoader from '@next/env';

envLoader.loadEnvConfig(process.cwd());
validateEnv();

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withMDX(config);
