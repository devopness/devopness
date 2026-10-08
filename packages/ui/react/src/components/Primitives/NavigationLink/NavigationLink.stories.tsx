import type { Meta, StoryObj } from '@storybook/react-vite'

import { NavigationLink } from '.'

const meta = {
  component: NavigationLink,
  argTypes: {
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof NavigationLink>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    to: 'http://www.devopness.com',
    children: 'NavigationLink',
    target: '_blank',
  },
}

export default meta
export { Primary }
