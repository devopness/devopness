import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Radio } from './Radio'

const meta: Meta<typeof Radio.Root> = {
  title: 'Primitives/Radio',
  component: Radio.Root,
  parameters: {
    layout: 'centered',
  },
  tags: [
    'autodocs',
  ],
}

type Story = StoryObj<typeof Radio.Root>

const Default: Story = {
  args: {
    label: 'Pick one',
    value: '',
    direction: 'row',
  },
  render: (args) => (
    <Radio.Root {...args}>
      <Radio.Item
        value="a"
        label="Option A"
      />
      <Radio.Item
        value="b"
        label="Option B"
      />
    </Radio.Root>
  ),
}

const Column: Story = {
  args: {
    label: 'Pick one',
    value: 'a',
    direction: 'column',
  },
  render: (args) => (
    <Radio.Root {...args}>
      <Radio.Item
        value="a"
        label="Option A"
      />
      <Radio.Item
        value="b"
        label="Option B"
      />
      <Radio.Item
        value="c"
        label="Option C"
      />
    </Radio.Root>
  ),
}

const WithError: Story = {
  args: {
    label: 'Pick one',
    value: '',
    error: 'Please select an option',
  },
  render: (args) => (
    <Radio.Root {...args}>
      <Radio.Item
        value="a"
        label="Option A"
      />
      <Radio.Item
        value="b"
        label="Option B"
      />
    </Radio.Root>
  ),
}

const WithDisabled: Story = {
  args: {
    label: 'Pick one',
    value: 'a',
  },
  render: (args) => (
    <Radio.Root {...args}>
      <Radio.Item
        value="a"
        label="Option A"
      />
      <Radio.Item
        value="b"
        label="Option B (disabled)"
        disabled
      />
    </Radio.Root>
  ),
}

const InteractiveDemo = (args: {
  label: string
  direction?: 'row' | 'column'
}) => {
  const [
    value,
    setValue,
  ] = useState('')
  return (
    <Radio.Root
      label={args.label}
      direction={args.direction}
      value={value}
      onChange={setValue}
    >
      <Radio.Item
        value="a"
        label="Option A"
      />
      <Radio.Item
        value="b"
        label="Option B"
      />
      <Radio.Item
        value="c"
        label="Option C"
      />
    </Radio.Root>
  )
}

const Interactive: Story = {
  args: {
    label: 'Pick one',
    direction: 'row',
  },
  render: (args) => (
    <InteractiveDemo
      label={args.label}
      direction={args.direction}
    />
  ),
}

export default meta
export { Default, Column, WithError, WithDisabled, Interactive }
