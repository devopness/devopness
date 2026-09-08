import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  BreadCrumbLogoTheme,
  BreadCrumbs,
  type BreadCrumbsProps,
} from './BreadCrumbs'

const meta = {
  title: 'Primitives/BreadCrumbs',
  component: BreadCrumbs,
  args: {
    backgroundColor: '#ffffff',
    imageOnClick: () => {},
    navigateCrumbs: [
      {
        label: 'Projects',
        list: [],
        onClick: () => {},
      },
      {
        label: 'Production',
        list: [
          {
            label: 'Staging',
            onClick: () => {},
          },
          {
            label: 'Development',
            onClick: () => {},
          },
        ],
        onClick: () => {},
      },
    ],
    theme: BreadCrumbLogoTheme.Purple,
  },
} satisfies Meta<BreadCrumbsProps>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcons: Story = {
  args: {
    navigateCrumbs: [
      {
        label: 'Devopness',
        list: [],
        onClick: () => {},
        badge: {
          icon: true,
          name: 'organization',
          backgroundColor: '#786efd',
        },
      },
      {
        label: 'Production',
        list: [
          {
            label: 'Staging',
            onClick: () => {},
            badge: {
              icon: true,
              name: 'server',
              backgroundColor: '#4285f4',
            },
          },
          {
            label: 'Development',
            onClick: () => {},
            badge: {
              icon: true,
              name: 'devices',
              backgroundColor: '#9c6ade',
            },
          },
        ],
        onClick: () => {},
        badge: {
          icon: true,
          name: 'server',
          backgroundColor: '#4285f4',
        },
      },
      {
        label: 'Application',
        list: [],
        onClick: () => {},
        badge: {
          icon: true,
          name: 'devices',
          backgroundColor: '#9c6ade',
        },
      },
    ],
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}
