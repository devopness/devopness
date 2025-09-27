import type { Meta, StoryObj } from '@storybook/react-vite'

import { Review } from '.'
import { ReviewBox } from './ReviewBox'
import { getColor } from 'src/colors'

const meta = {
  component: Review,
  title: 'Primitives/Review',
  argTypes: {
    content: {
      control: 'text',
      description: 'Text or JSX content of the review',
    },
    prefix: { control: 'text', description: 'Optional prefix before label' },
    icon: { control: 'text', description: 'Optional icon to display' },
    iconColor: { control: 'color', description: 'Color of the icon' },
    iconBackgroundColor: {
      control: 'color',
      description: 'Background color of the icon',
    },
    iconSize: { control: 'number', description: 'Size of the icon in pixels' },
    isBoldFontWeight: {
      control: 'boolean',
      description: 'Whether the label is bold',
    },
    isIconAfterLabel: {
      control: 'boolean',
      description: 'Render icon after label',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the review',
    },
    hasPrefixMargin: {
      control: 'boolean',
      description: 'Whether prefix has margin',
    },
  },
} satisfies Meta<typeof Review>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    icon: 'cloudWarning',
    iconColor: getColor('amber.500'),
    backgroundColor: getColor('amber.150'),
    content: 'Pay attention to the warnings',
    prefix: 'Warning',
  },
}

const WithIcon: Story = {
  args: { content: 'Status: Approved', icon: 'success', iconColor: 'green' },
}

const WithPrefix: Story = {
  args: { content: 'Status: Rejected', prefix: 'Info' },
}

const IconAfterLabel: Story = {
  args: {
    content: 'Status: Approved',
    icon: 'success',
    isIconAfterLabel: true,
    iconColor: 'green',
  },
}

const BoldLabel: Story = {
  args: { content: 'Score: 85%', isBoldFontWeight: true },
}

const CustomBackground: Story = {
  args: { content: 'Status: Pending', backgroundColor: getColor('blue.100') },
}

const InsideBox: Story = {
  args: { content: 'Status: Approved' },
  render: () => (
    <ReviewBox type="default">
      <Review
        content="Status: Approved"
        icon="success"
        iconColor="green"
        prefix="Info"
      />
      <Review
        content="Score: 85%"
        icon="info"
        iconColor="purple"
        isIconAfterLabel
      />
    </ReviewBox>
  ),
}

export default meta
export {
  Default,
  WithIcon,
  WithPrefix,
  IconAfterLabel,
  BoldLabel,
  CustomBackground,
  InsideBox,
}
