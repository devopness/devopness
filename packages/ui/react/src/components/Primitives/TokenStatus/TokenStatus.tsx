'use client'

import { ViewDetailsContent } from 'src/components/Primitives/ViewDetails'
import { getColor, type Color } from 'src/colors'
import type { Icon } from 'src/icons'

type TokenStatus = 'active' | 'expired' | 'revoked'

const statusToIcon = {
  active: 'success',
  expired: 'warning',
  revoked: 'error',
} as const satisfies Record<TokenStatus, Icon>

const statusToColor = {
  active: 'green.600',
  expired: 'orange.500',
  revoked: 'red.400',
} as const satisfies Record<TokenStatus, Color>

type TokenStatusProps = {
  /** Status of the token: 'active', 'expired', or 'revoked' */
  status: TokenStatus
}

/**
 * TokenStatus Component
 *
 * Displays a formatted token status with an appropriate icon and color.
 * Supports three states: active, expired, and revoked.
 *
 * @example
 * ```tsx
 * <TokenStatus status="active" />
 * <TokenStatus status="expired" />
 * <TokenStatus status="revoked" />
 * ```
 */
const TokenStatus = ({ status }: TokenStatusProps) => {
  const icon = {
    name: statusToIcon[status],
    color: getColor(statusToColor[status]),
  }

  const statusHumanReadable = status.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  )

  return (
    <ViewDetailsContent
      value={statusHumanReadable}
      icon={icon}
    />
  )
}

export { TokenStatus }
export type { TokenStatusProps }
