import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { HelpCenter, HelpCenterProps } from './HelpCenter'
import { Button } from 'src/components/Buttons'

const meta: Meta<HelpCenterProps> = {
  title: 'Primitives/HelpCenter',
  component: HelpCenter,
  tags: [
    'autodocs',
  ],
}

type Story = StoryObj<HelpCenterProps>

const Default: Story = {
  render: (args) => {
    const HelpCenterStory = () => {
      const [
        user,
        setUser,
      ] = useState(args.user)
      return (
        <>
          <Button
            onClick={() => {
              setUser(
                user ? null : { name: 'JohnDoe', email: 'johndoe@example.com' }
              )
            }}
          >
            Toggle User
          </Button>
          <HelpCenter
            {...args}
            user={user}
          />
        </>
      )
    }
    return <HelpCenterStory />
  },
  args: {
    workspaceCode: 'workspace_123',
    checklistId: 'checklist_123',
    user: { name: 'JohnDoe', email: 'johndoe@example.com' },
  },
}

export default meta
export { Default }
