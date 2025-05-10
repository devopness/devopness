import { styled, css } from 'styled-components'

import { getColor } from 'src/colors'
import { removeBlueMark } from 'src/components/styles'
import { getFont } from 'src/fonts'

type PropsStyled = {
  disabled?: boolean
  hasError?: boolean
  type: string
  removeArrows?: boolean
  publicStyle?: {
    fontStyleValue?: string
    fontStylePlaceholder?: string
  }
  readOnly?: boolean
}

const handleInputTextBorderColor = (
  readOnly?: boolean,
  disabled?: boolean,
  hasError?: boolean
) => {
  if (!(readOnly || disabled)) {
    return `border: 1px solid ${getColor(hasError ? 'red.500' : 'purple.800')}`
  }
  return `border: 1px solid ${getColor('slate.300')}`
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  font-family: ${getFont('roboto')};
  font-size: 16px;
  position: relative;
  ${removeBlueMark}
`

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

const InputText = styled.input<PropsStyled>`
  max-width: 100%;
  width: 100%;
  height: 34px;
  font-size: 13px;
  border-radius: 30px 30px;
  padding: 12px 15px;
  box-sizing: border-box;
  border: 1px solid
    ${({ hasError }) => getColor(hasError ? 'red.500' : 'slate.300')};
  background: ${({ hasError }) => getColor(hasError ? 'red.150' : 'gray.200')};
  color: ${getColor('blue.950')};
  font-style: ${(props) => props.publicStyle?.fontStyleValue ?? 'normal'};
  opacity: ${(props) => (props.disabled || props.readOnly ? '0.5' : '1')};

  &:hover,
  &:focus {
    ${(props) =>
      handleInputTextBorderColor(
        props.readOnly,
        props.disabled,
        props.hasError
      )};
  }

  &::placeholder {
    font-size: 13px;
    color: ${({ hasError }) => getColor(hasError ? 'gray.615' : 'slate.400')};
    font-style: ${(props) =>
      props.publicStyle?.fontStylePlaceholder ?? 'normal'};
  }

  ${(props) => {
    if (props.type === 'number') {
      return props.removeArrows ? InputTypeNumberRemoveArrows : InputTypeNumber
    }
  }}
`

export { Container, InputText }
