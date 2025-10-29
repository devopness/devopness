import { Meta, StoryObj } from '@storybook/react-vite'

import { CopyToClipboard } from './CopyToClipboard'

const meta: Meta<typeof CopyToClipboard> = {
  title: 'Primitives/CopyToClipboard',
  component: CopyToClipboard,
  argTypes: {
    id: { control: 'text', description: 'Unique identifier for content' },
    children: { control: 'text', description: 'Content to be copied' },
  },
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    id: 'example',
    children: 'This is some text to copy',
  },
}

export default meta
export { Default }
