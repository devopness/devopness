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
        subText: 'Última atualização: há 2h',
        tag: {
          text: 'Ativo',
          color: '#10b981',
        },
      },
    ],
    addButtonText: '+ Adicionar',
    footerButtonText: 'VER TODOS',
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
        subText: 'Última atividade: há 2h',
        tag: {
          text: '12 membros',
          color: '#3b82f6',
        },
      },
      {
        id: 2,
        name: 'marketing',
        subText: 'Última atividade: há 5h',
        tag: {
          text: '8 membros',
          color: '#3b82f6',
        },
      },
    ],
    addButtonText: '+ Adicionar',
    footerButtonText: 'VER TODOS',
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
        subText: 'Acesso total ao sistema',
        tag: {
          text: 'Full Access',
          color: '#fbbf24',
          textColor: '#000000',
        },
      },
      {
        id: 2,
        name: 'Read',
        subText: 'Apenas leitura',
        tag: {
          text: 'Read Only',
          color: '#fbbf24',
          textColor: '#000000',
        },
      },
    ],
    addButtonText: '+ Adicionar',
    footerButtonText: 'VER TODOS',
  },
}

const EmptyState: Story = {
  args: {
    title: 'API Tokens',
    icon: 'key',
    iconBackgroundColor: '#fef3c7',
    resources: [],
    footerButtonText: '+ Criar API Token',
    emptyStateTitle: 'Nenhum API Token encontrado',
    emptyStateDescription: 'Crie tokens de API para integrar aplicações externas com segurança.',
  },
}

export default meta
export { Environments, Teams, Roles, EmptyState }