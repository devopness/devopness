import { BubbleSpinLoader } from 'react-css-loaders'

import styled from 'styled-components'

const BubbleSpinLoaderCustom = styled(BubbleSpinLoader)`
  color: ${(props) => (props.color as string | undefined) ?? '#000'};
  fill: ${(props) => (props.color as string | undefined) ?? '#000'};
  &&& {
    margin: 5px;
  }
`

const CircleBubble = ({
  color,
  ...restProps
}: {
  color: string
  size: number
}) => (
  <BubbleSpinLoaderCustom
    color={color}
    {...restProps}
  />
)

export { CircleBubble }
