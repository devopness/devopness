import type { ReactNode } from 'react'
import { ButtonGroupContainer } from './ButtonGroup.styled'

type ButtonGroupProps = {
  /** The buttons to be grouped together */
  children: ReactNode
  /** Whether to add spacing between buttons */
  hasSpacing?: boolean
  /** Whether to align buttons to the right */
  isRightAligned?: boolean
  /** Whether to stack buttons vertically */
  isVertical?: boolean
}

/**
 * ButtonGroup component for grouping related buttons together with consistent spacing and styling.
 * 
 * @example
 * ```jsx
 * <ButtonGroup hasSpacing isRightAligned>
 *   <Button>Cancel</Button>
 *   <Button buttonType="outlinedSecondary">Save</Button>
 * </ButtonGroup>
 * ```
 */
const ButtonGroup = ({
  children,
  hasSpacing = true,
  isRightAligned = false,
  isVertical = false,
}: ButtonGroupProps) => {
  return (
    <ButtonGroupContainer
      data-testid="button-group"
      $hasSpacing={hasSpacing}
      $isRightAligned={isRightAligned}
      $isVertical={isVertical}
    >
      {children}
    </ButtonGroupContainer>
  )
}

export type { ButtonGroupProps }
export { ButtonGroup } 