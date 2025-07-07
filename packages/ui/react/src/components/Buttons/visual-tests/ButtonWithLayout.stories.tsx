import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '..' 
import { Input } from 'src/components/Forms/Input' 
import { Label } from 'src/components/Primitives/Label' 
import { fn } from 'storybook/test'

const meta = {
  title: 'Components/Button/Visual Tests/ButtonWithLayout',
  component: Button,
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const AlignedLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Label htmlFor="project">Project Name:</Label>
      <Input id="project" placeholder="Devopness" />
      <Button typeSize="default" buttonType="Default">Submit</Button>
    </div>
  ),
}