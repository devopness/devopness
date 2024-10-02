import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from './Button'
import { iconList } from 'src/icons/iconLoader'

const meta = {
  component: Button,
  argTypes: {
    icon: {
      control: 'select',
      options: iconList.map(({ accessor }) => accessor),
    },
    iconColor: { control: 'color' },
    children: { control: 'text' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    icon: 'plus',
    children: 'Add Application',
    typeSize: 'default',
    buttonType: 'Default',
  },
}

export default meta
export { Primary }
