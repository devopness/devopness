import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorBanner } from './ErrorBanner'

describe('ErrorBanner', () => {
  it('renders title and description', () => {
    render(
      <ErrorBanner
        title="Test Error"
        description="This is a test error description"
      />
    )

    expect(screen.getByText('Test Error')).toBeInTheDocument()
    expect(
      screen.getByText('This is a test error description')
    ).toBeInTheDocument()
  })

  it('renders error detail when provided', () => {
    render(
      <ErrorBanner
        title="Test Error"
        description="Description"
        errorDetail="Additional error details"
      />
    )

    expect(
      screen.getByText(/Details: Additional error details/)
    ).toBeInTheDocument()
  })

  it('does not render error detail when not provided', () => {
    render(
      <ErrorBanner
        title="Test Error"
        description="Description"
      />
    )

    expect(screen.queryByText(/Details:/)).not.toBeInTheDocument()
  })

  it('renders action link when provided', () => {
    render(
      <ErrorBanner
        title="Test Error"
        description="Description"
        action={{ label: 'Retry', href: '/retry' }}
      />
    )

    const link = screen.getByText('Retry')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/retry')
  })

  it('does not render action link when not provided', () => {
    render(
      <ErrorBanner
        title="Test Error"
        description="Description"
      />
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
