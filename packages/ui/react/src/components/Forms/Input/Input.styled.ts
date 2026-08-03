import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'
import { removeBlueMark } from 'src/components/styles'
import { getFont } from 'src/fonts'

type IconPositionProps = {
  $iconPosition?: 'left' | 'right'
}

type WrapperProps = {
  $disabled?: boolean
  $readOnly?: boolean
  $error?: boolean
}

type InputTextProps = {
  $disabled?: boolean
  $hasError?: boolean
  type: string
  $removeArrows?: boolean
  $publicStyle?: {
    fontStyleValue?: string
    fontStylePlaceholder?: string
  }
  $readOnly?: boolean
  $hasIcon?: boolean
  $iconPosition?: 'left' | 'right'
}

type InputWrapperProps = {
  $hasError?: boolean
  $disabled?: boolean
  $readOnly?: boolean
}

const wrapperModifiers = {
  error: () => css`
    ${InputWrapper} {
      border-color: ${getColor('red.500')};
      background: ${getColor('red.150')};
    }
    ${Icon} {
      color: ${getColor('red.500')};
    }
  `,
  disabled: () => css`
    ${InputWrapper} {
      border-color: ${getColor('slate.300')};
      background: ${getColor('gray.200')};
    }
    ${InputText},
    ${Icon} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  readOnly: () => css`
    ${InputWrapper} {
      border-color: ${getColor('slate.300')};
      background: ${getColor('gray.200')};
    }
    ${InputText},
    ${Icon} {
      opacity: 0.5;
    }
  `,
}

const InputTypeNumber = css`
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`

const InputTypeNumberRemoveArrows = css`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  & {
    -moz-appearance: textfield;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  font-family: ${getFont('roboto')};
  font-size: 16px;
  position: relative;
  ${removeBlueMark}
`

const InputWrapper = styled.div<InputWrapperProps>`
  ${({ $hasError, $disabled, $readOnly }) => css`
    display: flex;
    align-items: center;
    position: relative;
    background: ${getColor($hasError ? 'red.150' : 'gray.200')};
    border-radius: 30px;
    border: 1px solid ${getColor($hasError ? 'red.500' : 'slate.300')};
    transition: border-color 0.2s ease;

    &:hover,
    &:focus-within {
      ${!($readOnly ?? $disabled) &&
      css`
        border-color: ${getColor($hasError ? 'red.500' : 'purple.800')};
      `}
    }
  `}
`

const InputText = styled.input<InputTextProps>`
  ${({ $hasIcon, $iconPosition, $publicStyle, type, $removeArrows }) => css`
    max-width: 100%;
    width: 100%;
    height: 34px;
    font-size: 13px;
    border-radius: 30px;
    padding: 12px 15px;
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: ${getColor('blue.950')};
    font-style: ${$publicStyle?.fontStyleValue ?? 'normal'};
    outline: none;

    ${$hasIcon &&
    css`
      padding-${$iconPosition === 'left' ? 'left' : 'right'}: 8px;
    `}

    &::placeholder {
      font-size: 13px;
      color: ${getColor('slate.400')};
      font-style: ${$publicStyle?.fontStylePlaceholder ?? 'normal'};
    }

    ${type === 'number' &&
    ($removeArrows ? InputTypeNumberRemoveArrows : InputTypeNumber)}
  `}
`

const Icon = styled.div<IconPositionProps>`
  ${({ $iconPosition }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 100%;
    color: ${getColor('slate.400')};
    order: ${$iconPosition === 'right' ? 1 : 0};

    & > svg {
      width: 100%;
      height: 100%;
      max-width: 18px;
      max-height: 18px;
    }
  `}
`

const Wrapper = styled.div<WrapperProps>`
  ${({ $disabled, $readOnly, $error }) => css`
    ${!!$error && wrapperModifiers.error()};
    ${!!$disabled && wrapperModifiers.disabled()};
    ${!!$readOnly && wrapperModifiers.readOnly()};
  `}
`

export { Container, Icon, InputText, InputWrapper, Wrapper }
