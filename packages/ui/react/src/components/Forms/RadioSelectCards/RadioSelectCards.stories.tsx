import type { Meta, StoryObj } from '@storybook/react-vite'
import { styled } from 'styled-components'

import { RadioSelectCards } from './RadioSelectCards'

const GroupedCardsFrame = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1120px;
  padding: 0 1.5rem 1.5rem;
  width: 100%;

  @media (max-width: 600px) {
    padding: 0 0.75rem 0.75rem;
  }
`

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

const sampleGroupedGroups = [
  {
    data: [
      {
        value: 'docker',
        label: 'Docker',
        icon: 'docker',
      },
    ],
  },
  {
    label: '.NET (C#/F#)',
    data: [
      {
        value: 'dotnetcore',
        label: '.NET (C#/F#)',
        icon: 'dotnetcore',
      },
      {
        value: 'dotnetcore-aspnetcore',
        label: 'ASP.NET Core',
        icon: 'dotnetcore-aspnetcore',
      },
    ],
  },
  {
    data: [
      {
        value: 'html',
        label: 'HTML (static)',
        icon: 'html',
      },
    ],
  },
  {
    data: [
      {
        value: 'java',
        label: 'Java',
        icon: 'java',
      },
    ],
  },
  {
    label: 'Node.js',
    data: [
      {
        value: 'nodejs',
        label: 'Node.js',
        icon: 'nodejs',
      },
      {
        value: 'nodejs-nextjs',
        label: 'Next.js',
        icon: 'nodejs-nextjs',
      },
    ],
  },
  {
    label: 'PHP',
    data: [
      {
        value: 'php',
        label: 'PHP',
        icon: 'php',
      },
      {
        value: 'php-laravel',
        label: 'Laravel',
        icon: 'php-laravel',
      },
    ],
  },
  {
    label: 'Python',
    data: [
      {
        value: 'python',
        label: 'Python',
        icon: 'python',
      },
      {
        value: 'python-django',
        label: 'Django',
        icon: 'python-django',
      },
      {
        value: 'python-fastapi',
        label: 'FastAPI',
        icon: 'python-fastapi',
      },
      {
        value: 'python-fastmcp',
        label: 'FastMCP',
        icon: 'python-fastmcp',
      },
      {
        value: 'python-flask',
        label: 'Flask',
        icon: 'python-flask',
      },
    ],
  },
  {
    label: 'Ruby',
    data: [
      {
        value: 'ruby',
        label: 'Ruby',
        icon: 'ruby',
      },
      {
        value: 'ruby-rails',
        label: 'Ruby on Rails',
        icon: 'ruby-rails',
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

const GroupedCards: Story = {
  args: {
    name: 'stackGallery',
    density: 'compact',
    groups: sampleGroupedGroups,
    showSelectionIndicator: false,
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <GroupedCardsFrame>
      <RadioSelectCards {...args} />
    </GroupedCardsFrame>
  ),
}

export default meta
export { Default, GroupedCards, Loading, WithError }
