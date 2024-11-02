import { dirname, join } from "path";
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(ts|tsx)',
  ],

  addons: [getAbsolutePath("@storybook/addon-essentials"), "@chromatic-com/storybook"],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript"
  },

  docs: {}
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
