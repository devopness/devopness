import { Meta, StoryObj } from '@storybook/react'

import { Container } from '../Container/Container'
import { Alert } from './Alert'

const meta = {
  title: 'Form/Alert',
  component: Alert,
  argTypes: {},
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} satisfies Meta<typeof Alert>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    type: 'error',
    alertDescription: 'A simple danger alert-check it out!',
  },
}

export default meta
export { Default }
