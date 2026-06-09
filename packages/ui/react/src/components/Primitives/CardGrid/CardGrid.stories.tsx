import { Meta, StoryObj } from '@storybook/react-vite'

import { CardGrid } from './CardGrid'

const meta: Meta<typeof CardGrid> = {
  title: 'Primitives/CardGrid',
  component: CardGrid,
  args: {
    gap: '1.5rem',
    rowHeight: '160px',
  },
  parameters: {
    layout: 'fullscreen',
  },
}

const tileStyle: React.CSSProperties = {
  background: '#eef2ff',
  border: '1px solid #c7d2fe',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#3730a3',
  fontFamily: 'system-ui, sans-serif',
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
}

const renderTiles = (count: number) =>
  Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      style={tileStyle}
    >
      Card {i + 1}
    </div>
  ))

type Story = StoryObj<typeof CardGrid>

const Default: Story = {
  args: {
    children: renderTiles(8),
  },
}

const TwoColumnDesktop: Story = {
  args: {
    columns: { mobile: 1, tablet: 2, desktop: 2 },
    children: renderTiles(4),
  },
}

const NoFixedRowHeight: Story = {
  args: {
    rowHeight: undefined,
    children: renderTiles(6),
  },
}

const LargeGap: Story = {
  args: {
    gap: '3rem',
    children: renderTiles(8),
  },
}

export default meta
export { Default, TwoColumnDesktop, NoFixedRowHeight, LargeGap }
