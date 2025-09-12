import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { CheckBox } from './Checkbox'

describe('CheckBox', () => {
  it('renders checkbox correctly', () => {
    render(<CheckBox isChecked={true} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect((checkbox as HTMLInputElement).checked).toBe(true)
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<CheckBox onClick={handleClick} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders disabled checkbox correctly', () => {
    render(<CheckBox disabled />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })
})
