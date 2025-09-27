import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Popover, PopoverProps } from './Popover'
import { Button } from 'src/components/Buttons'

const meta: Meta<PopoverProps> = {
  title: 'Primitives/Popover',
  component: Popover,
  tags: [
    'autodocs',
  ],
}

type Story = StoryObj<PopoverProps>

const Default: Story = {
  render: (args) => {
    const PopoverStory = () => {
      const [
        open,
        setOpen,
      ] = useState(true)
      return (
        <>
          <Button
            onClick={() => {
              setOpen(!open)
            }}
          >
            Toggle Popover
          </Button>
          <Popover
            {...args}
            open={open}
            anchorEl={document.body}
            onClose={() => {
              setOpen(false)
            }}
          >
            <div>Main popover content</div>
          </Popover>
        </>
      )
    }

    return <PopoverStory />
  },
  args: {
    title: 'Popover Title',
    footer: <div>Footer content</div>,
  },
}

const WithoutFooter: Story = {
  render: (args) => {
    const PopoverStory = () => {
      const [
        open,
        setOpen,
      ] = useState(true)
      return (
        <>
          <Button
            onClick={() => {
              setOpen(!open)
            }}
          >
            Toggle Popover
          </Button>
          <Popover
            {...args}
            open={open}
            anchorEl={document.body}
            onClose={() => {
              setOpen(false)
            }}
          >
            <div>Main popover content</div>
          </Popover>
        </>
      )
    }

    return <PopoverStory />
  },
  args: {
    title: 'Popover Title',
  },
}

export default meta
export { Default, WithoutFooter }
