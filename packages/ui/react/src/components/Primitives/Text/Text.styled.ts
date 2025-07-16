import { styled } from 'styled-components'

import { Text } from './Text'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const StyledText = styled(Text)`
  color: ${getColor('purple.800')};
  font-family: ${getFont('roboto')};
`

export { StyledText }
