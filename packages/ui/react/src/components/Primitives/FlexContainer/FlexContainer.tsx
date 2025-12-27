import { FlexContainerWrapper } from './FlexContainer.styled'

type FlexContainerProps = {
  /** Elements to render inside the flex container */
  children: React.ReactNode
  /** Flex direction: row or column */
  direction?: 'row' | 'column'
  /** Align items */
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  /** Wrap behavior */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  /** Gap between children */
  gap?: string
  /** Justify content */
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
}

/**
 * FlexContainer provides a reusable flexbox wrapper
 * for layout composition across the UI.
 *
 * @example
 * ```jsx
 * <FlexContainer direction="column" gap="16px">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </FlexContainer>
 * ```
 */
const FlexContainer = ({
  children,
  direction,
  align,
  wrap,
  gap,
  justify,
}: FlexContainerProps) => (
  <FlexContainerWrapper
    $direction={direction}
    $align={align}
    $wrap={wrap}
    $gap={gap}
    $justify={justify}
  >
    {children}
  </FlexContainerWrapper>
)

export { FlexContainer }
export type { FlexContainerProps }
