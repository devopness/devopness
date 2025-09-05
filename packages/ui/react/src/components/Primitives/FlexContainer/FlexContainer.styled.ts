import { styled } from 'styled-components'

import { FlexContainerProps } from './FlexContainer'

const FlexContainerWrapper = styled.div<FlexContainerProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction ?? 'row'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  align-items: ${({ align }) => align ?? 'flex-start'};
  flex-wrap: ${({ wrap }) => wrap ?? 'nowrap'};
  gap: ${({ gap }) => gap ?? '0'};
`

export { FlexContainerWrapper }
