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
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
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
      'arrow-body-style': 'error',
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
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'import/exports-last': 'error',
      'import/group-exports': 'error',
      'import/no-default-export': 'error',
      'import/named': 'error',
      'import/no-duplicates': 'error',
      'import/consistent-type-specifier-style': [
        'error',
        'prefer-top-level',
      ],
      'import/first': 'error',
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
  }
)