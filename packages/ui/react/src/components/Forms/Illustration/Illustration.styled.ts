import { styled } from 'styled-components'

import { getColor } from 'src/colors'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 126px;
  border-bottom: 1px solid ${getColor('slate.300')};
`
export { Wrapper }
