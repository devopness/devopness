import { styled } from 'styled-components'

type ArrowShapeProps = {
  fill: string
  stroke: string
}

const Container = styled.div`
  width: 30px;
  overflow: hidden;
`

const ArrowShape = styled.svg.attrs({
  viewBox: '0 0 1 1',
  preserveAspectRatio: 'none',
} as const)<ArrowShapeProps>`
  height: calc(100% + 5px);
  width: calc(100% + 2px);
  stroke-width: 0.018;
  margin-top: -2px;
  margin-left: -2px;
  fill: ${({ fill }) => fill};
  stroke: ${({ stroke }) => stroke};
`

export { Container, ArrowShape }
