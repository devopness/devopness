import { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Pagination } from './Pagination'

const meta = {
  component: Pagination,
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
