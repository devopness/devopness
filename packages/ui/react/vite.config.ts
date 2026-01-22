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
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        radix: resolve(__dirname, 'src/radix/index.tsx'),
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
    },
  },
})
