import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from '..'

import { Input } from 'src/components/Forms/Input'
import { Label } from 'src/components/Primitives/Label'

const meta = {
  title: 'Components/Button/Visual Tests/ButtonWithLayout',
  component: Button,
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof meta>

export const AlignedLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Label
        htmlFor="project"
        value="Project Name:"
      />
      <Input
        id="project"
        type="text"
        placeholder="Devopness"
      />
      <Button
        typeSize="default"
        buttonType="Default"
      >
        Submit
      </Button>
    </div>
  ),
}
export default meta
