import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const Wrapper = styled.div`
  width: 100%;
`

const Line = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 1px;
  background-color: ${getColor('slate.300')};
`

const Title = styled.h1`
  width: 100%;
  color: ${getColor('blue.950')};
  font-family: ${getFont('montserrat')};
  font-size: 24px;
  font-weight: 600;
`

type ParagraphProps = {
  $subtitleColor?: string
}

const Paragraph = styled.p<ParagraphProps>`
  width: 100%;
  color: ${({ $subtitleColor }) => $subtitleColor ?? getColor('gray.800')};
  font-family: ${getFont('roboto')};
  font-size: 13px;
  line-height: 1.5;

  a {
    color: ${getColor('purple.800')};
  }
`
export { Line, Paragraph, Title, Wrapper }
