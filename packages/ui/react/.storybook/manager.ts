import { addons } from 'storybook/manager-api'

import DevopnessTheme from './devopness'

addons.setConfig({
  sidebar: {
    showRoots: false,
  },
  theme: DevopnessTheme,
})
