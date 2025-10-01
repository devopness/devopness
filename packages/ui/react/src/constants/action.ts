import type { Color } from 'src/colors'
import { Icon } from 'src/icons'

enum ActionStatus {
  Pending = 'pending',
  Waiting = 'waiting',
  Skipped = 'skipped',
  Queued = 'queued',
  InProgress = 'in-progress',
  Completed = 'completed',
  Failed = 'failed',
}

const actionStatusToIcon = {
  failed: 'error',
  queued: 'snooze',
  pending: 'lens',
  skipped: 'skip',
  waiting: 'pending',
  completed: 'success',
  'in-progress': 'loading',
} as const satisfies Record<`${ActionStatus}`, Icon>

const actionStatusToColor = {
  failed: 'red.500',
  queued: 'blue.600',
  pending: 'amber.500',
  skipped: 'gray.600',
  waiting: 'amber.500',
  completed: 'green.600',
  'in-progress': 'blue.600',
} as const satisfies Record<`${ActionStatus}`, Color>

export { actionStatusToIcon, actionStatusToColor, ActionStatus }
