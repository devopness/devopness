import type { KeyboardEvent } from 'react'

import {
  CardContainer,
  CardInner,
  CreateIconWrapper,
  Label,
} from './CreateResourceCard.styled'

type CreateResourceCardProps = {
  resourceType: string
  disabled?: boolean //  I'll check whether it's disabled or not
  onClick?: () => void
}

/**
 * Dashed-border tile inviting the user to create a new resource. Rendered as
 * the first tile inside `ResourceCardGrid`, not part of the public API.
 */
const CreateResourceCard = ({
  resourceType,
  onClick,
  disabled,
}: CreateResourceCardProps) => {
  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    if (disabled) return
    onClick?.()
  }

  return (
    <CardContainer
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex ={disabled?-1:0} // for keyboard navigation
      aria-disabled = {disabled}  // For screen reader users
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
