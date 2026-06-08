import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

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

  it('renders 00:00 when shouldStartTimer is false and shouldStopTimer is not set, even with a valid start date', () => {
    render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        shouldStartTimer={false}
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()
    expect(screen.queryByText('live-duration')).not.toBeInTheDocument()
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

  it('stops the running interval when shouldStopTimer transitions to true', () => {
    vi.useFakeTimers()
    const formatSpy = vi.fn((_start?: string | null, end?: string | null) =>
      end ? 'final-duration' : 'live-duration'
    )

    const { rerender } = render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        shouldStartTimer
        formatDurationTime={formatSpy}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('live-duration')).toBeInTheDocument()

    rerender(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        timerFinalDate="2025-09-16T14:00:00Z"
        shouldStartTimer={false}
        shouldStopTimer
        formatDurationTime={formatSpy}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('final-duration')).toBeInTheDocument()

    formatSpy.mockClear()
    act(() => {
      vi.advanceTimersByTime(5_000)
    })
    expect(formatSpy).not.toHaveBeenCalled()
    expect(screen.getByText('final-duration')).toBeInTheDocument()

    vi.useRealTimers()
  })

  it('starts ticking when timerStartDate transitions from null to a real date', () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <TimerCounter
        shouldStartTimer
        formatDurationTime={mockFormatDurationTime}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()

    rerender(
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

  it('resets to 00:00 and stops the interval when shouldResetTimer transitions to true', () => {
    vi.useFakeTimers()
    const formatSpy = vi.fn(mockFormatDurationTime)

    const { rerender } = render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        shouldStartTimer
        formatDurationTime={formatSpy}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('live-duration')).toBeInTheDocument()

    rerender(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        shouldStartTimer
        shouldResetTimer
        formatDurationTime={formatSpy}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()

    formatSpy.mockClear()
    act(() => {
      vi.advanceTimersByTime(5_000)
    })
    expect(formatSpy).not.toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('resets to 00:00 and stops the interval when timerStartDate transitions back to null', () => {
    vi.useFakeTimers()
    const formatSpy = vi.fn(mockFormatDurationTime)

    const { rerender } = render(
      <TimerCounter
        timerStartDate="2025-09-16T12:00:00Z"
        shouldStartTimer
        formatDurationTime={formatSpy}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('live-duration')).toBeInTheDocument()

    rerender(
      <TimerCounter
        timerStartDate={null}
        shouldStartTimer
        formatDurationTime={formatSpy}
        formatDateTime={mockFormatDateTime}
      />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()

    formatSpy.mockClear()
    act(() => {
      vi.advanceTimersByTime(5_000)
    })
    expect(formatSpy).not.toHaveBeenCalled()

    vi.useRealTimers()
  })
})
