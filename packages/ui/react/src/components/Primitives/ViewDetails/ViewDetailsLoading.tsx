import { Skeleton } from '../Skeleton'
import { LoadingContainer, Section, Row } from './ViewDetails.styled'

/**
 * A component that renders a structured skeleton UI for the ViewDetails component.
 *
 * Includes placeholders for title, paragraphs, a separator line, and buttons.
 *
 * @example
 * <ViewDetailsLoading ariaLabel="loading" />
 */
const ViewDetailsLoading = () => (
  <LoadingContainer aria-label="loading">
    <Section>
      <Row>
        <Skeleton
          width={240}
          height={20}
          borderRadius={2}
        />
      </Row>
      <Row>
        <Skeleton
          width={260}
          height={12}
          borderRadius={2}
        />
      </Row>
      <Row>
        <Skeleton
          width={260}
          height={12}
          borderRadius={2}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <Skeleton
          width={240}
          height={20}
          borderRadius={2}
        />
      </Row>
      <Row>
        <Skeleton
          width={260}
          height={12}
          borderRadius={2}
        />
      </Row>
      <Row>
        <Skeleton
          width={260}
          height={12}
          borderRadius={2}
        />
      </Row>
    </Section>
  </LoadingContainer>
)

export { ViewDetailsLoading }
