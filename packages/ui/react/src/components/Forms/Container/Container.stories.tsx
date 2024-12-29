import type { Meta, StoryObj } from '@storybook/react'
import Container, { type ContainerProps } from '.'
import { getColor } from 'src/colors'
import type { Color } from 'src/colors'

interface StoryProps extends ContainerProps {
  backgroundColor: Color
  height: string
}

const meta = {
  title: 'Form/Container',
  component: Container,
  argTypes: {
    height: {
      control: 'text',
    },
  },

  render: (args: StoryProps) => (
    <Container
      {...args}
      styles={{
        bgWrapperContent: getColor(args.backgroundColor),
        height: args.height,
      }}
    />
  ),
} satisfies Meta<StoryProps>

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    noTopMargin: false,
    backgroundColor: 'blue.500',
    height: '200',
  },
}

export default meta
