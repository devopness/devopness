import { Container, ArrowShape } from './ArrowHead.styled'

type ArrowHeadProps = {
  /** Fill color for the arrow shape */
  fill: string
  /** Stroke color for the arrow shape border */
  stroke: string
  /** CSS styles to apply to the arrow shape */
  style?: React.CSSProperties
  /**
   * Event handler called when the arrow is clicked.
   */
  onClick?: React.MouseEventHandler
}

/**
 * An arrow separator
 *
 * @example
 * <ArrowHead
 *   fill="#000000"
 *   stroke="#FFFFFF"
 * />
 */
const ArrowHead = ({ fill, stroke, style, onClick }: ArrowHeadProps) => (
  <Container onClick={onClick}>
    <ArrowShape
      fill={fill}
      stroke={stroke}
      style={style}
    >
      <path d="M 0 0 L 0.84 0.42 Q 0.92 0.5 0.84 0.58 L 0 1 Z" />
    </ArrowShape>
  </Container>
)

export type { ArrowHeadProps }
export { ArrowHead }
