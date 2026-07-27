import { defineConfig } from "vite-plus";

/**
 * Vite+ config for docs checks only.
 * Next.js still handles the site build; `vp check` uses this file for lint and format rules.
 */
export default defineConfig({
  fmt: {
    ignorePatterns: [
      ".next",
      ".source",
      "build",
      "docs/**/meta.json",
      "node_modules",
      "next-env.d.ts",
      "out",
      "package-lock.json",
      "public",
    ],
  },
  lint: {
    ignorePatterns: [".next", ".source", "build", "node_modules", "next-env.d.ts", "out", "public"],
  },
});
