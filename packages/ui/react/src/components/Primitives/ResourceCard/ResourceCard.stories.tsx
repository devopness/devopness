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

// Fixed so the "relative time" label doesn't drift while the story sits open
const SAMPLE_CREATED_AT = new Date('2025-01-01T00:00:00Z')

const WithCreatedAt: Story = {
  args: {
    createdAt: SAMPLE_CREATED_AT,
  },
}

const WithOrganizationAndCreatedAt: Story = {
  args: {
    organization: 'Acme Inc.',
    createdAt: SAMPLE_CREATED_AT,
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
