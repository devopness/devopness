import { ViewDetailsContent } from '../ViewDetails'
import { getColor } from 'src/colors'
import { typedMemo } from 'src/components/type-guards'
import { actionStatusToColor, actionStatusToIcon } from 'src/constants'
import type { ActionStatus } from 'src/constants'

/** Props for the Status component. */
type StatusProps = {
  /** The current action status. Must be one of the `ActionStatus` enum values. */
  status: `${ActionStatus}`
  /** A human-readable string describing the status. */
  statusHumanReadable: string
  /** A human-readable string explaining the reason or details of the status. */
  statusReasonHumanReadable: string
}

/**
 * Status component displays an action status with an icon, color, and tooltip.
 *
 * It leverages `ViewDetailsContent` to render the status value, icon, and tooltip
 * in a consistent Devopness UI style.
 *
 * @example
 * ```tsx
 * <Status
 *   status="completed"
 *   statusHumanReadable="Completed"
 *   statusReasonHumanReadable="All tasks finished successfully"
 * />
 * ```
 */

const Status = ({
  status,
  statusHumanReadable,
  statusReasonHumanReadable,
}: StatusProps) => {
  const icon = {
    name: actionStatusToIcon[status],
    color: getColor(actionStatusToColor[status]),
  }

  return (
    <ViewDetailsContent
      value={statusHumanReadable}
      icon={icon}
      tooltip={{
        value: statusReasonHumanReadable,
      }}
    />
  )
}

const MemoizedStatus = typedMemo(Status)
export { MemoizedStatus as Status }
export type { ActionStatus, StatusProps }
