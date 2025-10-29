import type { Meta, StoryObj } from '@storybook/react-vite'

import { FormLoading } from './FormLoading'

const meta: Meta<typeof FormLoading> = {
  title: 'Form/FormLoading',
  component: FormLoading,
  args: {
    ariaLabel: 'Loading form',
  },
}

type Story = StoryObj<typeof FormLoading>

const Default: Story = {
  args: {
    ariaLabel: 'Loading form content',
  },
}

const WithCustomAriaLabel: Story = {
  args: {
    ariaLabel: 'Form is loading...',
  },
}

export default meta
export { Default, WithCustomAriaLabel }
