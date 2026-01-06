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
  shouldResetTimer = false,
  shouldStopTimer = false,
  shouldStartTimer = true,
  formatDurationTime,
  formatDateTime,
}: TimerCounterProps) => {
  const getInitialTimerState = useCallback(() => {
    if (!shouldStartTimer || shouldResetTimer || timerStartDate == null) {
      return '00:00'
    }
    return formatDurationTime(timerStartDate, timerFinalDate)
  }, [
    shouldStartTimer,
    shouldResetTimer,
    timerStartDate,
    timerFinalDate,
    formatDurationTime,
  ])

  const [
    timerState,
    setTimerState,
  ] = useState<string>(getInitialTimerState)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleStopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleTimerState = useCallback((): void => {
    setTimerState(formatDurationTime(timerStartDate, timerFinalDate))
  }, [
    formatDurationTime,
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

  useEffect(() => {
    if (!shouldStartTimer || shouldResetTimer || timerStartDate == null) {
      handleStopTimer()
      const timeoutId = setTimeout(() => {
        setTimerState('00:00')
      }, 0)
      return () => {
        handleStopTimer()
        clearTimeout(timeoutId)
      }
    }

    if (shouldStopTimer) {
      handleStopTimer()
      const timeoutId = setTimeout(handleTimerState, 0)
      return () => {
        handleStopTimer()
        clearTimeout(timeoutId)
      }
    }

    const initialTimeoutId = setTimeout(handleTimerState, 0)
    intervalRef.current = setInterval(handleTimerState, 1000)

    return () => {
      handleStopTimer()
      clearTimeout(initialTimeoutId)
    }
  }, [
    shouldStartTimer,
    shouldResetTimer,
    shouldStopTimer,
    timerStartDate,
    timerFinalDate,
    handleTimerState,
    handleStopTimer,
  ])

  return (
    <Container>
      <Tooltip title={contentTimer()}>{timerState}</Tooltip>
    </Container>
  )
}

const TimerCounterMemo = memo(TimerCounter)
export { TimerCounterMemo as TimerCounter }

export type { TimerCounterProps }
