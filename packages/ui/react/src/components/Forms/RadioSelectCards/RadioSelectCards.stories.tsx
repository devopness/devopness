import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioSelectCards } from './RadioSelectCards'

const meta: Meta<typeof RadioSelectCards> = {
  title: 'Form/RadioSelectCards',
  component: RadioSelectCards,
  argTypes: {
    data: { control: 'object' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    name: { control: 'text' },
    style: { control: 'object' },
  },
}

type Story = StoryObj<typeof RadioSelectCards>

const sampleData = [
  { value: 'Gitlab', label: 'gitlab', icon: 'gitlab' },
  {
    value: 'Github',
    label: 'github',
    icon: { name: 'github', color: 'blue' },
  },
]

const Default: Story = {
  args: {
    name: 'exampleRadio',
    data: sampleData,
  },
}

const WithError: Story = {
  args: {
    name: 'exampleRadio',
    data: sampleData,
    error: { message: 'Please select an option' },
  },
}

const Loading: Story = {
  args: {
    name: 'exampleRadio',
    data: [],
    isLoading: true,
  },
}

export default meta
export { Default, WithError, Loading }
