import { resolve } from "path"
import { defineConfig } from 'vite'
import dts from "vite-plugin-dts"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
  lib: {
   // Could also be a dictionary or array of multiple entry points
   entry: resolve(__dirname, "src/index.ts"),
   formats: ["es"],
  },
  rollupOptions: {
   external: ["react", "react-dom"],
   output: {
    globals: {
     react: "React",
     "react-dom": "ReactDOM",
    },
   },
  },
 },
})
