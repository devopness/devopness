import React, { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { PermissionCheckboxChip } from './PermissionCheckboxChip'

const meta: Meta<typeof PermissionCheckboxChip> = {
  title: 'Primitives/PermissionCheckboxChip',
  component: PermissionCheckboxChip,
  parameters: {
    layout: 'centered',
  },
  tags: [
    'autodocs',
  ],
  argTypes: {
    onChange: { action: 'toggled' },
  },
}

type Story = StoryObj<typeof PermissionCheckboxChip>

const Default: Story = {
  args: {
    label: 'View',
    isChecked: false,
    hint: 'Permission to view details',
  },
}

const Checked: Story = {
  args: {
    label: 'Edit',
    isChecked: true,
  },
}

const CheckedWithWarningError: Story = {
  args: {
    label: 'Delete',
    isChecked: false,
    hasError: true,
  },
}

const DisabledUnchecked: Story = {
  args: {
    label: 'Admin',
    isChecked: false,
    disabled: true,
  },
}

const DisabledChecked: Story = {
  args: {
    label: 'Read',
    isChecked: true,
    disabled: true,
  },
}

// Interactive story to demonstrate the toggle behavior
const InteractiveDemo = (
  args: React.ComponentProps<typeof PermissionCheckboxChip>
) => {
  const [
    isChecked,
    setIsChecked,
  ] = useState(args.isChecked)
  return (
    <PermissionCheckboxChip
      {...args}
      isChecked={isChecked}
      onChange={(checked) => {
        setIsChecked(checked)
        args.onChange?.(checked)
      }}
    />
  )
}

const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
  args: {
    label: 'Deploy',
    isChecked: false,
  },
}

export default meta
export {
  Default,
  Checked,
  CheckedWithWarningError,
  DisabledUnchecked,
  DisabledChecked,
  Interactive,
}
