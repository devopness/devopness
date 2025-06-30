import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: [
    'autodocs',
  ],
}

export default preview
