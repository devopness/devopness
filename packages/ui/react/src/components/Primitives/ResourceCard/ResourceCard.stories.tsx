import { Meta, StoryObj } from '@storybook/react-vite'

import { ResourceCard } from './ResourceCard'

const meta: Meta<typeof ResourceCard> = {
  title: 'Primitives/ResourceCard',
  component: ResourceCard,
  args: {
    name: 'production-api',
  },
}

type Story = StoryObj<typeof ResourceCard>

const Default: Story = {}

const WithOrganization: Story = {
  args: {
    organization: 'Acme Inc.',
  },
}

const WithCreatedAt: Story = {
  args: {
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
}

const WithOrganizationAndCreatedAt: Story = {
  args: {
    organization: 'Acme Inc.',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
}

const WithDynamicColor: Story = {
  args: {
    useDynamicColor: true,
  },
}

export default meta
export {
  Default,
  WithOrganization,
  WithCreatedAt,
  WithOrganizationAndCreatedAt,
  WithDynamicColor,
}
