import { ContainerStyled, WrapperContent } from './Container.styled'

type ContainerProps = {
  /** Removes the default top margin (42px)
   * @default false
   */
  shouldRemoveTopMargin?: boolean
  /** Optional styles for the inner content wrapper */
  styles?: {
    /** Background color for content wrapper */
    backgroundWrapperContent?: string
    /** Height (in px) for content wrapper */
    height?: number
  }
  /** React children to render inside */
  children?: React.ReactNode
}

/**
 * Container Component
 *
 * Provides a 12-column grid layout with responsive adjustments
 * and an optional styled content wrapper.
 *
 * @example
 * ```tsx
 * <Container shouldRemoveTopMargin styles={{ backgroundWrapperContent: '#f5f5f5', height: 400 }}>
 *   <p>Page content here</p>
 * </Container>
 * ```
 */
const Container = ({
  shouldRemoveTopMargin = false,
  styles,
  children,
}: ContainerProps) => (
  <ContainerStyled shouldRemoveTopMargin={shouldRemoveTopMargin}>
    <WrapperContent styles={styles}>{children}</WrapperContent>
  </ContainerStyled>
)

export { Container }

export type { ContainerProps }
