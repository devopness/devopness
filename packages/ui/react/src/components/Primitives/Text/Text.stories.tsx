import type { Meta, StoryObj } from '@storybook/react-vite'

import { Text } from '.'

const meta = {
  component: Text,
  title: 'Primitives/Text',
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'caption',
        'button',
        'overline',
        'span',
      ],
    },
    isSmall: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Text>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    className: '',
    variant: 'body1',
    children: `This is a sample paragraph using the Text component. 
You can change the variant and toggle the small prop to preview typography styles.`,
  },
}

const Small: Story = {
  args: {
    className: '',
    variant: 'body2',
    isSmall: true,
    children: 'This is a smaller text using the `small` prop.',
  },
}

const Heading: Story = {
  args: {
    className: '',
    variant: 'h4',
    children: 'This is a heading using variant "h4".',
  },
}

export { Default, Small, Heading }
export default meta
