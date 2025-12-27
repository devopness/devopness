import { styled } from 'styled-components'

type FlexStyledProps = {
  $direction?: 'row' | 'column'
  $justify?:
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  $align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  $wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  $gap?: string
}

const FlexContainerWrapper = styled.div<FlexStyledProps>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction ?? 'row'};
  justify-content: ${({ $justify }) => $justify ?? 'flex-start'};
  align-items: ${({ $align }) => $align ?? 'flex-start'};
  flex-wrap: ${({ $wrap }) => $wrap ?? 'nowrap'};
  gap: ${({ $gap }) => $gap ?? '0'};
`

export { FlexContainerWrapper }
