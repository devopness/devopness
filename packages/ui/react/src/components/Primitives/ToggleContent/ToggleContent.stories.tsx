import type { Meta, StoryObj } from '@storybook/react-vite'

import { ToggleContent } from './ToggleContent'

const meta = {
  component: ToggleContent,
  title: 'Primitives/ToggleContent',
  argTypes: {
    isSensitiveContent: {
      control: 'boolean',
      description: 'Whether the content is sensitive and hidden by default',
    },
    showWarning: {
      control: 'boolean',
      description: 'Show warning when revealing sensitive content',
    },
    hiddenContentPlaceholder: {
      control: 'text',
      description: 'Placeholder to show when content is hidden',
    },
    showHiddenContentPlaceholder: {
      control: 'boolean',
      description: 'Whether to show hidden content placeholder',
    },
    children: {
      control: 'text',
      description: 'Content to display inside the ToggleContent',
    },
  },
} satisfies Meta<typeof ToggleContent>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    isSensitiveContent: true,
    children: 'Sensitive Data',
  },
}

const ShowWarning: Story = {
  args: {
    isSensitiveContent: true,
    showWarning: true,
    children: 'Sensitive Data',
  },
}

const NonSensitive: Story = {
  args: {
    isSensitiveContent: false,
    children: 'Public Data',
  },
}

const CustomPlaceholder: Story = {
  args: {
    isSensitiveContent: true,
    hiddenContentPlaceholder: '**** HIDDEN ****',
    children: 'Secret Data',
  },
}

export default meta
export { Default, ShowWarning, NonSensitive, CustomPlaceholder }
