import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
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
    tsconfigPaths({
      projects: [
        resolve(__dirname, 'tsconfig.json'),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        radix: resolve(__dirname, 'src/radix/index.tsx'),
        'radix/styles': resolve(__dirname, 'src/radix/styles.css'),
      },
      formats: [
        'es',
        'cjs',
      ],
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
        assetFileNames: (assetInfo) => {
          // eslint-disable-next-line @typescript-eslint/no-deprecated -- Rollup 'name' deprecated in favor of 'names'; still works
          const name = assetInfo.name ?? ''
          if (name.endsWith('.css')) return 'radix/styles.css'
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
