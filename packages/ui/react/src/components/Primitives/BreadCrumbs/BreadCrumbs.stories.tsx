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

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}
