import type { Preview } from '@storybook/react'
import '@radix-ui/themes/styles.css'

import '../src/radix/styles.css'
import { Theme } from '../src/radix/components/Theme/Theme'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (!context.parameters.useRadixTheme) {
        return <Story />
      }

      return (
        <Theme>
          <Story />
        </Theme>
      )
    },
  ],
  tags: [
    'autodocs',
  ],
}

export default preview
