import { defineConfig } from "vite-plus";

/**
 * Vite+ config for docs checks only.
 * Next.js still handles the site build; `vp check` uses this file for lint and format rules.
 */
export default defineConfig({
  fmt: {
    ignorePatterns: [
      ".prettierrc.json",
      ".next",
      ".source",
      "docs/**",
      "build",
      "node_modules",
      "next-env.d.ts",
      "out",
      "package-lock.json",
      "public",
      "postcss.config.mjs",
      "scripts/**",
      "source.config.ts",
      "src/**",
      "next.config.mjs",
    ],
  },
  lint: {
    ignorePatterns: [
      ".prettierrc.json",
      ".next",
      ".source",
      "docs/**",
      "build",
      "node_modules",
      "next-env.d.ts",
      "out",
      "package-lock.json",
      "postcss.config.mjs",
      "public",
      "scripts/**",
      "source.config.ts",
      "src/**",
      "next.config.mjs",
    ],
  },
});
