import type { Meta, StoryObj } from '@storybook/react'

import { FormText } from './FormText'
import type { FormTextProps } from './FormText'

const meta: Meta<FormTextProps> = {
  title: 'Form/FormText',
  component: FormText,
  args: {
    title: 'Main Title',
  },
}

type Story = StoryObj<FormTextProps>

const Default: Story = {
  args: {
    title: 'Main Title',
  },
}

const WithSubtitle: Story = {
  args: {
    title: 'Main Title',
    subTitle: 'This is an optional subtitle',
  },
}

const WithCustomSubtitleColor: Story = {
  args: {
    title: 'Main Title',
    subTitle: 'Subtitle with custom color',
    subTitleColor: '#ef4444',
  },
}

export default meta
export { Default, WithSubtitle, WithCustomSubtitleColor }
