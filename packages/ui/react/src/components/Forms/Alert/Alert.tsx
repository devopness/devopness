import React from 'react'

import type { Color } from 'src/colors'
import { getColor } from 'src/colors'
import { Button } from 'src/components/Buttons'
import type { Icon } from 'src/icons'
import { iconLoader } from 'src/icons'
import {
  LabelContentWrapper,
  StyledContent,
  StyledIcon,
  StyledLabel,
  Wrapper,
} from './Alert.styled'

type AlertProps = {
  /** Alert variation type that defines its appearance and icon */
  type: 'error' | 'success' | 'warning'
  /** Content to be displayed inside the alert */
  alertDescription: React.ReactNode
  /**
   * Disable default padding
   * @default false
   */
  noPadding?: boolean
  /**
   * Show close button in the alert
   * @default false
   */
  canClose?: boolean
  /**
   * Callback function triggered when the close button is clicked
   * Only works when canClose is true
   */
  onClose?: () => void
}

const alertTypeToIcon = {
  error: 'error',
  success: 'success',
  warning: 'warning',
} as const satisfies Record<AlertProps['type'], Icon>

const alertTypeToIconColor = {
  error: 'blue.950',
  success: 'red.500',
  warning: 'red.500',
} as const satisfies Record<AlertProps['type'], Color>

const DEFAULT_ICON_SIZE = 13

/**
 * Alert component for displaying feedback messages to users
 *
 * @example
 * ```jsx
 * <Alert
 *   type="success"
 *   alertDescription="Operation completed successfully"
 *   canClose
 *   onClose={() => console.log('Alert closed')}
 * />
 * ```
 */
const Alert = (props: AlertProps) => (
  <Wrapper $noPadding={props.noPadding}>
    <StyledContent type={props.type}>
      <StyledIcon type={props.type}>
        {iconLoader(alertTypeToIcon[props.type], DEFAULT_ICON_SIZE)}
      </StyledIcon>
      <StyledLabel
        $fullWidth={props.canClose}
        className="translate"
      >
        <LabelContentWrapper>
          {props.alertDescription}
          {props.canClose ? (
            <Button
              icon="close"
              buttonType="borderless"
              iconColor={getColor(alertTypeToIconColor[props.type])}
              noPadding
              iconSize={12}
              noIconMargin
              onClick={props.onClose}
              typeSize="auto"
              noMargin
            />
          ) : (
            <></>
          )}
        </LabelContentWrapper>
      </StyledLabel>
    </StyledContent>
  </Wrapper>
)

export { Alert }
export type { AlertProps }
