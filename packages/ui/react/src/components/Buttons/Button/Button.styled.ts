import { styled, css } from 'styled-components'

import type { ButtonProps } from '.'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

type StyledProps = {
  /**
   * Button props related to styling
   *
   * Adds a `$` prefix to the prop name to prevent it from being passed to the
   * underlying React node or rendered to the DOM element
   *
   * @see {@link https://styled-components.com/docs/api#transient-props | Styled Components - Transient props}
   */
  [Key in keyof Pick<
    ButtonProps,
    | 'backgroundColor'
    | 'borderColor'
    | 'buttonType'
    | 'color'
    | 'iconSize'
    | 'noIconMargin'
    | 'noMargin'
    | 'noPadding'
    | 'noPointerEvents'
    | 'revertOrientation'
    | 'typeSize'
  > as `$${Key}`]: ButtonProps[Key]
}

const getBackgroundColor = (
  buttonType: StyledProps['$buttonType'],
  backgroundColor: StyledProps['$backgroundColor']
) => {
  switch (buttonType) {
    case 'borderless':
      return 'transparent'
    case 'outlinedSecondary':
    case 'outlinedAuxiliary':
      return backgroundColor ?? getColor('white')
    default:
      return backgroundColor ?? getColor('purple.800')
  }
}

const getTextColor = (
  buttonType: StyledProps['$buttonType'],
  color: StyledProps['$color']
) => {
  switch (buttonType) {
    case 'borderless':
    case 'outlinedSecondary':
    case 'outlinedAuxiliary':
      return color ?? getColor('purple.800')
    default:
      return color ?? getColor('white')
  }
}

const getBorderStyle = (buttonType: StyledProps['$buttonType']) => {
  switch (buttonType) {
    case 'borderless':
      return 'none'
    default:
      return 'solid'
  }
}

const getBorderColor = (
  buttonType: StyledProps['$buttonType'],
  borderColor: StyledProps['$borderColor']
) => {
  switch (buttonType) {
    case 'borderless':
      return ''
    case 'outlinedSecondary':
      return borderColor ?? getColor('purple.800')
    case 'outlinedAuxiliary':
      return borderColor ?? getColor('gray.800')
    default:
      return borderColor ?? getColor('purple.800')
  }
}

const getBorderWidth = (typeSize: StyledProps['$typeSize']) => {
  switch (typeSize) {
    case 'medium':
      return 1
    default:
      return 2
  }
}

const getHeight = (typeSize: StyledProps['$typeSize']) => {
  switch (typeSize) {
    case 'auto':
      return 'auto'
    case 'medium':
      return '27px'
    default:
      return '34px'
  }
}

const ContentIcon = styled.div<Pick<StyledProps, '$iconSize'>>`
  ${({ $iconSize }) => css`
    /** Base */
    display: flex;
    height: ${$iconSize}px;
    width: ${$iconSize}px;

    /** Flex Layout */
    align-items: center;
  `}
`

const Label = styled.span``

const BaseButton = styled.button<
  Pick<
    StyledProps,
    | '$backgroundColor'
    | '$borderColor'
    | '$buttonType'
    | '$color'
    | '$noIconMargin'
    | '$noMargin'
    | '$noPadding'
    | '$noPointerEvents'
    | '$revertOrientation'
    | '$typeSize'
  >
>`
  ${({
  $backgroundColor,
  $borderColor,
  $buttonType,
  $color,
  $noIconMargin,
  $noMargin,
  $noPadding,
  $noPointerEvents,
  $revertOrientation,
  $typeSize,
}) => css`
    /** Base */
    cursor: pointer;
    display: flex;
    background-color: ${getBackgroundColor($buttonType, $backgroundColor)};
    height: ${getHeight($typeSize)};
    margin: ${$noMargin ? '0' : '0'};
    padding: ${$noPadding ? '0' : '5px 15px'};
    user-select: none;

    /** Flex Layout */
    gap: ${$noIconMargin ? '0' : '10px'};
    align-items: center;
    flex-direction: ${$revertOrientation ? 'row-reverse' : 'row'};
    justify-content: center;

    /** Text */
    color: ${getTextColor($buttonType, $color)};
    font-family: ${getFont('roboto')};
    font-size: 13px;
    line-height: 1;
    text-transform: uppercase;
    transition: filter 0.3s;

    /** Border */
    border-color: ${getBorderColor($buttonType, $borderColor)};
    border-radius: 25px;
    border-style: ${getBorderStyle($buttonType)};
    border-width: ${getBorderWidth($typeSize)}px;

    &:hover:enabled {
      filter: brightness(75%);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: ${$noPointerEvents ? 'none' : 'auto'};
    }
  `}
`

export { BaseButton, ContentIcon, Label }
