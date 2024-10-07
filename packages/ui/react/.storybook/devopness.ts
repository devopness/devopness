import { create } from '@storybook/theming/create'

import { getImageAssetUrl } from '../src/icons/getImageAssetUrl'

export default create({
  brandTitle: 'Devopness Design System React Components',
  brandUrl: 'https://www.devopness.com/',
  brandImage: getImageAssetUrl('logo_devopness_alfa.png'),
  base: 'light',
})
