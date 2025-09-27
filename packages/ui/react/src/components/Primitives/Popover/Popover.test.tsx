import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { Popover } from './Popover'

describe('Popover', () => {
  it('renders with title and footer', () => {
    render(
      <Popover
        open
        anchorEl={document.body}
        title="Test Title"
        footer={<div>Footer Content</div>}
      >
        <div>Popover Body</div>
      </Popover>
    )

    expect(screen.getByTestId('popover-header')).toBeInTheDocument()
    expect(screen.getByTestId('popover-title')).toHaveTextContent('Test Title')
    expect(screen.getByText('Popover Body')).toBeInTheDocument()
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('renders without footer', () => {
    render(
      <Popover
        open
        anchorEl={document.body}
        title="Test Title"
      >
        <div>Popover Body</div>
      </Popover>
    )

    expect(screen.queryByText('Footer Content')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Popover
        open
        anchorEl={document.body}
        title="Test Title"
        onClose={handleClose}
      >
        <div>Popover Body</div>
      </Popover>
    )

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalled()
  })
})
