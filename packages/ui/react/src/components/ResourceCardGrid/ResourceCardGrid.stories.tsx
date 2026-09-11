import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ResourceCardGrid } from './ResourceCardGrid'

const noopPagination = {
  firstPaginateAction: fn(),
  previousPaginateAction: fn(),
  nextPaginateAction: fn(),
  lastPaginateAction: fn(),
}

const mockResources = [
  {
    name: 'devopness-web-app',
    organization: 'Devopness',
    createdAt: new Date(),
  },
  { name: 'jef-testing-nextjs-migration-billing' },
  { name: 'aladino-teste-erros-console-web-app-with-a-very-long-name' },
  { name: 'tst-d-o-to-hetzner' },
  { name: 'azure-bug-in-remove-failed-server' },
]

const meta = {
  title: 'Components/ResourceCardGrid',
  component: ResourceCardGrid,
  args: {
    resourceType: 'application',
    resources: mockResources,
    onCreateResource: fn(),
    pageCount: 1,
    pagination: noopPagination,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ResourceCardGrid>

type Story = StoryObj<typeof meta>

const Default: Story = {}

const Empty: Story = {
  args: {
    resources: [],
  },
}

const WithPagination: Story = {
  args: {
    pageCount: 3,
  },
}

export default meta
export { Default, Empty, WithPagination }
