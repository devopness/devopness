import type { Meta, StoryObj } from '@storybook/react'

import { CardLoading } from '.'

const meta = {
  title: 'Primitives/CardLoading',
  component: CardLoading,
} satisfies Meta<typeof CardLoading>

type Story = StoryObj<typeof meta>

const Default: Story = {}

const Multiple: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <CardLoading />
      <CardLoading />
      <CardLoading />
    </div>
  ),
}

export { Default, Multiple }
export default meta
