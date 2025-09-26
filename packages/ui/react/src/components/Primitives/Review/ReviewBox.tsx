import { ReactNode } from 'react'

import { ContentDetail } from './Review.styled'

/**
 * Props for the `ReviewBox` component.
 */
type ReviewBoxProps = {
  /** Child `Review` components to be displayed inside this container */
  children: ReactNode
  /** The type of the review box, which affects its background color */
  type?: 'default' | 'warning'
}

/**
 * A container component for displaying a group of `Review` components.
 *
 * Pass any number of `Review` components as children to this component.
 *
 * @example
 * <ReviewBox type="default">
 *   <Review content="Status: Approved" icon="check" prefix="Info" />
 *   <Review content="Score: 85%" icon="star" isIconAfterLabel />
 * </ReviewBox>
 */
const ReviewBox = ({ children, type }: ReviewBoxProps) => (
  <ContentDetail type={type}>{children}</ContentDetail>
)

export type { ReviewBoxProps }
export { ReviewBox }
