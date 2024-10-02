/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    tsconfigPaths(),
  ],
  define: {
    'process.env': process.env,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: resolve(__dirname, 'src/setupTest.ts'),
    env: loadEnv('', process.cwd(), ''),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: [
        'es',
      ],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
