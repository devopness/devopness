import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const Container = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 25px;
  padding: 0 10px;
  border-radius: 20px;
  border: 1px solid ${getColor('gray.800')};
  background: ${getColor('white')};
  font-family: ${getFont('roboto')};
  color: ${getColor('blue.950')};
  font-size: 13px;
`
export { Container }
