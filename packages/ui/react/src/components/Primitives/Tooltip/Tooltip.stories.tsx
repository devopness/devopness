import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from '.'
import { Button } from 'src/components'

const meta = {
  component: Tooltip,
  argTypes: {
    enableOnlyWithEllipsisPoints: { control: 'boolean' },
    disableHover: { control: 'boolean' },
    placement: {
      control: 'radio',
      options: [
        'top-start',
        'top',
        'top-end',
        'left-start',
        'left',
        'left-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
      ],
    },
  },
} satisfies Meta<typeof Tooltip>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    title: 'Tooltip content',
    placement: 'bottom',
    /**
     * This prop will be replaced by a Button,
     * see the render option below
     */
    children: <></>,
  },
  parameters: {
    controls: {
      exclude: [
        'ref',
        'children',
        'enableOnlyWithEllipsisPoints',
      ],
    },
  },
  render: ({ children: _, ...props }) => (
    <Tooltip {...props}>
      <Button>Tooltip button</Button>
    </Tooltip>
  ),
}

export default meta
export { Default }
