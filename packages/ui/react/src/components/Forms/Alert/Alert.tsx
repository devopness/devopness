import React from 'react'

import type { Color } from 'src/colors'
import { getColor } from 'src/colors'

import {
  Wrapper,
  StyledContent,
  StyledIcon,
  StyledLabel,
  LabelContentWrapper,
} from './Alert.styled'

import { Button } from 'src/components/Buttons'
import type { Icon } from 'src/icons'
import { iconLoader } from 'src/icons'

type AlertProps = {
  type: 'error' | 'success' | 'warning'
  alertDescription: React.ReactNode
  /** Disable default padding, top 42px and bottom 20px */
  noPadding?: boolean
  /** Show close button */
  canClose?: boolean
  /** Handle close events */
  onClose?: () => void
}

const alertTypeToIcon = {
  error: 'error',
  success: 'checkCircle',
  warning: 'warning',
} as const satisfies Record<AlertProps['type'], Icon>

const alertTypeToIconColor = {
  error: 'blue.950',
  success: 'red.500',
  warning: 'red.500',
} as const satisfies Record<AlertProps['type'], Color>

const DEFAULT_ICON_SIZE = 13

function Alert(props: AlertProps) {
  return (
    <Wrapper noPadding={props.noPadding}>
      <StyledContent type={props.type}>
        <StyledIcon type={props.type}>
          {iconLoader(alertTypeToIcon[props.type], DEFAULT_ICON_SIZE)}
        </StyledIcon>
        <StyledLabel
          fullWidth={props.canClose}
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
                noIconMargin
                onClick={props.onClose}
              />
            ) : (
              <></>
            )}
          </LabelContentWrapper>
        </StyledLabel>
      </StyledContent>
    </Wrapper>
  )
}

export type { AlertProps }
export default React.memo(Alert)
