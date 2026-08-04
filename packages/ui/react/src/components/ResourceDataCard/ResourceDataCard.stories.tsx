import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from 'src/components/Buttons'
import { ResourceDataCard } from './ResourceDataCard'
import { getResourceCardAvatar } from './helpers'

const SAMPLE_CREATED_AT = new Date('2025-01-01T00:00:00Z')

const meta = {
  title: 'Components/ResourceDataCard/ResourceDataCard',
  component: ResourceDataCard,
  args: {
    headerLabel: 'Application Name',
    title: 'frontend-web-app',
    ...getResourceCardAvatar('frontend-web-app'),
    items: [
      {
        label: 'Stack',
        value: 'Node.js',
        icon: 'nodejs',
      },
      {
        label: 'Repository',
        value: 'github.com/acme/frontend',
        isUrl: true,
        url: 'https://github.com/acme/frontend',
        isExternalUrl: true,
      },
      { label: 'Created', value: SAMPLE_CREATED_AT.toISOString() },
    ],
    actions: (
      <>
        <Button
          type="button"
          typeSize="medium"
          buttonType="outlinedSecondary"
        >
          view details
        </Button>
      </>
    ),
    viewDetailsHref: '/applications/frontend-web-app',
    viewDetailsLabel: 'View Details',
  },
} satisfies Meta<typeof ResourceDataCard>

type Story = StoryObj<typeof meta>

const Default: Story = {}

const Collapsed: Story = {
  args: {
    defaultExpanded: false,
  },
}

const Expanded: Story = {
  args: {
    defaultExpanded: true,
  },
}

export default meta
export { Default, Collapsed, Expanded }
