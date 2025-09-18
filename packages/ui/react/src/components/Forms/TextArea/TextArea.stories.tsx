import type { Meta, StoryObj } from '@storybook/react'

import { TextArea } from './TextArea'
import type { TextAreaProps } from './TextArea'

const meta: Meta<TextAreaProps> = {
  title: 'Form/TextArea',
  component: TextArea,
  args: {
    placeholder: 'Type your message here...',
  },
}

type Story = StoryObj<TextAreaProps>

const Default: Story = {}

const WithLabel: Story = {
  args: {
    label: { value: 'Description' },
  },
}

const WithError: Story = {
  args: {
    label: { value: 'Description' },
    error: { message: 'Required field' },
  },
}

const WithNoResize: Story = {
  args: {
    label: { value: 'Comments' },
    isResizable: false,
  },
}

const WhitHelpValue: Story = {
  args: {
    label: { helpValue: 'Help value', value: 'Description' },
  },
}

export default meta
export { Default, WithLabel, WithError, WithNoResize, WhitHelpValue }
