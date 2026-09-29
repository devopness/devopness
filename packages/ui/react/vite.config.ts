import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite-plus'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  fmt: {
    ignorePatterns: [
      'node_modules',
      '*.yml',
      '.eslintignore',
      '.gitignore',
      'package-lock.json',
      'yarn.lock',
    ],
    printWidth: 80,
    semi: false,
    singleAttributePerLine: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: [
        'vite.config.ts',
        'src/**/*.test.*',
        'src/**/*.stories.*',
        'src/setupTest.ts',
        // `*.{ts,tsx}` rather than `*.ts`: `custom-render.tsx` is a test helper
        // and was not being excluded, so the declaration pass tried to emit
        // types for it and failed on a type it could not name portably. The
        // directory is test scaffolding and has no business in a published
        // package's types either way.
        'src/test-utils/**/*.{ts,tsx}',
        '.storybook/**/*.{ts,tsx}',
      ],
      entryRoot: 'src',
    }),
  ],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
    tsconfigPaths: true,
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        radix: resolve(__dirname, 'src/radix/index.tsx'),
        'radix/styles': resolve(__dirname, 'src/radix/styles.css'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-table',
        /^react(\/.*)?$/,
      ],
      output: {
        assetFileNames: (assetInfo: { name?: string }) => {
          const name = assetInfo.name ?? ''
          if (name.endsWith('.css')) return 'radix/styles.css'
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
} as any)
