import type { Meta, StoryObj } from '@storybook/react-vite'

import { Icon } from '.'
import { iconList } from 'src/icons/iconLoader'

const meta = {
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: iconList.map(({ name }) => name),
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
      opacity={(props.opacity ?? 100) / 100}
    />
  ),
} satisfies Meta<typeof Icon>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    name: 'help',
    ariaLabel: 'help',
    color: 'purple.800',
    opacity: 100,
    size: 40,
  },
}

export default meta
export { Primary }
