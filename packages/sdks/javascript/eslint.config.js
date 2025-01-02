// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { flatConfigs as pluginImportConfigs } from 'eslint-plugin-import';
import pluginNode from "eslint-plugin-n"
import pluginPromise from 'eslint-plugin-promise'

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
  tseslint.configs.recommended,
  pluginImportConfigs.recommended,
  pluginNode.configs['flat/recommended'],
  pluginPromise.configs['flat/recommended']
);
