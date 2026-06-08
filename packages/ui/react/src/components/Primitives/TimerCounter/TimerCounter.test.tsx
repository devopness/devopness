import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { describe, it, expect, vi } from 'vitest'

import { TimerCounter } from './TimerCounter'

const mockFormatDurationTime = (start?: string | null, end?: string | null) =>
  start && end ? 'final-duration' : start ? 'live-duration' : '—'

const mockFormatDateTime = (date?: string | null) =>
  date ? `formatted-${date}` : '—'

describe('TimerCounter', () => {
  it('renders 00:00 when timerStartDate is null', () => {
    render(
      <TimerCounter
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('renders 00:00 when shouldResetTimer is true even with valid dates', () => {
    render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        timerFinalDate="2025-09-16T14:00:00Z"
        shouldResetTimer
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('renders the final formatted duration when shouldStopTimer is true and dates are set', () => {
    render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        timerFinalDate="2025-09-16T14:00:00Z"
        shouldStopTimer
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('final-duration')).toBeInTheDocument()
  })

  it('shows the final duration when shouldStartTimer is false and shouldStopTimer is true', () => {
    render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        timerFinalDate="2025-09-16T14:00:00Z"
        shouldStartTimer={false}
        shouldStopTimer
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('final-duration')).toBeInTheDocument()
    expect(screen.queryByText('00:00')).not.toBeInTheDocument()
  })

  it('starts ticking when only shouldStartTimer is true and dates are set', () => {
    vi.useFakeTimers()
    render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        shouldStartTimer
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('live-duration')).toBeInTheDocument()
    vi.useRealTimers()
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
