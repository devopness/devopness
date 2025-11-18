import type { Meta, StoryObj } from '@storybook/react-vite'

import { AccordionExpand } from './AccordionExpand'

const meta: Meta<typeof AccordionExpand> = {
  title: 'Primitives/AccordionExpand',
  component: AccordionExpand,
}

type Story = StoryObj<typeof AccordionExpand>

const items = [
  {
    label: 'Option 1',
    onClick: () => {
      alert('Clicked option 1')
    },
  },
  { label: 'Option 2', url: '/path' },
  { label: 'Disabled Option', isDisabled: true },
]

const Default: Story = {
  args: {
    label: 'Accordion Label',
    items,
  },
}

const WithTooltip: Story = {
  args: {
    label: 'Accordion With Tooltip',
    tooltip: 'Tooltip text here',
    items,
  },
}

const Disabled: Story = {
  args: {
    label: 'Disabled Accordion',
    isDisabled: true,
    items,
  },
}

export default meta

export { Default, WithTooltip, Disabled }
