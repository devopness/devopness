import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import preferArrow from 'eslint-plugin-prefer-arrow'
import eslintImport from 'eslint-plugin-import'
import importHelpers from 'eslint-plugin-import-helpers'

export default tseslint.config(
  {
    ignores: [
      'dist',
    ],
  },
  {
    settings: { react: { version: '18.3' } },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: [
      '**/*.{ts,tsx}',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: [
          './tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'prefer-arrow': preferArrow,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: eslintImport,
      'import-helpers': importHelpers,
      react,
    },
    rules: {
      // TypeScript related rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/consistent-type-definitions': [
        'error',
        'type',
      ],
      'no-console': [
        'error',
        {
          allow: [
            'warn',
            'error',
          ],
        },
      ],
      'arrow-spacing': 'warn',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true,
        },
      ],
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
          allowStandaloneDeclarations: true,
        },
      ],
      'array-element-newline': 'error',
      // React related rules
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      // Import related rules
      ...eslintImport.configs.recommended.rules,
      ...eslintImport.configs.errors.rules,
      ...eslintImport.configs.typescript.rules,
      'import/no-unresolved': 'off',
      'import/first': 'error',
      'import/exports-last': 'error',
      'import/group-exports': 'off',
      'import/no-default-export': 'error',
      'import/consistent-type-specifier-style': [
        'error',
        'prefer-top-level',
      ],
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: [
            '/^react/',
            'module',
            [
              '/^src/',
              'parent',
              'sibling',
              'index',
            ],
          ],
          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],
    },
  },
  {
    files: [
      '.storybook/*.ts',
      '.storybook/*.tsx',
      'src/components/**/*.stories.ts',
      'src/components/**/*.stories.tsx',
      'src/radix/**/*.stories.ts',
      'src/radix/**/*.stories.tsx',
      'vite.config.ts',
      'vitest.config.ts',
    ],
    rules: {
      /**
       * Storybook and Vite configuration files use default exports
       *
       * @see {@link https://storybook.js.org/docs/configure/story-rendering#running-code-for-every-story}
       * @see {@link https://storybook.js.org/docs/writing-stories#default-export}
       * @see {@link https://vitejs.dev/config}
       */
      'import/no-default-export': 'off',
      'import/group-exports': 'off',
    },
  }
)
