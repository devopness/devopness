import type { Meta, StoryObj } from '@storybook/react-vite'

import { Status } from './Status'
import { ActionStatus } from 'src/constants'

const meta: Meta<typeof Status> = {
  title: 'Primitives/Status',
  component: Status,
  tags: [
    'autodocs',
  ],
  argTypes: {
    status: { control: 'select', options: Object.values(ActionStatus) },
    statusHumanReadable: { control: 'text' },
    statusReasonHumanReadable: { control: 'text' },
  },
}

type Story = StoryObj<typeof Status>

const Default: Story = {
  args: {
    status: 'completed',
    statusHumanReadable: 'Completed',
    statusReasonHumanReadable: 'All tasks finished successfully',
  },
}

export default meta
export { Default }
