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
  /** Keyboard handler for interactive arrow separators. */
  onKeyDown?: React.KeyboardEventHandler
  /** Accessible name for interactive arrow separators. */
  'aria-label'?: string
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
const ArrowHead = ({
  fill,
  stroke,
  style,
  onClick,
  onKeyDown,
  'aria-label': ariaLabel,
}: ArrowHeadProps) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown?.(event)

    if (
      !onClick ||
      event.defaultPrevented ||
      (event.key !== 'Enter' && event.key !== ' ')
    ) {
      return
    }

    event.preventDefault()
    event.currentTarget.click()
  }

  return (
    <Container
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <ArrowShape
        fill={fill}
        stroke={stroke}
        style={style}
      >
        <path d="M 0 0 L 0.84 0.42 Q 0.92 0.5 0.84 0.58 L 0 1 Z" />
      </ArrowShape>
    </Container>
  )
}

export type { ArrowHeadProps }
export { ArrowHead }
