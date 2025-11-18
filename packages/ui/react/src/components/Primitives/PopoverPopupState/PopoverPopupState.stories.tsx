import type { Meta, StoryObj } from '@storybook/react-vite'

import { PopoverPopupState } from './PopoverPopupState'
import { iconLoader } from 'src/icons'

const meta = {
  title: 'Primitives/PopoverPopupState',
  component: PopoverPopupState,
  argTypes: {
    trigger: {
      control: false,
      description: 'Element that triggers the popover',
    },
    children: {
      control: false,
      description: 'Content displayed inside the popover',
    },
  },
} satisfies Meta<typeof PopoverPopupState>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    trigger: iconLoader('more', 20),
    children: (
      <div style={{ padding: 16, width: 200 }}>Popover content here</div>
    ),
  },
}

export { Default }
export default meta
