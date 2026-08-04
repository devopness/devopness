import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ResourceDataCardList } from './List'
import { getResourceCardAvatar } from './helpers'

const noopPagination = {
  firstPaginateAction: fn(),
  previousPaginateAction: fn(),
  nextPaginateAction: fn(),
  lastPaginateAction: fn(),
}

const mockCards = [
  {
    headerLabel: 'Team',
    title: 'Platform',
    ...getResourceCardAvatar('Platform'),
    items: [{ label: 'Members', value: '12' }],
    viewDetailsHref: '/teams/platform',
  },
  {
    headerLabel: 'Team',
    title: 'Infra',
    ...getResourceCardAvatar('Infra'),
    items: [{ label: 'Members', value: '8' }],
    viewDetailsHref: '/teams/infra',
  },
]

const meta = {
  title: 'Components/ResourceDataCard/ResourceDataCardList',
  component: ResourceDataCardList,
  args: {
    cards: mockCards,
    resourceTypeHumanReadable: 'Team',
    pagination: noopPagination,
  },
} satisfies Meta<typeof ResourceDataCardList>

type Story = StoryObj<typeof meta>

const Default: Story = {}

const Empty: Story = {
  args: {
    cards: [],
    emptyTableMessage: 'No items yet',
  },
}

const WithAddCard: Story = {
  args: {
    onAdd: fn(),
  },
}

const WithLinkCard: Story = {
  args: {
    onLink: fn(),
  },
}

const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export default meta
export { Default, Empty, WithAddCard, WithLinkCard, Loading }
