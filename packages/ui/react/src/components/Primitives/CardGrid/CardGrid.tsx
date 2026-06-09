import { CardGridWrapper } from './CardGrid.styled'

type CardGridColumns = {
  /** Columns to render below 641px (mobile). Defaults to `1`. */
  mobile?: number
  /** Columns to render between 641px and 1024px (tablet). Defaults to `2`. */
  tablet?: number
  /** Columns to render at 1025px and above (desktop). Defaults to `4`. */
  desktop?: number
}

type CardGridProps = {
  /** Cards or other elements to render inside the grid */
  children: React.ReactNode
  /**
   * Column counts per breakpoint. Each field is optional and falls back to
   * the design-system defaults (`1` / `2` / `4`).
   */
  columns?: CardGridColumns
  /** Gap between cards. Defaults to `'1.5rem'`. */
  gap?: string
  /**
   * Fixed height for every row in the grid. When omitted, rows size to their
   * content.
   */
  rowHeight?: string
}

/**
 * `CardGrid` is a responsive grid layout primitive optimized for displaying
 * collections of card-shaped children. It does not impose any styling on the
 * cards themselves — the caller is responsible for rendering tile content.
 *
 * Breakpoints (fixed):
 * - Mobile: below 641px
 * - Tablet: 641px to 1024px
 * - Desktop: 1025px and above
 *
 * @example
 * ```tsx
 * <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} rowHeight="160px">
 *   {items.map((item) => (
 *     <Card key={item.id} {...item} />
 *   ))}
 * </CardGrid>
 * ```
 */
const CardGrid = ({
  children,
  columns,
  gap = '1.5rem',
  rowHeight,
}: CardGridProps) => (
  <CardGridWrapper
    $columnsMobile={columns?.mobile ?? 1}
    $columnsTablet={columns?.tablet ?? 2}
    $columnsDesktop={columns?.desktop ?? 4}
    $gap={gap}
    $rowHeight={rowHeight}
  >
    {children}
  </CardGridWrapper>
)

export { CardGrid }
export type { CardGridProps, CardGridColumns }
