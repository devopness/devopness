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
        'src/test-utils/**/*.ts',
        '.storybook/**/*.ts',
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
