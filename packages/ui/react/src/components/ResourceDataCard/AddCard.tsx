import type { ReactNode } from 'react'

import { Tooltip } from 'src/components/Primitives/Tooltip'

import {
  AddCardContainer,
  AddCardInner,
  AddCardLabel,
  PlusIconWrapper,
} from './AddCard.style'

type ResourceDataCardAddProps = {
  actionType: string
  resourceType: string
  onClick?: () => void
  disabled?: boolean
  disabledTooltip?: string
  icon?: ReactNode
}

const ResourceDataCardAdd = ({
  resourceType,
  onClick,
  actionType,
  disabled,
  disabledTooltip,
  icon,
}: ResourceDataCardAddProps) => (
  <Tooltip
    title={disabledTooltip ?? ''}
    disableHoverListener={!disabled || !disabledTooltip}
  >
    <AddCardContainer
      onClick={disabled ? undefined : onClick}
      type="button"
      aria-label={`${actionType} ${resourceType}`}
      aria-disabled={disabled}
      $disabled={disabled}
    >
      <AddCardInner $disabled={disabled}>
        <PlusIconWrapper aria-hidden="true">{icon ?? '+'}</PlusIconWrapper>
        <AddCardLabel>{`${actionType} ${resourceType}`}</AddCardLabel>
      </AddCardInner>
    </AddCardContainer>
  </Tooltip>
)

export type { ResourceDataCardAddProps }
export { ResourceDataCardAdd }
