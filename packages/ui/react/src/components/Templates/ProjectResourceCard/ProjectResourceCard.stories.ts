import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconList } from '../../../icons/iconLoader'
import { ProjectResourceCard } from './ProjectResourceCard'

const meta = {
  component: ProjectResourceCard,
  title: 'Templates/ProjectResourceCard',
  argTypes: {
    icon: {
      control: 'select',
      options: iconList.map(({ name }) => name),
    },
    onAdd: { action: 'onAdd' },
    onFooterAction: { action: 'onFooterAction' },
  },
  args: {
    onAdd: fn(),
    onFooterAction: fn(),
  },
} satisfies Meta<typeof ProjectResourceCard>

type Story = StoryObj<typeof meta>

const Environments: Story = {
  args: {
    title: 'Environments',
    icon: 'gear',
    iconBackgroundColor: '#f5f5dc',
    resources: [
      {
        id: 1,
        name: 'Production',
        subText: 'Last updated: 2h ago',
        tag: {
          text: 'Active',
          color: '#10b981',
        },
      },
    ],
    addButtonText: '+ Add',
    footerButtonText: 'VIEW ALL',
  },
}

const Teams: Story = {
  args: {
    title: 'Teams',
    icon: 'teamOutline',
    iconBackgroundColor: '#e6ecff',
    resources: [
      {
        id: 1,
        name: 'developers',
        subText: 'Last activity: 2h ago',
        tag: {
          text: '12 members',
          color: '#3b82f6',
        },
      },
      {
        id: 2,
        name: 'marketing',
        subText: 'Last activity: 5h ago',
        tag: {
          text: '8 members',
          color: '#3b82f6',
        },
      },
    ],
    addButtonText: '+ Add',
    footerButtonText: 'VIEW ALL',
  },
}

const Roles: Story = {
  args: {
    title: 'Roles',
    icon: 'success',
    iconBackgroundColor: '#dcecff',
    resources: [
      {
        id: 1,
        name: 'Admin',
        subText: 'Full system access',
        tag: {
          text: 'Full Access',
          color: '#fbbf24',
          textColor: '#000000',
        },
      },
      {
        id: 2,
        name: 'Read',
        subText: 'Read only',
        tag: {
          text: 'Read Only',
          color: '#fbbf24',
          textColor: '#000000',
        },
      },
    ],
    addButtonText: '+ Add',
    footerButtonText: 'VIEW ALL',
  },
}

const EmptyState: Story = {
  args: {
    title: 'API Tokens',
    icon: 'key',
    iconBackgroundColor: '#fef3c7',
    resources: [],
    footerButtonText: '+ Create API Token',
    emptyStateTitle: 'No API Tokens found',
    emptyStateDescription: 'Create API tokens to securely integrate external applications.',
  },
}

export default meta
export { Environments, Teams, Roles, EmptyState }