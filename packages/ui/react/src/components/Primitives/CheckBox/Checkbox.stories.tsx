import type { Meta, StoryObj } from '@storybook/react'

import { CheckBox } from './Checkbox'

const meta: Meta<typeof CheckBox> = {
  title: 'Primitives/Checkbox',
  component: CheckBox,
  tags: [
    'autodocs',
  ],
}

type Story = StoryObj<typeof CheckBox>

const Default: Story = {
  args: {
    isChecked: false,
    isStroke: false,
    disabled: false,
  },
}

const Checked: Story = {
  args: {
    isChecked: true,
  },
}

const Disabled: Story = {
  args: {
    disabled: true,
  },
}

const Error: Story = {
  args: {
    hasError: true,
  },
}

const Stroke: Story = {
  args: {
    isChecked: true,
    isStroke: true,
  },
}

export default meta
export { Default, Checked, Disabled, Stroke, Error }
