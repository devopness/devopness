import type { Meta, StoryObj } from '@storybook/react'

import { Label } from './Label'

const meta = {
  title: 'Form/Label',
  component: Label,
  argTypes: {
    help: { control: 'boolean' },
  },
} satisfies Meta<typeof Label>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    value: 'Site',
    help: true,
    helpValue: 'Help here!',
  },
  parameters: {
    controls: {
      exclude: [
        'role',
      ],
    },
  },
}

export default meta
export { Default }
