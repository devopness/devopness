import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { PopoverPopupState } from './PopoverPopupState'
import { iconLoader } from 'src/icons'

describe('PopoverPopupState', () => {
  it('renders the trigger correctly', () => {
    render(
      <PopoverPopupState trigger={iconLoader('more', 20)}>
        <div>Popover Content</div>
      </PopoverPopupState>
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows popover content when trigger is clicked', () => {
    render(
      <PopoverPopupState trigger={iconLoader('more', 20)}>
        <div>Popover Content</div>
      </PopoverPopupState>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Popover Content')).toBeInTheDocument()
  })
})
