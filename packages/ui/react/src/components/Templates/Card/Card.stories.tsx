import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from './Card'

const meta = {
  component: Card,
  argTypes: {
    indicator: { control: 'number' },
    icon: { control: 'text' },
  },
} satisfies Meta<typeof Card>

type Story = StoryObj<typeof meta>

/**
 * Default story showing basic card usage
 */
const Default: Story = {
  args: {
    title: 'Example Card',
    subtitle: 'Card subtitle',
    avatarProps: {
      backgroundColor: 'purple.800',
    },
    headerProps: {
      backgroundColor: 'white',
    },
    url: '#',
  },
}

/**
 * Story demonstrating card with an icon instead of letter avatar
 */
const WithIcon: Story = {
  args: {
    ...Default.args,
    icon: 'github',
    title: 'GitHub Repository',
  },
}

/**
 * Story showing card with indicator
 */
const WithIndicator: Story = {
  args: {
    ...Default.args,
    indicator: 5,
    title: 'Notifications',
  },
}

/**
 * Story demonstrating card with footer actions
 */
const WithFooter: Story = {
  args: {
    ...Default.args,
    title: 'Card with Actions',
    footer: [
      {
        icon: 'edit',
        label: 'Edit',
        url: '#edit',
        tooltip: 'Edit item',
      },
      {
        icon: {
          name: 'delete',
          color: 'red.500',
        },
        label: 'Delete',
        url: '#delete',
        tooltip: 'Delete item',
      },
    ],
  },
}

/**
 * Story demonstrating card with indicator and add CTA button
 */
const WithAddCta: Story = {
  args: {
    ...Default.args,
    indicator: 8,
    title: 'Card with add CTA',
    addUrl: '/add',
  },
}

export default meta
export { Default, WithAddCta, WithFooter, WithIcon, WithIndicator }
