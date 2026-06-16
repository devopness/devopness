import type { Meta, StoryObj } from '@storybook/react-vite'

import { ErrorBanner } from './index'

const meta = {
  component: ErrorBanner,
  argTypes: {},
} satisfies Meta<typeof ErrorBanner>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    title: 'Something went wrong',
    description: 'We encountered an error while processing your request.',
  },
}

const WithErrorDetail: Story = {
  args: {
    title: 'OAuth Authorization Failed',
    description: 'Unable to complete the authorization process.',
    errorDetail: 'Missing required parameter: client_id',
  },
}

const WithAction: Story = {
  args: {
    title: 'Connection Failed',
    description: 'We could not connect to the provider.',
    errorDetail: 'The provider returned an error: access_denied',
    action: {
      label: 'Try Again',
      href: '/oauth/authorize',
    },
  },
}

export default meta
export { Default, WithErrorDetail, WithAction }
