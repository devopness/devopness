import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

// FAQ: why $ prefix on props?
//   A: Styled Component v5.1 Transient prop format
//      Read more @ https://styled-components.com/docs/api#transient-props

type StyledLinkProps = {
  $showUnderline: boolean
  $showUnderlineOnHover: boolean
}

const StyledLink = styled.a<StyledLinkProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: ${getFont('roboto')};
  margin-right: 5px;
  color: ${({ color }) => color};

  text-decoration: ${(props) => (props.$showUnderline ? 'underline' : 'none')};

  &:hover {
    color: ${getColor('blue.950')};
    text-decoration: ${(props) =>
      props.$showUnderlineOnHover ? 'underline' : 'none'};
  }

  & > svg {
    padding-left: 0.1875rem; /* => 3px */
  }
`

export { StyledLink }
