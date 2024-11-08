import { styled, css } from 'styled-components'

import type { DropdownOption } from './Dropdown'
import type { Color } from 'src/colors'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

type StyledProps = {
  brokenSequence?: boolean
  backgroundColor?: string
  isActive?: boolean
  disabled?: boolean | undefined
  color?: Color
} & Partial<Pick<DropdownOption, 'activeBackgroundColor'>>

const borderBottom = css`
  border-top: 1px solid ${getColor('slate.300')};
`

const setBackgroundActive = (color: Color | undefined) => css`
  background-color: ${color ? getColor(color) : ''};
`

const MenuContainer = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${getColor('white')};
`

const MenuOption = styled.div<StyledProps>`
  display: grid;
  grid-template-areas: 'badge text';
  grid-template-columns: auto auto;
  grid-column-gap: 10px;
  justify-content: start;
  align-items: center;
  font-family: ${getFont('roboto')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  height: 42px;
  padding: 0 15px;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  ${(props) => props.brokenSequence && borderBottom}
  ${(props) =>
    props.isActive &&
    !props.disabled &&
    setBackgroundActive(props.activeBackgroundColor)}
  &:hover {
    border-radius: 0;
    background-color: ${getColor('purple.250')};
  }
`

const Text = styled.span<StyledProps>`
  grid-area: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 14px;
  color: ${({ color }) => getColor(color ?? 'blue.800')};
`

const colorIcon = css`
  > svg {
    color: #fff;
    fill: #fff;
  }
`

const ContentBadge = styled.span<StyledProps>`
  grid-area: badge;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 5px;
  text-transform: uppercase;
  font-family: ${getFont('roboto')};
  font-weight: bold;
  font-size: 14px;
  color: ${getColor('blue.800')};

  ${({ backgroundColor }) => !!backgroundColor && colorIcon}
`

const ClickableContainer = styled.div<StyledProps>`
  cursor: pointer;
  display: flex;
  height: 100%;
`

const Grid = styled.div<StyledProps>`
  display: grid;
  grid-template-columns: auto 230px auto;
`

const Wrapper = styled.div<StyledProps>`
  grid-column: 2 / 3;
`

export {
  MenuContainer,
  MenuOption,
  Text,
  ContentBadge,
  ClickableContainer,
  Grid,
  Wrapper,
}
