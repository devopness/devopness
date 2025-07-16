import type { Meta, StoryObj } from '@storybook/react-vite'

import { Loader } from '.'
import { getColor } from 'src/colors'

const meta = {
  component: Loader,
  title: 'Primitives/Loader',
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'bar',
        'page',
        'circle',
        'ring',
      ],
      description: 'Loader type to be displayed',
    },
    color: {
      control: 'color',
      description: 'Loader color',
    },
    size: {
      control: 'number',
      description: 'Loader size',
    },
    speedMultiplier: {
      control: 'number',
      description: 'Animation speed multiplier (default is 1)',
    },
    text: {
      control: 'text',
      description: 'Text to display with the loader',
    },
    paddingTop: {
      control: 'text',
      description: 'Custom padding top (ex: 20px)',
    },
    isAlignLeft: {
      control: 'boolean',
      description: 'Aligns the loader to the left',
    },
  },
} satisfies Meta<typeof Loader>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    variant: 'page',
    color: getColor('purple.800'),
    size: 20,
    speedMultiplier: 1,
  },
}

const Bar: Story = {
  args: {
    variant: 'bar',
    color: getColor('blue.500'),
    size: 4,
    speedMultiplier: 1,
    text: 'Loading data...',
  },
}

const Circle: Story = {
  args: {
    variant: 'circle',
    color: getColor('purple.800'),
    size: 30,
    speedMultiplier: 1.5,
    text: 'Processing...',
  },
}

const Ring: Story = {
  args: {
    variant: 'ring',
    color: getColor('orange.600'),
    size: 20,
    speedMultiplier: 1.5,
    text: 'Wait a moment...',
  },
}

const WithCustomPadding: Story = {
  args: {
    variant: 'circle',
    color: getColor('red.400'),
    size: 25,
    speedMultiplier: 1,
    text: 'Loading...',
    paddingTop: '30px',
  },
}

const AlignedLeft: Story = {
  args: {
    variant: 'bar',
    color: getColor('green.600'),
    size: 6,
    speedMultiplier: 1,
    text: 'Saving...',
    isAlignLeft: true,
  },

  parameters: {
    layout: 'fullscreen',
  },
}

const NoText: Story = {
  args: {
    variant: 'ring',
    color: getColor('amber.800'),
    size: 35,
    speedMultiplier: 1.8,
  },
}

const FastAnimation: Story = {
  args: {
    variant: 'circle',
    color: getColor('cyan.800'),
    size: 20,
    speedMultiplier: 1.5,
    text: 'Fast animation!',
  },
}

const SlowAnimation: Story = {
  args: {
    variant: 'bar',
    color: getColor('brown.400'),
    size: 8,
    speedMultiplier: 0.5,
    text: 'Slow animation...',
  },
}

const AllVariants = () => (
  <div
    style={{
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '40px',
    }}
  >
    {(
      [
        { variant: 'bar', color: 'blue.500', label: 'Bar loader' },
        { variant: 'circle', color: 'purple.800', label: 'Circle loader' },
        {
          variant: 'ring',
          color: 'orange.600',
          label: 'Ring loader',
        },
      ] as const
    ).map(({ variant, color, label }) => (
      <div
        key={variant}
        style={{ textAlign: 'center' }}
      >
        <h3>{label}</h3>
        <Loader
          variant={variant}
          color={getColor(color)}
          text={label}
        />
      </div>
    ))}
  </div>
)

const ColorVariations = () => (
  <div
    style={{
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '30px',
    }}
  >
    {(
      [
        'red.400',
        'blue.500',
        'green.600',
        'purple.800',
        'orange.600',
        'amber.800',
      ] as const
    ).map((color) => (
      <Loader
        key={color}
        variant="ring"
        color={getColor(color)}
        text={color}
      />
    ))}
  </div>
)

export {
  Default,
  Bar,
  Circle,
  Ring,
  WithCustomPadding,
  AlignedLeft,
  NoText,
  FastAnimation,
  SlowAnimation,
  AllVariants,
  ColorVariations,
}

export default meta
