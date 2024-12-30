import { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Pagination } from './Pagination'

const meta = {
  component: Pagination,
  argTypes: {
    firstPaginateAction: {
      action: 'First page click',
    },
    previousPaginateAction: {
      action: 'Previous page click',
    },
    nextPaginateAction: {
      action: 'Next page click',
    },
    lastPaginateAction: {
      action: 'Last page click',
    },
    disableAllActions: {
      control: 'boolean',
    },
    disablePreviousActions: {
      control: 'boolean',
    },
    disableNextActions: {
      control: 'boolean',
    },
    hideFirstAndLastButton: {
      control: 'boolean',
    },
  },
  parameters: {
    controls: {
      exclude: [
        'firstPaginateAction',
        'previousPaginateAction',
        'nextPaginateAction',
        'lastPaginateAction',
      ],
    },
  },
} satisfies Meta<typeof Pagination>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    disableAllActions: false,
    disablePreviousActions: false,
    disableNextActions: false,
    hideFirstAndLastButton: false,
    firstPaginateAction: () => fn(),
    previousPaginateAction: () => fn(),
    nextPaginateAction: () => fn(),
    lastPaginateAction: () => fn(),
  },
}

export default meta
export { Default }
