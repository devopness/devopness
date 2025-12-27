import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'
import { getImageAssetUrl } from 'src/icons'

const EXPAND_AREA_IMAGE = getImageAssetUrl('expand_area.svg')

type PropsStyled = {
  $hasError?: boolean
  $noResize?: boolean
  $disabled?: boolean
  $readOnly?: boolean
}

const removeBlueMark = css`
  outline: none;

  & textarea:focus,
  input:focus {
    outline: none;
  }

  & *:focus {
    outline: none;
  }
`
const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: ${getFont('roboto')};
  font-size: 16px;
  ${removeBlueMark}
`

const StyledTextarea = styled.textarea<PropsStyled>`
  font-family: ${getFont('mono')};
  width: 100%;
  min-height: 118px;

  font-size: 13px;
  padding: 12px 15px;
  background: ${({ $hasError }) =>
    getColor($hasError ? 'red.150' : 'indigo.100')};
  border: 1px solid
    ${({ $hasError }) => getColor($hasError ? 'red.500' : 'slate.300')};
  border-radius: 10px;
  box-sizing: border-box;
  overflow-y: auto;
  opacity: ${({ $readOnly }) => ($readOnly ? '0.5' : '1')};
  color: ${getColor('blue.950')};
  resize: ${({ $noResize }) => ($noResize ? 'none' : 'vertical')};

  &:hover,
  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? getColor('red.500') : getColor('purple.800')};
    ${({ $readOnly }) =>
      $readOnly && `border: 1px solid ${getColor('slate.300')}`}
  }

  &::placeholder {
    font-family: ${getFont('roboto')};
    color: ${({ $hasError, $readOnly }) =>
      $readOnly
        ? '#6F737C'
        : $hasError
          ? getColor('gray.615')
          : getColor('slate.400')};
    font-size: 13px;
  }

  &::-webkit-scrollbar {
    width: auto;
  }
  &::-webkit-scrollbar-track {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background-color: ${getColor('gray.615')};
    border: 3px solid transparent;
    background-clip: content-box;
  }
  &::-webkit-resizer {
    background-image: url(${EXPAND_AREA_IMAGE});
    background-size: cover;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-corner {
    outline: none;
    border: none;
    background-color: transparent;
  }
`

export { Container, StyledTextarea }
