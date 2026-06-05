import { render, screen, fireEvent } from '@testing-library/react'

import { describe, it, expect, vi, beforeEach } from 'vitest'

import { PermissionCheckboxChip } from './PermissionCheckboxChip'

describe('PermissionCheckboxChip', () => {
  const defaultProps = {
    label: 'View',
    isChecked: false,
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<PermissionCheckboxChip {...defaultProps} />)
    expect(screen.getByRole('checkbox', { name: 'View' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'false'
    )
  })

  it('renders in checked state', () => {
    render(
      <PermissionCheckboxChip
        {...defaultProps}
        isChecked={true}
      />
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange when clicked', () => {
    render(<PermissionCheckboxChip {...defaultProps} />)
    const chip = screen.getByRole('checkbox')
    fireEvent.click(chip)
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
    expect(defaultProps.onChange).toHaveBeenCalledWith(true)
  })

  it('does not call onChange when disabled', () => {
    render(
      <PermissionCheckboxChip
        {...defaultProps}
        disabled={true}
      />
    )
    const chip = screen.getByRole('checkbox')
    fireEvent.click(chip)
    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })

  it('renders with error styling when hasError is true', () => {
    render(
      <PermissionCheckboxChip
        {...defaultProps}
        hasError={true}
      />
    )
    const chip = screen.getByRole('checkbox')
    expect(chip).toBeInTheDocument()
  })

  it('toggles when Space is pressed', () => {
    render(<PermissionCheckboxChip {...defaultProps} />)
    const chip = screen.getByRole('checkbox')
    fireEvent.keyDown(chip, { key: ' ' })
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
    expect(defaultProps.onChange).toHaveBeenCalledWith(true)
  })

  it('does not toggle on Space when disabled', () => {
    render(
      <PermissionCheckboxChip
        {...defaultProps}
        disabled={true}
      />
    )
    const chip = screen.getByRole('checkbox')
    fireEvent.keyDown(chip, { key: ' ' })
    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })

  it('exposes tabIndex 0 when interactive', () => {
    render(<PermissionCheckboxChip {...defaultProps} />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('tabindex', '0')
  })

  it('exposes tabIndex -1 when disabled', () => {
    render(
      <PermissionCheckboxChip
        {...defaultProps}
        disabled={true}
      />
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('tabindex', '-1')
  })
})
