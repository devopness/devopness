import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from '.'

const meta = {
  component: Skeleton,
  title: 'Primitives/Skeleton',
  argTypes: {
    widthPercent: {
      control: 'number',
      description:
        'Sets the width in percentage. Overrides `width` if provided.',
    },
    heightPercent: {
      control: 'number',
      description:
        'Sets the height in percentage. Overrides `height` if provided.',
    },
    width: {
      control: 'number',
      description:
        'Sets the width in pixels (used if `widthPercent` is not provided).',
    },
    height: {
      control: 'number',
      description:
        'Sets the height in pixels (used if `heightPercent` is not provided).',
    },
    borderRadius: {
      control: 'number',
      description: 'Border radius in pixels.',
    },
    className: {
      control: 'text',
      description: 'Optional custom class name.',
    },
  },
} satisfies Meta<typeof Skeleton>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    width: 120,
    height: 20,
  },
}

const RoundedCorners: Story = {
  args: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
}

const MultipleSkeletons = () => (
  <div style={{ display: 'grid', gap: '16px' }}>
    <Skeleton
      width={200}
      height={20}
    />
    <Skeleton
      width={180}
      height={20}
    />
    <Skeleton
      width={150}
      height={20}
    />
  </div>
)

const SkeletonInCard = () => (
  <div
    style={{
      padding: '20px',
      width: '300px',
      border: '1px solid #ddd',
      borderRadius: '12px',
    }}
  >
    <Skeleton
      width={80}
      height={80}
      borderRadius={8}
    />
    <div style={{ height: '16px' }} />
    <Skeleton
      width={260}
      height={16}
    />
    <div style={{ height: '8px' }} />
    <Skeleton
      width={200}
      height={16}
    />
  </div>
)

export { Default, RoundedCorners, MultipleSkeletons, SkeletonInCard }

export default meta
