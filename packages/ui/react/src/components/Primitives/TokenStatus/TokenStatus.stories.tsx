import type { Meta, StoryObj } from '@storybook/react-vite'

import { TokenStatus } from './TokenStatus'

const meta = {
  component: TokenStatus,
  title: 'Primitives/TokenStatus',
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'expired', 'revoked'],
    },
  },
} satisfies Meta<typeof TokenStatus>

type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: {
    status: 'active',
  },
}

export const Expired: Story = {
  args: {
    status: 'expired',
  },
}

export const Revoked: Story = {
  args: {
    status: 'revoked',
  },
}

export default meta
