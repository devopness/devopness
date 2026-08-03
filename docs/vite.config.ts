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
      "build",
      "docs/**",
      "node_modules",
      "next-env.d.ts",
      "next.config.mjs",
      "out",
      "package-lock.json",
      "postcss.config.mjs",
      "public",
      "scripts/**",
      "source.config.ts",
      "src/**",
    ],
  },
  lint: {
    ignorePatterns: [
      ".prettierrc.json",
      ".next",
      ".source",
      "build",
      "docs/**",
      "node_modules",
      "next-env.d.ts",
      "next.config.mjs",
      "out",
      "package-lock.json",
      "postcss.config.mjs",
      "public",
      "scripts/**",
      "source.config.ts",
      "src/**",
    ],
  },
});
