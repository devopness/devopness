import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../Button'
import { ButtonGroup } from './ButtonGroup'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/Buttons/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    hasSpacing: {
      control: 'boolean',
      description: 'Whether to add spacing between buttons',
    },
    isRightAligned: {
      control: 'boolean',
      description: 'Whether to align buttons to the right',
    },
    isVertical: {
      control: 'boolean',
      description: 'Whether to stack buttons vertically',
    },
  },
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  args: {
    hasSpacing: true,
    isRightAligned: false,
    isVertical: false,
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Cancel</Button>
      <Button buttonType="outlinedSecondary">Save</Button>
    </ButtonGroup>
  ),
}

export const RightAligned: Story = {
  args: {
    ...Default.args,
    isRightAligned: true,
  },
  render: Default.render,
}

export const Vertical: Story = {
  args: {
    ...Default.args,
    isVertical: true,
  },
  render: Default.render,
}

export const NoSpacing: Story = {
  args: {
    ...Default.args,
    hasSpacing: false,
  },
  render: Default.render,
}

export const MultipleButtons: Story = {
  args: Default.args,
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>First</Button>
      <Button buttonType="outlinedSecondary">Second</Button>
      <Button buttonType="borderless">Third</Button>
    </ButtonGroup>
  ),
}

export const VerticalMultipleButtons: Story = {
  args: {
    ...Default.args,
    isVertical: true,
  },
  render: MultipleButtons.render,
} 