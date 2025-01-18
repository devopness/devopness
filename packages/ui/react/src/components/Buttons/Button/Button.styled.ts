import { styled, css } from 'styled-components'

import type { ButtonProps } from '.'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

type StyledProps = {
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

const ContentIcon = styled.div<
  Pick<StyledProps, '$iconSize' | '$noIconMargin' | '$revertOrientation'>
>`
  ${({ $iconSize, $noIconMargin, $revertOrientation }) => css`
    display: flex;
    align-items: center;
    width: ${$iconSize}px;
    height: ${$iconSize}px;
    ${$noIconMargin
      ? ''
      : $revertOrientation
        ? 'margin-left: 10px;'
        : 'margin-right: 10px;'}
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
    $noMargin,
    $noPadding,
    $noPointerEvents,
    $revertOrientation,
    $typeSize,
  }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px;
    border-radius: 25px;
    font-family: ${getFont('roboto')};
    text-transform: uppercase;
    padding: ${$noPadding ? '0' : '5px 15px'};
    margin: ${$noMargin ? '0' : '0 15px'};
    font-size: 13px;
    flex-direction: ${$revertOrientation ? 'row-reverse' : 'row'};
    border-width: ${getBorderWidth($typeSize)};
    border-style: ${getBorderStyle($buttonType)};
    border-color: ${getBorderColor($buttonType, $borderColor)};
    color: ${getTextColor($buttonType, $color)};
    background-color: ${getBackgroundColor($buttonType, $backgroundColor)};
    height: ${getHeight($typeSize)};
    line-height: 1;
    transition: filter 0.3s;

    &:hover:enabled {
      filter: brightness(75%);
    }

    &:disabled {
      pointer-events: ${$noPointerEvents ? 'none' : 'auto'};
      opacity: 0.5;
      cursor: not-allowed;
    }

    user-select: none;
  `}
`

export { BaseButton, ContentIcon, Label }
