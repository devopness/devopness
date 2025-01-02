// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      "jest.config.js",
      "tests/*",
      "node_modules",
      "dist",
      "coverage",
      "src/services/AuthService.ts",
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.recommended
);
