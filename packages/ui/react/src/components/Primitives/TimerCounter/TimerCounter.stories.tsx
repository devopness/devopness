import type { Meta, StoryObj } from '@storybook/react'

import { TimerCounter } from './TimerCounter'

const meta = {
  title: 'Primitives/TimerCounter',
  component: TimerCounter,
  argTypes: {
    shouldStartTimer: {
      control: 'boolean',
      description: 'Whether the timer should start',
    },
    shouldStopTimer: {
      control: 'boolean',
      description: 'Stops the timer but keeps value',
    },
    shouldResetTimer: {
      control: 'boolean',
      description: 'Resets timer back to 00:00',
    },
    timerStartDate: {
      control: 'text',
      description: 'Start date for the timer',
    },
    timerFinalDate: {
      control: 'text',
      description: 'Final date for the timer',
    },
  },
} satisfies Meta<typeof TimerCounter>

type Story = StoryObj<typeof meta>

const start = new Date(Date.now() - 5 * 60 * 1000).toISOString()
const end = new Date(Date.now() + 10 * 60 * 1000).toISOString()

const mockFormatDurationTime = (
  startDate?: string | null,
  finalDate?: string | null
) => {
  if (!startDate) return '—'
  const startTime = new Date(startDate).getTime()
  const endTime = finalDate ? new Date(finalDate).getTime() : Date.now()
  const diffMs = endTime - startTime
  if (diffMs < 0) return '00:00'

  const totalSeconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const Default: Story = {
  args: {
    shouldStartTimer: true,
    timerStartDate: start,
    timerFinalDate: end,
    formatDurationTime: mockFormatDurationTime,
    formatDateTime: (date) => (date ? new Date(date).toLocaleString() : '—'),
  },
}

export default meta
