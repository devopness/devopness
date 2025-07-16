import { RingLoader as BaseRingLoader } from 'react-spinners'

import { styled } from 'styled-components'

import type { ReactSpinnersProps } from './ReactSpinners.type'

type RingLoaderProps = ReactSpinnersProps

type StyledRingLoaderProps = {
  color?: string
} & RingLoaderProps

const RingLoaderCustom = styled(BaseRingLoader)<StyledRingLoaderProps>`
  color: ${(props) => props.color ?? '#000'};
  fill: ${(props) => props.color ?? '#000'};
  &&& {
    margin: 5px;
  }
`

const RingLoader = ({ color, ...restProps }: RingLoaderProps) => (
  <RingLoaderCustom
    color={color}
    {...restProps}
  />
)

export { RingLoader }
