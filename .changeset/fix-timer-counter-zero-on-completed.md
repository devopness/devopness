---
"@devopness/ui-react": patch
---

Fix `TimerCounter` showing `00:00` for completed/failed actions

The `TimerCounter` component was early-returning to `00:00` whenever
`shouldStartTimer` was `false`, even when `shouldStopTimer` was `true` —
which froze the timer at `00:00` for any action that had finished
(completed, failed, skipped) when callers used `shouldStartTimer` to
indicate "the action is not currently running".

The effect logic now matches the previous (pre-migration) local
implementation: `shouldStartTimer` only nudges the displayed value to
`00:00` before the actual decision, while `shouldResetTimer`,
`shouldStopTimer`, and `timerStartDate` determine the final state.

This restores the expected behavior across status combinations:

- `Pending` / `Waiting` / `Queued` (no start date) → `00:00`
- `InProgress` → live ticking
- `Completed` / `Failed` → final duration
- `Skipped` (no start date) → `00:00`
