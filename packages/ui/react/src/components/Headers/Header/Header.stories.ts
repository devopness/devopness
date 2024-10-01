import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Header } from './Header'

const meta = {
  title: 'Example/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: [
    'autodocs',
  ],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
} satisfies Meta<typeof Header>

type Story = StoryObj<typeof meta>

const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
}

const LoggedOut: Story = {}
export default meta
export { LoggedIn, LoggedOut }
