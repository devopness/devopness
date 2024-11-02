import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from '.'
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
    children: 'Add Application',
    typeSize: 'default',
    buttonType: 'Default',
  },
}

// eslint-disable-next-line import/no-default-export
export default meta
export { Primary }
