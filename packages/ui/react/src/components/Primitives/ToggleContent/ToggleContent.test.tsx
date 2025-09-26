import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { ToggleContent } from './ToggleContent'

describe('ToggleContent', () => {
  it('renders hidden content placeholder by default for sensitive content', () => {
    render(
      <ToggleContent
        isSensitiveContent
        hiddenContentPlaceholder="****"
      >
        Secret
      </ToggleContent>
    )
    expect(screen.getByText('****')).toBeInTheDocument()
  })

  it('shows content after toggle click', () => {
    render(
      <ToggleContent isSensitiveContent>
        <span>Secret</span>
      </ToggleContent>
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Secret')).toBeInTheDocument()
  })

  it('shows warning when showWarning is true', () => {
    render(
      <ToggleContent
        isSensitiveContent
        showWarning
      >
        Secret
      </ToggleContent>
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText(/WARNING:/)).toBeInTheDocument()
  })

  it('renders non-sensitive content directly', () => {
    render(<ToggleContent>Public</ToggleContent>)
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('hides placeholder when showHiddenContentPlaceholder is false', () => {
    render(
      <ToggleContent
        isSensitiveContent
        showHiddenContentPlaceholder={false}
      >
        Secret
      </ToggleContent>
    )
    expect(screen.queryByText('*****')).not.toBeInTheDocument()
  })
})
