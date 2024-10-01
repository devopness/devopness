import { BubbleSpinLoader } from 'react-css-loaders'

import styled from 'styled-components'

const BubbleSpinLoaderCustom = styled(BubbleSpinLoader)`
  color: ${(props) => props.color ?? '#000'};
  fill: ${(props) => props.color ?? '#000'};
  &&& {
    margin: 5px;
  }
`

const CircleBubble = ({ color, ...restProps }: { color: string }) => (
  <BubbleSpinLoaderCustom
    color={color}
    {...restProps}
  />
)

export { CircleBubble }
