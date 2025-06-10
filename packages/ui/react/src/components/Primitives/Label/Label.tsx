import React from 'react'

import { LabelElement, ContentFlex, QuestionIcon } from './Label.styled'
import { getColor } from 'src/colors'
import { Tooltip } from 'src/components/Primitives'

type LabelProps = {
  /** HTML element type for the label */
  htmlFor?: string
  /** Main label text/node */
  value: React.ReactNode
  /** Help text shown in tooltip */
  helpValue?: string
  /**
   * Indicates that the field is optional
   * @default false
   */
  isOptional?: boolean
}

/**
 * A caption for an item in the UI, usually associated with a form control
 *
 * @example
 * ```jsx
 * // Basic label
 * <Label value="Username" />
 *
 * // Label with help text and optional marker
 * <Label
 *   value="Description"
 *   helpValue="A description of the item"
 *   isOptional
 * />
 * ```
 */
const Label = ({
  value,
  helpValue,
  isOptional = false,
  htmlFor,
}: LabelProps) => (
  <ContentFlex>
    <LabelElement
      htmlFor={htmlFor}
      className="translate"
    >
      {value}
      {isOptional ? ' (Optional)' : ''}
    </LabelElement>
    {helpValue && (
      <Tooltip
        title={helpValue}
        placement="right-start"
        styles={{
          color: getColor('white'),
        }}
        style={{
          height: '16px',
        }}
      >
        <QuestionIcon
          role="img"
          aria-label="Help"
        />
      </Tooltip>
    )}
  </ContentFlex>
)

export type { LabelProps }
export { Label }
