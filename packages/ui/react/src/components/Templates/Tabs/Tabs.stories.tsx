import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs } from '.'

const meta = {
  component: Tabs,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Tabs>

type Story = StoryObj<typeof meta>

const Details: Story = {
  args: {
    data: [
      {
        label: 'Details',
        component: (
          <>
            <ul>
              <li>
                <code>component</code> can be any ReactNode
              </li>
              <li>
                When <code>data</code> array only has one tab available, Tabs
                selector is hidden
              </li>
              <li>
                Try changing the <code>currentTabIndex</code> value or deleting
                a item from data array
              </li>
            </ul>
          </>
        ),
      },
      {
        label: 'Variables',
        component: 'string example',
      },
    ],
    currentTabIndex: 0,
    onTabClick: ({ index, label }) => {
      alert(`tab ${index.toString()}: ${label} clicked`)
    },
  },
}

export default meta
export { Details }
