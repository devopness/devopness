import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from '.'
import { iconList } from 'src/icons/iconLoader'

const meta = {
  component: Button,
  argTypes: {
    icon: {
      control: 'select',
      options: iconList.map(({ name }) => name),
    },
    iconColor: { control: 'color' },
    children: { control: 'text' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

const Primary: Story = {
  args: {
    children: 'Add Application',
    typeSize: 'default',
    buttonType: 'Default',
  },
}

const Borderless: Story = {
  args: {
    children: 'Borderless',
    buttonType: 'borderless',
  },
}

const OutlinedSecondary: Story = {
  args: {
    children: 'Outlined Secondary',
    buttonType: 'outlinedSecondary',
  },
}

const OutlinedAuxiliary: Story = {
  args: {
    children: 'Outlined Auxiliary',
    buttonType: 'outlinedAuxiliary',
  },
}

const Medium: Story = {
  args: {
    children: 'Medium Size',
    typeSize: 'medium',
  },
}

const AutoSize: Story = {
  args: {
    children: 'Auto Size',
    typeSize: 'auto',
  },
}

const WithIcon: Story = {
  args: {
    children: 'With Icon',
    icon: 'add',
  },
}

const Loading: Story = {
  args: {
    children: 'Loading',
    loading: true,
  },
}

const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export default meta
export {
  Primary,
  Borderless,
  OutlinedSecondary,
  OutlinedAuxiliary,
  Medium,
  AutoSize,
  WithIcon,
  Loading,
  Disabled,
}
