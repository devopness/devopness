import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from './Label'

const meta = {
  title: 'Primitives/Label',
  component: Label,
} satisfies Meta<typeof Label>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    htmlFor: 'site',
    value: 'Site',
    helpValue: 'Help here!',
  },
  parameters: {
    controls: {
      exclude: ['role'],
    },
  },
}

export default meta
export { Default }
