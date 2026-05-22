import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { IconButton } from '.'
import { iconList } from 'src/icons/iconLoader'

const meta = {
  component: IconButton,
  argTypes: {
    name: {
      control: 'select',
      options: iconList.map(({ name }) => name),
    },
    color: { control: 'text' },
    backgroundColor: { control: 'text' },
    borderColor: { control: 'text' },
    size: { control: 'number' },
    padding: { control: 'number' },
    variant: {
      control: 'inline-radio',
      options: [
        'primary',
        'ghost',
        'outlined',
      ],
    },
  },
  args: {
    name: 'edit',
    'aria-label': 'Edit',
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    variant: 'primary',
  },
}

const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
}

const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
}

const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export default meta
export { Primary, Ghost, Outlined, Disabled }
