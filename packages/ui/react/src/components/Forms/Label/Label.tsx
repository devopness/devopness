import React from 'react'

import { Tooltip } from '../../Primitives'
import { LabelElement, ContentFlex, QuestionIcon } from './Label.styled'
import { getColor } from 'src/colors'

type LabelProps = {
  /** Main label text/node */
  value: React.ReactNode
  /** Help text shown in tooltip */
  helpValue?: string
  /** ARIA role */
  role?: string
  /** Adds "(Optional)" text */
  isOptional?: boolean
}

/**
 * Label component with optional help tooltip
 *
 * @example
 * ```jsx
 * // Basic label
 * <Label value="Username" />
 *
 * // Label with help text and optional marker
 * <Label
 *   value="Email Address"
 *   helpValue="We'll send a verification code"
 *   isOptional
 * />
 * ```
 */
const Label = ({ value, helpValue, role, isOptional = false }: LabelProps) => (
  <ContentFlex role={role}>
    <LabelElement className="translate">
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
        <QuestionIcon />
      </Tooltip>
    )}
  </ContentFlex>
)

export type { LabelProps }
export { Label }
