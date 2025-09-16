import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { TimerCounter } from './TimerCounter'

const mockFormatDurationTime = (start?: string | null, end?: string | null) =>
  start && !end ? '00:05' : '—'

const mockFormatDateTime = (date?: string | null) =>
  date ? `formatted-${date}` : '—'

describe('TimerCounter', () => {
  it('renders 00:00 when shouldStartTimer is false', () => {
    render(
      <TimerCounter
        shouldStartTimer={false}
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('renders formatted duration when shouldStartTimer is true', () => {
    render(
      <TimerCounter
        shouldStartTimer
        timerStartDate="2025-09-16T12:00:00Z"
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:05')).toBeInTheDocument()
  })

  it('shows tooltip with formatted dates', async () => {
    render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        timerFinalDate="2025-09-16T14:00:00Z"
        shouldStartTimer
        formatDurationTime={(start, end) =>
          `duration-${start ?? ''}-${end ?? ''}`
        }
        formatDateTime={(date) => `formatted-${date ?? ''}`}
      />
    )

    fireEvent.mouseOver(screen.getByText(/duration/))

    expect(
      await screen.findByText(/formatted-2025-09-16T12:00:00Z/)
    ).toBeInTheDocument()

    expect(
      await screen.findByText(/formatted-2025-09-16T14:00:00Z/)
    ).toBeInTheDocument()
  })
})
