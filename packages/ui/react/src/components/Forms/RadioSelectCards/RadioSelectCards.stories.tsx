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

const sampleGroupedGroups = [
  {
    data: [
      {
        value: 'docker',
        label: 'Docker',
        icon: 'docker',
        description: 'Use the runtime defaults.',
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
        description:
          'Use the runtime defaults without framework helpers or project-specific overrides.',
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
        description: 'A static site without extra platform helpers.',
      },
    ],
  },
  {
    data: [
      {
        value: 'java',
        label: 'Java',
        icon: 'java',
        description: 'Run a standard JVM application.',
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
        description: 'Use the default Node.js runtime configuration.',
      },
      {
        value: 'nodejs-nextjs',
        label: 'Next.js',
        icon: 'nodejs-nextjs',
        description: 'Optimized for the Next.js app router.',
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
        description: 'Use the baseline PHP runtime.',
      },
      {
        value: 'php-laravel',
        label: 'Laravel',
        icon: 'php-laravel',
        description: 'Includes Laravel-specific helpers and defaults.',
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
        description: 'Use the standard Python runtime.',
      },
      {
        value: 'python-django',
        label: 'Django',
        icon: 'python-django',
        description: 'Adds Django-specific runtime defaults.',
      },
      {
        value: 'python-fastapi',
        label: 'FastAPI',
        icon: 'python-fastapi',
        description: 'Optimized for FastAPI applications.',
      },
      {
        value: 'python-fastmcp',
        label: 'FastMCP',
        icon: 'python-fastmcp',
        description: 'Tailored for FastMCP services.',
      },
      {
        value: 'python-flask',
        label: 'Flask',
        icon: 'python-flask',
        description: 'Defaults for a lightweight Flask app.',
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
        description: 'Use the generic Ruby runtime.',
      },
      {
        value: 'ruby-rails',
        label: 'Ruby on Rails',
        icon: 'ruby-rails',
        description: 'Adds Rails-specific defaults and helpers.',
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
    style: {
      margin: '0 auto',
      maxWidth: '72rem',
      width: '100%',
    },
  },
  parameters: {
    layout: 'padded',
  },
}

export default meta
export { Default, GroupedCards, Loading, WithError }
