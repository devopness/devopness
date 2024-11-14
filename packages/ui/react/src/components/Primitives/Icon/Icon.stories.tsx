import type { Meta, StoryObj } from '@storybook/react'

import { Icon } from '.'
import { iconList } from 'src/icons/iconLoader'

const meta = {
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: iconList.map(({ accessor }) => accessor),
    },
    opacity: {
      control: 'range',
      min: 1,
      max: 100,
      step: 1,
    },
  },
  render: (props) => (
    <Icon
      {...props}
      opacity={(props.opacity ?? 1) / 100}
    />
  ),
} satisfies Meta<typeof Icon>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    name: 'help',
    size: 40,
    color: 'purple.800',
    ariaLabel: 'help',
  },
}

export default meta
export { Primary }
