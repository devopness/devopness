import type { Meta, StoryObj } from '@storybook/react-vite'

import { Link } from '.'

const meta = {
  component: Link,
  argTypes: {
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Link>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    to: 'http://www.devopness.com',
    children: 'Link',
    target: '_blank',
  },
}

export default meta
export { Primary }
