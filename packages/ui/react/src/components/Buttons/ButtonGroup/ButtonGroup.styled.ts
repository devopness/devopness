import { styled, css } from 'styled-components'

type StyledProps = {
  /** Whether to add spacing between buttons */
  $hasSpacing: boolean
  /** Whether to align buttons to the right */
  $isRightAligned: boolean
  /** Whether to stack buttons vertically */
  $isVertical: boolean
}

const ButtonGroupContainer = styled.div<StyledProps>`
  ${({ $hasSpacing, $isRightAligned, $isVertical }) => css`
    /** Base */
    display: flex;
    width: 100%;

    /** Flex Layout */
    flex-direction: ${$isVertical ? 'column' : 'row'};
    gap: ${$hasSpacing ? '10px' : '0'};
    justify-content: ${$isRightAligned ? 'flex-end' : 'flex-start'};
    align-items: ${$isVertical ? 'stretch' : 'center'};

    /** Child Buttons */
    & > button {
      margin: 0;
    }
  `}
`

export { ButtonGroupContainer } 