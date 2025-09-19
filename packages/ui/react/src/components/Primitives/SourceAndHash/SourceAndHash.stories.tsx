import type { Meta, StoryObj } from '@storybook/react'

import { SourceAndHash } from './SourceAndHash'
import type { SourceAndHashProps } from './SourceAndHash'

const meta: Meta<SourceAndHashProps> = {
  title: 'Primitives/SourceAndHash',
  component: SourceAndHash,
  args: {
    commit: {
      hash: 'abcd1234567890',
      url: 'https://github.com/repo/commit/abcd1234',
      message: 'Fix bug in deployment',
    },
    deployment: {
      source_ref: 'feature/new-feature-branch',
      source_type: 'branch',
    },
  },
}

type Story = StoryObj<SourceAndHashProps>

const Default: Story = {}

const WithCustomTooltip: Story = {
  args: {
    tooltipOptions: { title: 'Custom tooltip' },
  },
}

const WithoutSourceRef: Story = {
  args: {
    deployment: {},
  },
}

export default meta
export { Default, WithCustomTooltip, WithoutSourceRef }
