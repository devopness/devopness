module.exports = {
  root: true,
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "project": "./tsconfig.json"
  },
  ignorePatterns: ["jest.config.js", "tests/*"]
};
