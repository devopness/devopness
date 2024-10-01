import { getImageAssetURLFor } from '@devopness/ui-icons'
import { create } from '@storybook/theming/create'

const DevopnessTheme = create({
  brandTitle: 'Devopness Design System React Components',
  brandUrl: 'https://www.devopness.com/',
  brandImage: getImageAssetURLFor('logo_devopness_alfa.png'),
  base: 'light',
})

export { DevopnessTheme }
