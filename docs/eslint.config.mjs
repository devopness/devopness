import pluginNext from '@next/eslint-plugin-next';
import eslintTypescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-plugin-prettier/recommended'; // Import Prettier config

import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const eslintConfig = defineConfig([
  prettierConfig, // Add Prettier config to the extends array

  // Global ignores
  globalIgnores([
    'node_modules/**',
    '.source/**',

    // Next.js folders:
    '.next/**',
    'build/**',
    'out/**',
    'public/**',
    'next-env.d.ts',
  ]),

  // Global linter settings
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      '@next/next': pluginNext,
    },
  },

  // Base JS/TS config
  {
    files: [
      '**/*.{js,jsx,mjs,ts,tsx}',
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        es6: true,
      },
    },
    plugins: {
      '@next/next': pluginNext,
      'react-hooks': reactHooks,
      import: eslintImport,
      prettier,
      '@typescript-eslint': eslintTypescript,
    },
    rules: {
      // TO DO: make rules more strict after cleaning initial linter errors
      // * or even better, instead of "more strict" just use prettier/eslint defaults,
      // to reduce the amount of rules we need to maintain
      'prettier/prettier': 'error', // Prettier errors show up in ESLint output
      camelcase: 'off',
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      ...prettier.configs.recommended.rules,
      ...eslintTypescript.configs.recommended.rules,

      'no-console': 'warn', // Warning for console.log
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-use-before-define': [
        0,
      ],
      'react/jsx-filename-extension': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-unused-prop-types': 'off',
      'react/require-default-props': 'off',
      'react/no-unescaped-entities': 'off',

      // Prettier conflict resolution - must come LAST to override conflicting rules
      ...eslintConfigPrettier.rules,
    },
  },

  // TypeScript-specific overrides
  {
    files: [
      '**/*.+(ts|tsx)',
    ],
    plugins: {
      '@typescript-eslint': eslintTypescript,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // TO DO: make rules more strict after cleaning initial linter errors
      // * or even better, instead of "more strict" just use prettier/eslint defaults,
      // to reduce the amount of rules we need to maintain
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-use-before-define': [
        1,
      ],
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Jest test files: enable Jest globals (describe, it, beforeEach, etc.)
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);

export default eslintConfig;
