import { memo } from 'react'

import type { CheckboxProps } from '@mui/material/Checkbox'
import CheckboxBase from '@mui/material/Checkbox'

import { getColor } from 'src/colors'

type CheckBoxProps = {
  /** Controls if the checkbox is checked or not */
  isChecked?: boolean
  /** Controls if the checkbox has a stroke */
  isStroke?: boolean
  /** Controls if the checkbox has an hasError */
  hasError?: boolean | null
  /** Controls if the checkbox is controlled */
  isControlled?: boolean
  /** Controls the size of the checkbox */
  size?: 'small' | 'medium'
} & CheckboxProps

/**
 * A customizable checkbox component.
 *
 * @example
 * ```jsx
 * <CheckBox
 *   isChecked={true}
 *   isStroke={true}
 *   disabled={false}
 *   size="medium"
 *   hasError={false}
 *   isControlled={true}
 * />
 * ```
 */
const CheckBox = ({
  isChecked = false,
  isStroke = false,
  disabled = false,
  size = 'medium',
  hasError = null,
  isControlled = true,
  ref,
  ...restProps
}: CheckBoxProps) => {
  const color = disabled
    ? getColor('purple.800')
    : getColor(!hasError ? 'purple.800' : 'red.500')
  const background = hasError ? getColor('red.150') : 'transparent'
  const hover = hasError ? 'transparent' : getColor('indigo.100')

  const checkboxSx = {
    color: color,
    '& .MuiSvgIcon-root': {
      color: color,
    },
    '&.Mui-checked': {
      color: color,
      '& .MuiSvgIcon-root': {
        color: color,
      },
      '&:hover': {
        backgroundColor: hover,
      },
    },
    '&:hover': {
      backgroundColor: hover,
    },
    '&:not(.Mui-checked) .MuiIconButton-label:after': {
      content: '""',
      height: 15,
      width: 15,
      position: 'absolute',
      backgroundColor: background,
      zIndex: -1,
    },
  }

  if (!isControlled) {
    return (
      <CheckboxBase
        ref={ref}
        sx={checkboxSx}
        {...restProps}
      />
    )
  }

  return (
    <CheckboxBase
      size={size}
      checked={isChecked}
      indeterminate={isStroke && isChecked}
      disabled={disabled}
      sx={checkboxSx}
      {...restProps}
    />
  )
}

const CheckBoxMemo = memo(CheckBox)
export { CheckBoxMemo as CheckBox }
export type { CheckBoxProps }
