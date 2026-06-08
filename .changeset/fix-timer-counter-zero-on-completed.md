---
"@devopness/ui-react": patch
---

Fix `TimerCounter` showing stale values and leaking intervals on prop transitions

Two problems were fixed:

1. The component was early-returning to `00:00` whenever `shouldStartTimer`
   was `false`, even when `shouldStopTimer` was `true` — which froze the
   timer at `00:00` for any finished action (`Completed`, `Failed`,
   `Skipped`) when callers used `shouldStartTimer` to mean "the action is
   currently running".

2. The effect that controlled the interval lifecycle only depended on
   `shouldStartTimer`, but it also read `shouldResetTimer`,
   `shouldStopTimer`, and `timerStartDate`. When any of those changed
   without `shouldStartTimer` changing, the interval could keep running
   (stop/reset transitions) or never start (`timerStartDate` going from
   `null` to a real date). The displayed value could also flicker as the
   stale interval kept overwriting the value derived from the new props.

The effect now lives in a single `useEffect` that depends on every prop
it reads, and `formatDurationTime` is accessed via a ref so the effect
does not restart on every parent re-render when the caller doesn't
memoize it.

Behavior matrix across status combinations:

- `Pending` / `Waiting` / `Queued` (no start date) → `00:00`
- `InProgress` → live ticking
- `Completed` / `Failed` → final duration (no flicker on transition)
- `Skipped` (no start date) → `00:00`
