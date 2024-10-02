import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button } from './Button'
import { iconList } from 'src/icons/iconLoader'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: [
    'autodocs',
  ],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    icon: {
      control: 'select',
      options: iconList.map(({ accessor }) => accessor),
    },
    iconColor: { control: 'color' },
    children: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
const Primary: Story = {
  args: {
    icon: 'plus',
    children: 'Add Application',
    typeSize: 'default',
    buttonType: 'Default'
  },
}

export default meta
export { Primary }
