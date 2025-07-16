import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Text } from '.'

describe('Text', () => {
  it('renders correctly with children', () => {
    render(<Text className="">Sample text</Text>)

    const expectedText = screen.getByText('Sample text')
    expect(expectedText).toBeInTheDocument()
  })

  it('renders with a specific variant', () => {
    render(
      <Text
        className=""
        variant="h4"
      >
        Heading text
      </Text>
    )

    const heading = screen.getByText('Heading text')
    expect(heading.tagName.toLowerCase()).toBe('h4')
  })

  it('falls back to default Typography element when variant is "span"', () => {
    render(
      <Text
        className=""
        variant="span"
      >
        Span text
      </Text>
    )

    const span = screen.getByText('Span text')
    expect(span).toBeInTheDocument()
    expect(span.tagName.toLowerCase()).toBe('p')
  })

  it('applies small style when small prop is true', () => {
    render(
      <Text
        className=""
        isSmall
      >
        Small text
      </Text>
    )

    const text = screen.getByText('Small text')
    expect(text).toHaveStyle('font-size: 0.8em')
  })
})
