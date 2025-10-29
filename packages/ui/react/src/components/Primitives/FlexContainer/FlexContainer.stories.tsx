import { Meta, StoryObj } from '@storybook/react-vite'

import { FlexContainer } from './FlexContainer'

const meta: Meta<typeof FlexContainer> = {
  title: 'Primitives/FlexContainer',
  component: FlexContainer,
  args: {
    direction: 'row',
    justify: 'flex-start',
    align: 'flex-start',
    wrap: 'nowrap',
    gap: '8px',
    children: (
      <>
        <div style={{ background: '#eee', padding: '8px' }}>Item 1</div>
        <div style={{ background: '#ddd', padding: '8px' }}>Item 2</div>
        <div style={{ background: '#ccc', padding: '8px' }}>Item 3</div>
      </>
    ),
  },
  parameters: {
    layout: 'fullscreen',
  },
}

type Story = StoryObj<typeof FlexContainer>

const Default: Story = {}
const Column: Story = {
  args: {
    direction: 'column',
  },
}
const Centered: Story = {
  args: {
    justify: 'center',
    align: 'center',
  },
}

export default meta
export { Default, Column, Centered }
