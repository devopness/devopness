import React from 'react'

import Popover from '@mui/material/Popover'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'

import { Button } from 'src/components/Buttons'

/**
 * Props for `PopoverPopupState` component
 */
type PopoverPopupStateProps = {
  /** Element that triggers the popover */
  trigger: React.ReactNode
  /** Content displayed inside the popover */
  children: React.ReactNode
}

/**
 * `PopoverPopupState` wraps Material-UI Popover with `material-ui-popup-state`
 * for easy popup handling.
 *
 * Provides a button trigger and content popover, handling open/close state automatically.
 *
 * @example
 * <PopoverPopupState
 *   trigger={<IconLoader accessorName="more" size={20} />}
 * >
 *   <div>Popover content here</div>
 * </PopoverPopupState>
 */
const PopoverPopupState = ({ trigger, children }: PopoverPopupStateProps) => (
  <PopupState
    variant="popover"
    popupId="popover-popup-state"
  >
    {(popupState) => (
      <div>
        <Button
          {...bindTrigger(popupState)}
          noMargin
          buttonType="borderless"
        >
          {trigger}
        </Button>
        <Popover
          {...bindPopover(popupState)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {children}
        </Popover>
      </div>
    )}
  </PopupState>
)

export type { PopoverPopupStateProps }
export { PopoverPopupState }
