import { resolve } from 'path'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: resolve(__dirname, 'src/setupTest.ts'),
      server: {
        deps: {
          // @mui/material >=9.1.0 ships internal/Transition.mjs which does a bare directory import
          // of 'react-transition-group/TransitionGroupContext'. Node ESM doesn't support directory
          // imports and react-transition-group has no exports map for this entry. Inlining forces
          // Vite to process MUI through its own resolver (which handles directory imports), instead
          // of handing the .mjs file directly to Node's native ESM loader.
          inline: ['@mui/material'],
        },
      },
    },
  })
)
