import type { Meta, StoryObj } from '@storybook/react'

import { EmptyData } from '.'
import { getImageAssetUrl } from 'src/icons'

const EMPTY_APPLICATIONS = getImageAssetUrl('applications_module.svg')
const EMPTY_CRON_JOBS = getImageAssetUrl('cron_jobs_module.svg')
const EMPTY_DAEMONS = getImageAssetUrl('daemons_module.svg')
const EMPTY_ENVIRONMENTS = getImageAssetUrl('environments_module.svg')
const EMPTY_NETWORK_RULES = getImageAssetUrl('network_rules_module.svg')
const EMPTY_SERVERS = getImageAssetUrl('servers_module.svg')
const EMPTY_SSH_KEYS = getImageAssetUrl('ssh_keys_module.svg')
const EMPTY_SERVICES = getImageAssetUrl('services_module.svg')
const EMPTY_SOURCE_PROVIDERS = getImageAssetUrl('source_providers_module.svg')

const meta = {
  title: 'Primitives/EmptyData',
  component: EmptyData,
  argTypes: {
    isSmallContainer: {
      control: 'boolean',
      description: 'Reduces padding and container size for compact layouts',
    },
    message: {
      control: 'text',
      description: 'Message displayed to the user',
    },
    image: {
      control: {
        type: 'select',
      },
      options: [
        'Applications',
        'Cron jobs',
        'Daemons',
        'Environments',
        'Network rules',
        'Servers',
        'Services',
        'SSH Keys',
        'Source providers',
      ],
      mapping: {
        Applications: EMPTY_APPLICATIONS,
        'Cron jobs': EMPTY_CRON_JOBS,
        Daemons: EMPTY_DAEMONS,
        Environments: EMPTY_ENVIRONMENTS,
        'Network rules': EMPTY_NETWORK_RULES,
        Servers: EMPTY_SERVERS,
        Services: EMPTY_SERVICES,
        'SSH Keys': EMPTY_SSH_KEYS,
        'Source providers': EMPTY_SOURCE_PROVIDERS,
      },
      description: 'Image displayed for the empty state',
    },
  },
} satisfies Meta<typeof EmptyData>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    message:
      'You do not have any items created for this module. To create one, use the Add button above.',
    isSmallContainer: false,
    image: EMPTY_APPLICATIONS,
  },
}

export { Default }
export default meta
