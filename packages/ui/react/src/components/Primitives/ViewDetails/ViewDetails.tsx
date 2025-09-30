import { ComponentPropsWithoutRef } from 'react'

import {
  Container,
  DetailViewSection,
  LineWrapper,
  Title,
} from './ViewDetails.styled'
import type { DetailsContentProps } from './ViewDetailsContent'
import { ViewDetailsContent } from './ViewDetailsContent'

/**
 * Props for the `ViewDetails` component.
 */
type ViewDetailsProps = {
  /** Array of sections, each containing a label and items */
  data: {
    label: string | undefined
    items: Exclude<DetailsContentProps, 'navigationComponent'>[]
  }[]

  navigationComponent: DetailsContentProps['navigationComponent']
}

type DetailsDataProps = ComponentPropsWithoutRef<
  typeof ViewDetails
>['data'][number]

/**
 * Component to display multiple sections with details.
 *
 * @example
 * ```tsx
 * <ViewDetails data={[
 *   { label: 'User Info', items: [{ label: 'Name', value: 'John', navigationComponent: NavigationLink }] }
 * ]} />
 * ```
 */
const ViewDetails = ({ data, navigationComponent }: ViewDetailsProps) => (
  <Container>
    {data.map((section) => (
      <DetailViewSection
        key={
          section.label ??
          `details_undefined_section_${String(section.items.length)}_items`
        }
      >
        {section.label && (
          <>
            <LineWrapper>
              <Title className="translate">{section.label}</Title>
            </LineWrapper>
            <div
              style={{
                padding: '1rem 0',
              }}
            />
          </>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {section.items.map((item) => (
            <LineWrapper
              key={`row${item.label ?? ''}`}
              className="translate"
            >
              <ViewDetailsContent
                navigationComponent={navigationComponent}
                {...item}
              />
            </LineWrapper>
          ))}
        </div>
      </DetailViewSection>
    ))}
  </Container>
)

export { ViewDetails }
export type { DetailsDataProps }
