import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Dropdown, DropdownOption } from '.'

const DROPDOWN_OPTIONS: DropdownOption[] = [
  {
    label: 'Bitbucket',
    badge: { icon: true, name: 'bitbucket' },
    onClick: fn(),
    isDisabled: true,
    tooltip: 'This item is blocked',
    isActive: false,
    activeBackgroundColor: undefined,
  },
  {
    label: 'GitLab',
    badge: { icon: true, name: 'gitlab' },
    onClick: fn(),
    isDisabled: false,
    isActive: false,
    activeBackgroundColor: undefined,
  },
  {
    label: 'GitHub',
    badge: { icon: true, name: 'github' },
    onClick: fn(),
    isDisabled: false,
    isActive: false,
    activeBackgroundColor: undefined,
  },
  {
    label: 'Remove',
    badge: { icon: true, name: 'github' },
    isDisabled: false,
    isActive: false,
    activeBackgroundColor: undefined,
    color: 'red.500',
  },
]

const meta = {
  component: Dropdown,
  argTypes: {
    content: {
      if: { arg: 'anchorType', eq: 'content' },
    },
    hideDropdownIcon: {
      if: { arg: 'anchorType', eq: 'button' },
    },
    hideLabel: {
      if: { arg: 'anchorType', eq: 'button' },
    },
    buttonProps: {
      if: { arg: 'anchorType', eq: 'button' },
    },
    label: {
      if: { arg: 'anchorType', eq: 'button' },
    },
  },
} satisfies Meta<typeof Dropdown>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    id: 'dropdown',
    anchorType: 'button',
    options: DROPDOWN_OPTIONS,
    label: 'add source provider',
    buttonProps: { revertOrientation: true },
    hideDropdownIcon: false,
    onToggle: fn(),
    onSelect: fn(),
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
  },
}

export default meta
export { Primary }
