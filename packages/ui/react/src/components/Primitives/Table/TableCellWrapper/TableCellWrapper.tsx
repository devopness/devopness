import type { PropsWithChildren, ReactNode } from 'react'
import { memo } from 'react'

import { Tooltip } from 'src/components/Primitives/Tooltip'
import type { Icon as IconName } from 'src/icons'
import { iconLoader } from 'src/icons'
import { isDefined } from 'src/components/type-guards'

import {
  TableCellIcon,
  TableCellValue,
  TableCellWrapper as TableCellWrapperStyle,
} from './TableCellWrapper.styled'

/** Props for `TableCellWrapper`. */
interface TableCellWrapperProps {
  /** An icon name or custom React node displayed before the value. */
  icon?: IconName | Exclude<ReactNode, string>
  /** Content displayed beside the icon. */
  value: ReactNode
  /** Pixel size used when rendering an icon by name. */
  iconSize?: number
  /** Color used when rendering an icon by name. */
  iconColor?: string
  /** Background color behind the icon. */
  iconBackgroundColor?: string
  /** Optional tooltip shown for an icon. */
  iconTooltip?: string
}

/**
 * Renders a consistently styled table cell value with optional icon content.
 *
 * @example
 * ```tsx
 * <TableCellWrapper icon="check" value="Healthy" iconColor="#16a34a" />
 * ```
 */
function TableCellWrapper({
  icon,
  iconSize,
  value,
  iconBackgroundColor = 'transparent',
  iconColor = 'white',
  iconTooltip,
  children,
}: PropsWithChildren<TableCellWrapperProps>) {
  return (
    <TableCellWrapperStyle>
      {children ? (
        <TableCellIcon $iconBackgroundColor={iconBackgroundColor}>
          {children}
        </TableCellIcon>
      ) : (
        icon && (
          <Tooltip
            title={iconTooltip ?? ''}
            disableHover={!isDefined(iconTooltip)}
            disableFocusListener={!isDefined(iconTooltip)}
            disableTouchListener={!isDefined(iconTooltip)}
            disableHoverListener={!isDefined(iconTooltip)}
          >
            <TableCellIcon $iconBackgroundColor={iconBackgroundColor}>
              {typeof icon === 'string'
                ? iconLoader(
                    icon as IconName,
                    iconSize || 12,
                    iconColor,
                    1,
                    iconTooltip
                  )
                : icon}
            </TableCellIcon>
          </Tooltip>
        )
      )}
      <TableCellValue>{value}</TableCellValue>
    </TableCellWrapperStyle>
  )
}

export type { TableCellWrapperProps }
export { TableCellWrapper }
export default memo(TableCellWrapper)
