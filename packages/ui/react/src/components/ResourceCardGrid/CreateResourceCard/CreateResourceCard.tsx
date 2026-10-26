import type { KeyboardEvent } from 'react'

import { Tooltip } from 'src/components/Primitives/Tooltip'

import {
  CardContainer,
  CardInner,
  CreateIconWrapper,
  Label,
} from './CreateResourceCard.styled'

type CreateResourceCardProps = {
  resourceType: string
  onClick?: () => void
  createResourceDisabled?: boolean
  createResourceDisabledReason?: string
}

/**
 * Dashed-border tile inviting the user to create a new resource. Rendered as
 * the first tile inside `ResourceCardGrid`, not part of the public API.
 */
const CreateResourceCard = ({
  resourceType,
  onClick,
  createResourceDisabled = false,
  createResourceDisabledReason,
}: CreateResourceCardProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (createResourceDisabled) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick?.()
  }

  const card = (
    <CardContainer
      $disabled={createResourceDisabled}
      aria-disabled={createResourceDisabled}
      onClick={createResourceDisabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={createResourceDisabled ? -1 : 0}
    >
      <CardInner>
        <CreateIconWrapper>+</CreateIconWrapper>
        <Label>Add {resourceType}</Label>
      </CardInner>
    </CardContainer>
  )

  if (createResourceDisabled && createResourceDisabledReason) {
    return (
      <Tooltip title={createResourceDisabledReason}>
        <span>{card}</span>
      </Tooltip>
    )
  }

  return card
}

export type { CreateResourceCardProps }
export { CreateResourceCard }
