import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { Popover } from './Popover'

describe('Popover', () => {
  it('renders with title, content and footer', () => {
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
    expect(screen.getByTestId('popover-content')).toBeInTheDocument()
    expect(screen.getByTestId('popover-content')).toHaveTextContent(
      'Popover Body'
    )
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('preserves embedded iframe content inside a flex body container', () => {
    render(
      <Popover
        open
        anchorEl={document.body}
        title="Test Title"
      >
        <iframe
          title="Embedded content"
          src="https://example.com"
        />
      </Popover>
    )

    const content = screen.getByTestId('popover-content')
    const iframe = screen.getByTitle('Embedded content')

    expect(content).toBeInTheDocument()
    expect(content).toContainElement(iframe)
    expect(content).toHaveStyle({
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      minHeight: '0',
    })
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

    expect(screen.getByTestId('popover-content')).toHaveTextContent(
      'Popover Body'
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
