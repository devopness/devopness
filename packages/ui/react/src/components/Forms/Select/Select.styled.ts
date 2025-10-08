import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { removeBlueMark } from 'src/components/styles'
import { getFont } from 'src/fonts'

type PropsStyled = {
  isDisabled?: boolean
  hasError?: boolean
  publicStyle?: {
    fontStyleValue?: string
    fontStylePlaceholder?: string
  }
  isReadOnly?: boolean
}

const handleReactSelectBorderColorWithEvent = ({
  isReadOnly,
  isDisabled,
  hasError,
}: PropsStyled) => {
  if (isReadOnly || isDisabled) {
    return `border: 1px solid ${getColor('slate.300')}`
  }
  const colorName = hasError ? 'red.500' : 'purple.800'
  return `border: 1px solid ${getColor(colorName)}`
}

const handleReactSelectOpacity = ({ isDisabled, isReadOnly }: PropsStyled) =>
  isDisabled || isReadOnly ? '0.5' : '1'

const handleReactSelectBackground = ({ hasError }: PropsStyled) =>
  getColor(hasError ? 'red.150' : 'indigo.100')

const handleReactSelectFontStyle = ({ publicStyle }: PropsStyled) =>
  publicStyle?.fontStyleValue ?? 'normal'

const handleReactSelectBorderColorDefault = ({ hasError }: PropsStyled) =>
  `1px solid ${getColor(hasError ? 'red.500' : 'slate.300')}`

const handleReactSelectCursor = ({ isDisabled, isReadOnly }: PropsStyled) =>
  isDisabled || isReadOnly ? 'normal' : 'pointer'

const handleReactSelectDropdownIndicatorColor = ({
  isReadOnly,
  isDisabled,
}: PropsStyled) =>
  isReadOnly || isDisabled ? `color: ${getColor('slate.300')}` : ''

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: ${getFont('roboto')};
  text-align: left;
  font-size: 16px;
  position: relative;
  ${removeBlueMark}

  /**
   * Hide the last div if it contains a hidden input
   *
   * This is a workaround to hide the extra input field
   * being show for named Multi Selects while maintaining
   * its functionality
   */
  > div > div:last-child:not(.devopness__control):has(input[type="hidden"]) {
    display: none !important;
  }
`

const ReactSelect = styled(Select)`
  font-family: ${getFont('roboto')};
  opacity: ${handleReactSelectOpacity};

  .devopness__control,
  > div {
    min-height: 34px;
    border-radius: 20px 20px;
    overflow: hidden;
    padding: 0 9px;
    font-size: 13px;
    color: ${getColor('purple.800')};
    background: ${handleReactSelectBackground};
    font-style: ${handleReactSelectFontStyle};
    border: ${handleReactSelectBorderColorDefault};
    cursor: ${handleReactSelectCursor};
  }

  .devopness__control {
    &--is-focused,
    &:hover {
      ${handleReactSelectBorderColorWithEvent};
    }
  }

  .devopness__single-value {
    color: ${getColor('blue.950')};
  }

  .devopness__multi-value {
    background-color: ${getColor('indigo.100')};
    border-radius: 20px;
    border: 1px solid ${getColor('purple.800')};
    margin: 2px;

    &__label {
      color: ${getColor('purple.800')};
      font-size: 14px;
      padding: 2px 10px;
      border-radius: 20px;
    }

    &__remove {
      color: ${getColor('purple.800')};
      padding: 0 6px;
      border-radius: 0 20px 20px 0;

      &:hover {
        background-color: ${getColor('red.500')};
        color: ${getColor('white')};
      }
    }
  }

  .devopness__control {
    box-shadow: none;

    &--menu-is-open {
      border-radius: 20px 20px 0 0;
      box-shadow: none;
    }
  }

  .devopness__option {
    color: ${getColor('blue.950')};
    height: 34px;
    padding: 0;

    &--is-selected,
    &--is-focused {
      background-color: ${getColor('purple.800')};
      color: ${getColor('white')};
    }
  }

  .devopness__menu {
    border-radius: 0 0 20px 20px;
    padding: 0;
    margin: 0;
    margin-top: -2px;
    border-color: ${(props: PropsStyled) =>
      getColor(props.hasError ? 'red.500' : 'purple.800')};
    border-top: none;
    box-shadow: none;
  }

  .devopness__dropdown-indicator {
    ${handleReactSelectDropdownIndicatorColor};

    &--is-focused,
    &:hover {
      ${handleReactSelectDropdownIndicatorColor};
    }
  }

  &&& input {
    ${removeBlueMark};
  }
` as typeof Select

const ReactCreatableSelect = styled(CreatableSelect)`
  font-family: ${getFont('roboto')};
  opacity: ${handleReactSelectOpacity};

  .devopness__control,
  > div {
    min-height: 34px;
    border-radius: 20px 20px;
    overflow: hidden;
    padding: 0 9px;
    font-size: 13px;
    color: ${getColor('purple.800')};
    background: ${handleReactSelectBackground};
    font-style: ${handleReactSelectFontStyle};
    border: ${handleReactSelectBorderColorDefault};
    cursor: ${handleReactSelectCursor};
  }

  .devopness__control {
    &--is-focused,
    &:hover {
      ${handleReactSelectBorderColorWithEvent};
    }
  }

  .devopness__single-value {
    color: ${getColor('blue.950')};
  }

  .devopness__control {
    box-shadow: none;

    &--menu-is-open {
      border-radius: 20px 20px 0 0;
      box-shadow: none;
    }
  }

  .devopness__option {
    color: ${getColor('blue.950')};
    height: 34px;
    padding: 0;

    &--is-selected,
    &--is-focused {
      background-color: ${getColor('purple.800')};
      color: ${getColor('white')};
    }
  }

  .devopness__menu {
    border-radius: 0 0 20px 20px;
    padding: 0;
    margin: 0;
    margin-top: -2px;
    border-color: ${(props: PropsStyled) =>
      getColor(props.hasError ? 'red.500' : 'purple.800')};
    border-top: none;
    box-shadow: none;
  }

  .devopness__dropdown-indicator {
    ${handleReactSelectDropdownIndicatorColor};

    &--is-focused,
    &:hover {
      ${handleReactSelectDropdownIndicatorColor};
    }
  }

  &&& input {
    ${removeBlueMark};
  }
` as typeof CreatableSelect
export { Container, ReactSelect, ReactCreatableSelect }
