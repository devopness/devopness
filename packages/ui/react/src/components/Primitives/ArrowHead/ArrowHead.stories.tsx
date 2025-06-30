import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ArrowHead } from '.'

const meta = {
  component: ArrowHead,
  argTypes: {
    fill: { control: 'color' },
    stroke: { control: 'color' },
    style: {
      control: 'object',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ArrowHead>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    fill: '#FFFFFF',
    stroke: '#786EFD',
  },
}

export default meta
export { Default }
