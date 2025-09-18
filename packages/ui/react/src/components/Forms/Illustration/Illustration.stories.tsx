import type { Meta, StoryObj } from '@storybook/react-vite'

import { Illustration } from './Illustration'
import { getColor } from 'src/colors'
import { getImageAssetUrl } from 'src/icons'
const EMPTY_APPLICATIONS = getImageAssetUrl('applications_module.svg')

const meta = {
  title: 'Form/Illustration',
  component: Illustration,
  parameters: {
    backgrounds: {
      options: {
        purple: { name: 'Purple', value: getColor('purple.800') },
      },
    },
  },
  globals: {
    backgrounds: { value: 'purple' },
  },
} satisfies Meta<typeof Illustration>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    children: (
      <img
        src={EMPTY_APPLICATIONS}
        alt="placeholder"
      />
    ),
  },
}

const WithText: Story = {
  args: {
    children: (
      <p style={{ fontSize: '18px' }}>Centered text inside Illustration</p>
    ),
  },
}

const WithCustomContent: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Illustration>
      <div
        style={{
          width: 60,
          height: 60,
          background: getColor('blue.600'),
          borderRadius: '50%',
        }}
      />
    </Illustration>
  ),
}

export { Default, WithText, WithCustomContent }
export default meta
