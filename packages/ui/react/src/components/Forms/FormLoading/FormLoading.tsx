import {
  Container,
  WrapperTitle,
  WrapperParagraph,
  Line,
  WrapperButton,
} from './FormLoading.styled'
import { Skeleton } from 'src/components/Primitives'

type FormLoadingProps = {
  /** Optional aria-label for accessibility */
  ariaLabel?: string
}

/**
 * FormLoading
 *
 * Displays a structured skeleton UI for forms.
 * Includes placeholders for title, paragraphs, a separator line, and buttons.
 *
 * @example
 * ```tsx
 * <FormLoading ariaLabel="Loading form data" />
 * ```
 */
const FormLoading = ({ ariaLabel }: FormLoadingProps) => (
  <Container
    aria-label={ariaLabel}
    role="region"
  >
    <WrapperTitle>
      <Skeleton
        width={290}
        height={18}
        borderRadius={2}
      />
    </WrapperTitle>
    <WrapperParagraph>
      <Skeleton
        width={240}
        height={12}
        borderRadius={2}
      />
      <Skeleton
        width={200}
        height={12}
        borderRadius={2}
      />
    </WrapperParagraph>
    <Line />
    <WrapperButton>
      <Skeleton
        width={84}
        height={34}
        borderRadius={20}
      />
      <Skeleton
        width={84}
        height={34}
        borderRadius={20}
      />
    </WrapperButton>
  </Container>
)

export { FormLoading }
export type { FormLoadingProps }
