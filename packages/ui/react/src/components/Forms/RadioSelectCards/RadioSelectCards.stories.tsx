import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioSelectCards } from './RadioSelectCards'

const meta: Meta<typeof RadioSelectCards> = {
  title: 'Form/RadioSelectCards',
  component: RadioSelectCards,
  argTypes: {
    data: { control: 'object' },
    density: {
      control: 'radio',
      options: ['default', 'compact'],
    },
    error: { control: 'text' },
    groups: { control: 'object' },
    isLoading: { control: 'boolean' },
    name: { control: 'text' },
    showSelectionIndicator: { control: 'boolean' },
    style: { control: 'object' },
  },
  tags: ['autodocs'],
}

type Story = StoryObj<typeof RadioSelectCards>

const sampleData = [
  { value: 'gitlab', label: 'GitLab', icon: 'gitlab' },
  {
    value: 'github',
    label: 'GitHub',
    icon: { name: 'github', color: 'blue' },
  },
]

const sampleStackGroups = [
  {
    data: [
      {
        value: 'docker',
        label: 'Docker',
        icon: 'docker',
        description: 'Use the runtime defaults without framework helpers.',
      },
    ],
  },
  {
    label: '.NET (C#/F#)',
    description: 'Choose the framework and runtime used to build your app.',
    data: [
      {
        value: 'dotnetcore',
        label: '.NET (C#/F#)',
        icon: 'dotnetcore',
        description: 'Use the runtime defaults without framework helpers.',
      },
      {
        value: 'dotnetcore-aspnetcore',
        label: 'ASP.NET Core',
        icon: 'dotnetcore-aspnetcore',
        description: 'Framework defaults will be applied automatically.',
      },
    ],
  },
  {
    data: [
      {
        value: 'html',
        label: 'HTML (static)',
        icon: 'html',
        description: 'Use the runtime defaults without framework helpers.',
      },
    ],
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

const StackGallery: Story = {
  args: {
    name: 'stackGallery',
    density: 'compact',
    groups: sampleStackGroups,
    showSelectionIndicator: false,
  },
}

export default meta
export { Default, Loading, StackGallery, WithError }
