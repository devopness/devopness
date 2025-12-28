import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'

type TransientSkeletonProps = {
  $widthPercent?: number
  $heightPercent?: number
  $width?: number
  $height?: number
  $borderRadius?: number
}

const skeleton = css`
  background-color: ${getColor('purple.300')};
  animation-name: color;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;

  @keyframes color {
    0% {
      background-color: ${getColor('purple.300')};
    }
    50% {
      background-color: ${getColor('indigo.100')};
    }
    100% {
      background-color: ${getColor('purple.300')};
    }
  }
`

const SkeletonEffect = styled.div<TransientSkeletonProps>`
  width: ${({ $widthPercent, $width }) =>
    $widthPercent ? `${String($widthPercent)}%` : `${String($width ?? 1)}px`};
  height: ${({ $heightPercent, $height }) =>
    $heightPercent
      ? `${String($heightPercent)}%`
      : `${String($height ?? 1)}px`};
  border-radius: ${(props) => props.$borderRadius ?? 0}px;
  ${skeleton}
`

export { SkeletonEffect }
