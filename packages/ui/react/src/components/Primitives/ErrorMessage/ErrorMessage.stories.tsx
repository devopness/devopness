import { Meta, StoryObj } from '@storybook/react'

import { ErrorMessage } from './index'

const meta = {
  component: ErrorMessage,
  argTypes: {},
} satisfies Meta<typeof ErrorMessage>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    error: {
      message: 'This is an error message',
    },
  },
}

export default meta
export { Default }
