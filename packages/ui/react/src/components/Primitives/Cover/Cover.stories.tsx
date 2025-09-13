import type { Meta, StoryObj } from '@storybook/react'

import { Cover } from './Cover'

const meta: Meta<typeof Cover> = {
  title: 'Primitives/Cover',
  component: Cover,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    minWidth: '600px',
    logo: 'colored',
    backgroundColor: 'indigo.10',
  },
  argTypes: {
    logo: {
      control: 'select',
      options: [
        'colored',
        'white',
      ],
    },
    backgroundColor: { control: 'text' },
    minWidth: { control: 'text' },
  },
}

type Story = StoryObj<typeof Cover>

const Default: Story = {
  render: (args) => (
    <Cover {...args}>
      <p style={{ color: '#fff' }}>Content inside the Cover component</p>
    </Cover>
  ),
}

const WhiteLogo: Story = {
  args: { logo: 'white', backgroundColor: 'black' },
}

const NarrowView: Story = {
  args: { minWidth: '2000px' },
}

export default meta
export { Default, WhiteLogo, NarrowView }
