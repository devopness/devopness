import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

export const StyledErrorMessage = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.8em;
  font-weight: 400;
  margin-top: 5px;
  color: ${getColor('red.600')};
  width: 100%;
  display: ${({ children }) => (children ? 'inline-block' : 'none')};
  text-align: right;
`
