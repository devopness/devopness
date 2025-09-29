import { CSSProperties, FC, ReactNode } from 'react'

import { Meta, StoryObj } from '@storybook/react'

import { ViewDetails } from './ViewDetails'
import { DetailsContentProps } from './ViewDetailsContent'
import { ViewDetailsLoading } from './ViewDetailsLoading'

/**
 * Mock navigation link for Storybook that passes all props to an anchor element
 */
const MockNavigationLink: FC<{
  to: string | undefined
  target?: '_blank' | '_self' | undefined
  children: ReactNode
  isExternalUrl?: boolean
  style?: CSSProperties
}> = ({ to, target, children, style }) => (
  <a
    href={to ?? '#'}
    target={target}
    style={style}
  >
    {children}
  </a>
)

const meta: Meta<typeof ViewDetails> = {
  title: 'Primitives/ViewDetails',
  component: ViewDetails,
}

type Story = StoryObj<typeof ViewDetails>

const sampleData: { label: string; items: DetailsContentProps[] }[] = [
  {
    label: 'User Info',
    items: [
      {
        label: 'Name',
        value: 'John Doe',
        navigationComponent: MockNavigationLink,
      },
      {
        label: 'Email',
        value: 'john@example.com',
        navigationComponent: MockNavigationLink,
      },
    ],
  },
  {
    label: 'Server Info',
    items: [
      { label: 'Active', value: true, navigationComponent: MockNavigationLink },
      {
        label: 'IP Address',
        value: '237.84.2.178',
        isCopyToClipboard: true,
        tooltip: {
          value: 'Server IP Address',
        },
        navigationComponent: MockNavigationLink,
      },
      {
        label: 'Server URL',
        value: 'Example',
        url: 'https://example.com',
        isResourceUrl: false,
        navigationComponent: MockNavigationLink,
      },
    ],
  },
]

const Default: Story = {
  args: {
    data: sampleData,
  },
}

const Loading: Story = {
  render: () => <ViewDetailsLoading />,
}

const HiddenContent: Story = {
  args: {
    data: [
      {
        label: 'Sensitive Info',
        items: [
          {
            label: 'Password',
            value: '123456',
            isHidden: true,
            navigationComponent: MockNavigationLink,
          },
          {
            label: 'Secret Key',
            value: 'abcdef',
            isHidden: true,
            navigationComponent: MockNavigationLink,
          },
        ],
      },
    ],
  },
}

const WithIcons: Story = {
  args: {
    data: [
      {
        label: 'System Status',
        items: [
          {
            label: 'CPU',
            value: 'Active',
            statusIcon: { name: 'success', color: 'green', size: 16 },
            navigationComponent: MockNavigationLink,
          },
          {
            label: 'Memory',
            value: 'Warning',
            statusIcon: { name: 'warning', color: 'orange', size: 16 },
            navigationComponent: MockNavigationLink,
          },
        ],
      },
    ],
  },
}

export default meta
export { Default, Loading, HiddenContent, WithIcons }
