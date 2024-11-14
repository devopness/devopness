import { styled, css } from 'styled-components'

import type { ButtonProps } from '.'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

type CustomButton = {
  backgroundColor?: string
  color?: string
  borderColor?: string
}

type StyledProps = {
  noMargin?: boolean
  noPadding?: boolean
  size: NonNullable<ButtonProps['typeSize']>
  variant?: string
  custom?: CustomButton
  icon?: boolean
  alignEnd?: boolean
  reversed: boolean
  noPointerEvents?: boolean
}

const backgroundColor = (buttonType?: string, custom?: CustomButton) => {
  switch (buttonType) {
    case 'borderless':
      return 'transparent'
    case 'outlinedSecondary':
    case 'outlinedAuxiliary':
      return custom?.backgroundColor ?? getColor('white')
    default:
      return custom?.backgroundColor ?? getColor('purple.800')
  }
}

const getTextColor = (buttonType?: string, custom?: CustomButton) => {
  switch (buttonType) {
    case 'borderless':
    case 'outlinedSecondary':
    case 'outlinedAuxiliary':
      return custom?.color ?? getColor('purple.800')
    default:
      return custom?.color ?? getColor('white')
  }
}

const getBorderStyle = (buttonType?: string) => {
  switch (buttonType) {
    case 'borderless':
      return 'none'
    default:
      return 'solid'
  }
}

const getBorderColor = (buttonType?: string, custom?: CustomButton) => {
  switch (buttonType) {
    case 'borderless':
      return ''
    case 'outlinedSecondary':
      return custom?.borderColor ?? getColor('purple.800')
    case 'outlinedAuxiliary':
      return custom?.borderColor ?? getColor('gray.800')
    default:
      return custom?.borderColor ?? getColor('purple.800')
  }
}

const getBorderWidth = (typeSize: StyledProps['size']) => {
  switch (typeSize) {
    case 'medium':
      return 1
    default:
      return 2
  }
}

const getTypeSize = (typeSize: StyledProps['size']) => {
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
  Pick<ButtonProps, 'noIconMargin'> & {
    reversed: ButtonProps['revertOrientation']
    size: Required<ButtonProps['iconSize']>
  }
>`
  ${({ noIconMargin, reversed: revertOrientation, size: iconSize }) => css`
    display: flex;
    align-items: center;
    width: ${iconSize}px;
    height: ${iconSize}px;
    ${noIconMargin
      ? ''
      : revertOrientation
        ? 'margin-left: 10px;'
        : 'margin-right: 10px;'}
  `}
`

const Label = styled.span``

const WrapperButtons = styled.div<StyledProps>`
  ${({ alignEnd }) => css`
    display: flex;
    justify-content: ${alignEnd && 'flex-end'};
    align-items: center;

    width: 100%;
    height: 126px;
  `}
`

const BaseButton = styled.button<StyledProps>`
  ${({
    size: typeSize,
    variant: buttonType,
    custom,
    noMargin,
    reversed: revertOrientation,
    noPointerEvents,
    noPadding,
  }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px;
    border-radius: 25px;
    font-family: ${getFont('roboto')};
    text-transform: uppercase;
    padding: ${noPadding ? '0' : '5px 15px'};
    nomargin: ${noMargin ? '0' : '0 15px'};
    font-size: 13px;
    flex-direction: ${revertOrientation ? 'row-reverse' : 'row'};
    border-width: ${getBorderWidth(typeSize)};
    border-style: ${getBorderStyle(buttonType)};
    border-color: ${getBorderColor(buttonType, custom)};
    color: ${getTextColor(buttonType, custom)};
    background-color: ${backgroundColor(buttonType, custom)};
    height: ${getTypeSize(typeSize)};
    line-height: 1;
    transition: filter 0.3s;

    &:hover:enabled {
      filter: brightness(75%);
    }

    &:disabled {
      pointer-events: ${noPointerEvents ? 'none' : 'auto'};
      opacity: 0.5;
      cursor: not-allowed;
    }

    user-select: none;
  `}
`

const SmallWrapper = styled.div<StyledProps>`
  ${({ icon }) => css`
    width: 16px;
    height: 16px;
    margin-right: ${icon ? '9px' : '10px'};
  `}
`

export { ContentIcon, Label, WrapperButtons, BaseButton, SmallWrapper }
