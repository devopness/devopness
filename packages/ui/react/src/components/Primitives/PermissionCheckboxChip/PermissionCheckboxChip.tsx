import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Chip from '@mui/material/Chip'

import { Tooltip } from '../Tooltip'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

export type PermissionCheckboxChipProps = {
  /** The human-readable label or permission name to display */
  label: string
  /** Whether the permission is currently selected */
  isChecked: boolean
  /** Callback fired when the chip is clicked */
  onChange: (isChecked: boolean) => void
  /** Optional hint text to display in a tooltip on hover */
  hint?: string
  /** Whether the component has a validation error (e.g. required but unselected) */
  hasError?: boolean
  /** Whether the component is disabled */
  disabled?: boolean
}

/**
 * An interactive, selectable chip component used for toggling permissions.
 * Follows ATOMIC design principles for reusability across forms.
 */
export const PermissionCheckboxChip = ({
  label,
  isChecked,
  onChange,
  hint,
  hasError = false,
  disabled = false,
}: PermissionCheckboxChipProps) => {
  const handleClick = () => {
    if (disabled) return
    onChange(!isChecked)
  }

  // Determine styling based on state
  let backgroundColor: string = isChecked
    ? getColor('green.100')
    : getColor('stone.50')
  let textColor: string = isChecked
    ? getColor('green.800')
    : getColor('slate.600')
  let borderColor: string = isChecked
    ? getColor('green.300')
    : getColor('slate.300')
  let iconColor: string = isChecked
    ? getColor('green.600')
    : getColor('slate.400')

  if (hasError) {
    backgroundColor = getColor('red.50')
    textColor = getColor('red.500')
    borderColor = getColor('red.400')
    iconColor = getColor('red.500')
  }

  const chipElement = (
    <Chip
      role="checkbox"
      aria-checked={isChecked}
      label={label}
      size="small"
      onClick={handleClick}
      disabled={disabled}
      icon={
        isChecked ? (
          <CheckCircleIcon style={{ color: iconColor, fontSize: '16px' }} />
        ) : (
          <RadioButtonUncheckedIcon
            style={{ color: iconColor, fontSize: '16px' }}
          />
        )
      }
      sx={{
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        fontFamily: getFont('roboto'),
        fontWeight: isChecked ? 500 : 400,
        borderRadius: '20px',
        fontSize: '13px',
        height: '28px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        '& .MuiChip-label': {
          padding: '4px 12px 4px 6px', // adjust left padding to accommodate the icon
        },
        '& .MuiChip-icon': {
          marginLeft: '8px',
        },
        '&:hover': {
          backgroundColor: isChecked
            ? getColor('green.200')
            : getColor('stone.100'),
          ...(hasError && { backgroundColor: getColor('red.100') }),
        },
        '&.Mui-disabled': {
          opacity: 0.6,
        },
      }}
    />
  )

  if (hint && !disabled) {
    return <Tooltip title={hint}>{chipElement}</Tooltip>
  }

  return chipElement
}
