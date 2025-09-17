import { Wrapper, Line, Title, Paragraph } from './FormText.styled'

type FormTextProps = {
  /** Main title */
  title: string
  /** Optional subtitle, can be text or ReactNode */
  subTitle?: React.ReactNode
  /** Optional custom color for subtitle */
  subTitleColor?: string
}

/**
 * FormText Component
 *
 * Displays a section with a title, an optional subtitle,
 * and a divider line.
 *
 * @example
 * ```tsx
 * <FormText
 *   title="Form Section"
 *   subTitle="This is an optional subtitle"
 *   subTitleColor="red"
 * />
 * ```
 */
const FormText = ({ title, subTitle, subTitleColor }: FormTextProps) => (
  <Wrapper>
    <Title>{title}</Title>
    {subTitle && (
      <Paragraph subtitleColor={subTitleColor}>{subTitle}</Paragraph>
    )}
    <Line />
  </Wrapper>
)

export { FormText }
export type { FormTextProps }
