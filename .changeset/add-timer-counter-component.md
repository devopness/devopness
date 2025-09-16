---
"@devopness/ui-react": minor
---

Add new `TimerCounter` component

### What Changed

- Introduced the `TimerCounter` component for displaying a live-updating timer.
- The component supports:
  - Starting, stopping, and resetting via boolean props (`shouldStartTimer`, `shouldStopTimer`, `shouldResetTimer`).
  - Custom date and duration formatting via `formatDateTime` and `formatDurationTime` props.

### Example Usage

```tsx
 <TimerCounter
   timerStartDate="2025-09-01T12:00:00Z"
   shouldStartTimer
   formatDurationTime={(start, end) => customFormatDurationTime(start, end)}
   formatDateTime={(date) => customFormatDateTime(date)}
 />
 ```

This improves UI consistency and flexibility by allowing different formatting strategies and reusable timer logic.
