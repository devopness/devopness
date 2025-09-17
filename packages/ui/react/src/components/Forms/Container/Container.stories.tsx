import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './Container'
import { getColor } from 'src/colors'

const meta = {
  title: 'Form/Container',
  component: Container,
} satisfies Meta<typeof Container>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    children: <p>Page content goes here</p>,
  },
}

const WithoutTopMargin: Story = {
  args: {
    shouldRemoveTopMargin: true,
    children: <p>Page content without top margin</p>,
  },
}

const WithBackgroundAndHeight: Story = {
  args: {
    styles: {
      backgroundWrapperContent: getColor('gray.200'),
      height: 100,
    },
    children: <p>Page content with background and height</p>,
  },
}

export { Default, WithoutTopMargin, WithBackgroundAndHeight }

export default meta
