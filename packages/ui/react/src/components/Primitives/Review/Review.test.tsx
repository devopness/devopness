import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Review } from '.'

describe('Review', () => {
  it('renders default content', () => {
    render(<Review content="Status: Pending" />)
    expect(screen.getByText('Status: Pending')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(
      <Review
        content="Status"
        icon="check"
      />
    )
    const iconElement = screen.getByRole('img')
    expect(iconElement).toBeInTheDocument()
  })

  it('renders with prefix', () => {
    render(
      <Review
        content="Status"
        prefix="Info"
      />
    )
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('renders icon after label when isIconAfterLabel is true', () => {
    render(
      <Review
        content="Status: Approved"
        icon="check"
        isIconAfterLabel
      />
    )
    const iconElement = screen.getByRole('img')
    expect(iconElement).toBeInTheDocument()
  })

  it('renders value content split after colon when isIconAfterLabel', () => {
    render(
      <Review
        content="Status: Approved"
        isIconAfterLabel
      />
    )
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('applies bold font weight when isBoldFontWeight is true', () => {
    render(
      <Review
        content="Score: 85%"
        isBoldFontWeight
      />
    )
    const value = screen.getByText('Score: 85%')
    expect(value).toHaveStyle('font-weight: bold')
  })

  it('applies custom background color', () => {
    render(
      <Review
        content="Status: Pending"
        backgroundColor="red"
      />
    )
    const container = screen.getByText('Status: Pending').closest('article')
    expect(container).toHaveStyle('background-color: rgb(255, 0, 0)')
  })

  it('renders JSX content correctly', () => {
    render(
      <Review content={<span data-testid="jsx-content">Custom JSX</span>} />
    )
    expect(screen.getByTestId('jsx-content')).toBeInTheDocument()
  })

  it('prefix applies margin when hasPrefixMargin is true', () => {
    render(
      <Review
        content="Status"
        prefix="Info"
        hasPrefixMargin={true}
      />
    )
    const prefixElement = screen.getByText('Info').parentElement
    expect(prefixElement).toHaveStyle('margin-right: 5px')
  })

  it('renders correctly without icon', () => {
    render(<Review content="No Icon" />)
    const container = screen.getByText('No Icon').closest('article')
    expect(container).toBeInTheDocument()
  })
})
