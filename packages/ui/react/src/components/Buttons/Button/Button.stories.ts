import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from '.'
import { iconList } from 'src/icons/iconLoader'

const meta = {
  component: Button,
  argTypes: {
    icon: {
      control: 'select',
      options: iconList.map(({ name }) => name),
    },
    iconColor: { control: 'color' },
    children: { control: 'text' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    children: 'Add Application',
    typeSize: 'default',
    buttonType: 'Default',
  },
}

export default meta
export { Primary }
