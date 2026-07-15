import { defineConfig } from 'vite-plus'

/**
 * Vite+ config for the SDK package.
 * Keep lint and format behavior scoped to source files so `vp check` stays
 * aligned with the package-local CI workflow.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  fmt: {
    ignorePatterns: [
      'CHANGELOG.md',
      'Dockerfile-dev',
      'Makefile',
      'README.md',
      'dist',
      'coverage',
      'node_modules',
      'package-lock.json',
      'package.json',
      'src/api/generated/**/*',
      'tsconfig.json',
      'vite.config.ts',
      'typedoc.json',
    ],
  },
  lint: {
    ignorePatterns: [
      'CHANGELOG.md',
      'Dockerfile-dev',
      'Makefile',
      'README.md',
      'dist',
      'coverage',
      'node_modules',
      'src/api/generated/**/*',
      'typedoc.json',
    ],
  },
})
