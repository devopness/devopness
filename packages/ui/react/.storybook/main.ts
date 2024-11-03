import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, join } from 'path'

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(ts|tsx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
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
