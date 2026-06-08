'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { Tooltip } from '../Tooltip'
import { Container } from './TimerCounter.styled'

type TimerCounterProps = {
  /** Start date for the timer. */
  timerStartDate?: string | null
  /** Final date for the timer. Counter will stop once it reaches this date. */
  timerFinalDate?: string | null
  /** Whether the timer should reset to 00:00.
   * @default false
   */
  shouldResetTimer?: boolean
  /** Whether the timer should stop but preserve current value.
   * @default false
   */
  shouldStopTimer?: boolean
  /** Whether the timer should start.
   * @default true
   */
  shouldStartTimer?: boolean
  /** Function to format the duration between start and final dates. */
  formatDurationTime: (
    startDate?: string | null,
    finalDate?: string | null
  ) => string
  /** Function to format dates for tooltip display. */
  formatDateTime: (date?: string | null) => string
}

/**
 * TimerCounter Component
 *
 * Displays a live-updating counter between a start and final date,
 * with a tooltip showing additional information.
 *
 * @example
 * ```tsx
 * <TimerCounter
 *   timerStartDate="2025-09-01T12:00:00Z"
 *   shouldStartTimer
 *   formatDurationTime={(start, end) => customformatDurationTime(start, end)}
 *   formatDateTime={(date) => customformatDateTime(date)}
 * />
 * ```
 */
const TimerCounter = ({
  timerStartDate,
  timerFinalDate,
  shouldResetTimer,
  shouldStopTimer,
  shouldStartTimer = true,
  formatDurationTime,
  formatDateTime,
}: TimerCounterProps) => {
  const [
    timerState,
    setTimerState,
  ] = useState<string>('—')

  const formatDurationRef = useRef(formatDurationTime)

  useEffect(() => {
    formatDurationRef.current = formatDurationTime
  })

  useEffect(() => {
    const tick = () => {
      setTimerState((prev) => {
        const next = formatDurationRef.current(timerStartDate, timerFinalDate)
        return next === prev ? prev : next
      })
    }

    if (shouldResetTimer || timerStartDate == null) {
      setTimerState('00:00')
      return
    }

    if (shouldStopTimer || !shouldStartTimer) {
      tick()
      return
    }

    tick()
    const intervalId = setInterval(tick, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [
    shouldStartTimer,
    shouldStopTimer,
    shouldResetTimer,
    timerStartDate,
    timerFinalDate,
  ])

  const contentTimer = useCallback(
    (): React.JSX.Element => (
      <div>
        <div>Started at: {formatDateTime(timerStartDate)}</div>
        <div>Finished at: {formatDateTime(timerFinalDate)}</div>
      </div>
    ),
    [
      timerStartDate,
      timerFinalDate,
      formatDateTime,
    ]
  )

  return (
    <Container>
      <Tooltip title={contentTimer()}>{timerState}</Tooltip>
    </Container>
  )
}

const TimerCounterMemo = memo(TimerCounter)
export { TimerCounterMemo as TimerCounter }

export type { TimerCounterProps }
