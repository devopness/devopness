import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, join } from 'path'

/**
 * Ensures modules will reference where the package is installed, even in monorepo environment
 *
 * @param packageName Package name to resolve path to file `node_modules/<package>/package.json`
 *
 * @see {@link https://storybook.js.org/docs/faq#how-do-i-fix-module-resolution-in-special-environments}
 */
function getAbsolutePath(packageName: string) {
  return dirname(require.resolve(join(packageName, 'package.json')))
}

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(ts|tsx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },

  docs: {},
}

export default config
