import type { KeyboardEvent } from 'react'

import {
  CardContainer,
  CardInner,
  CreateIconWrapper,
  Label,
} from './CreateResourceCard.styled'

type CreateResourceCardProps = {
  resourceType: string
  onClick?: () => void
}

/**
 * Dashed-border tile inviting the user to create a new resource. Rendered as
 * the first tile inside `ResourceCardGrid`, not part of the public API.
 */
const CreateResourceCard = ({
  resourceType,
  onClick,
}: CreateResourceCardProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick?.()
  }

  return (
    <CardContainer
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <CardInner>
        <CreateIconWrapper>+</CreateIconWrapper>
        <Label>Add {resourceType}</Label>
      </CardInner>
    </CardContainer>
  )
}

export type { CreateResourceCardProps }
export { CreateResourceCard }
