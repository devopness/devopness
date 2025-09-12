import type { Meta, StoryObj } from '@storybook/react'

import { LoadStarship, LoadStarshipProps } from './LoadStarship'

const meta: Meta<LoadStarshipProps> = {
  title: 'Primitives/LoadStarship',
  component: LoadStarship,
}

type Story = StoryObj<LoadStarshipProps>

const Default: Story = {
  args: {
    isFullContainer: false,
  },
}

const FullContainer: Story = {
  args: {
    isFullContainer: true,
  },
}

export default meta
export { Default, FullContainer }
