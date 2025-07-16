import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Loader } from '.'
import { getColor } from 'src/colors'

describe('Loader', () => {
  it('renders the default loader (page variant)', () => {
    render(<Loader />)

    const textElement = screen.getByText('Loading...')
    expect(textElement).toBeInTheDocument()
  })

  it('renders loader with custom text', () => {
    render(
      <Loader
        variant="circle"
        text="Please wait..."
      />
    )

    const textElement = screen.getByText('Please wait...')
    expect(textElement).toBeInTheDocument()
  })

  it('renders bar variant correctly', () => {
    render(
      <Loader
        variant="bar"
        text="Loading bar..."
      />
    )

    const textElement = screen.getByText('Loading bar...')
    expect(textElement).toBeInTheDocument()
  })

  it('renders circle variant with color', () => {
    render(
      <Loader
        variant="circle"
        color={getColor('purple.800')}
        text="Loading circle..."
      />
    )

    const textElement = screen.getByText('Loading circle...')
    expect(textElement).toBeInTheDocument()
  })

  it('renders ring variant with no text', () => {
    render(<Loader variant="ring" />)

    const maybeText = screen.queryByText('Loading...')
    expect(maybeText).not.toBeInTheDocument()
  })

  it('respects paddingTop prop', () => {
    render(
      <Loader
        variant="circle"
        text="Padding top test"
        paddingTop="50px"
      />
    )

    const textElement = screen.getByText('Padding top test')
    expect(textElement).toBeInTheDocument()

    const container = textElement.closest('div')
    expect(container).toHaveStyle('padding-top: 50px')
  })

  it('aligns loader to the left when alignLeft is true', () => {
    render(
      <Loader
        variant="bar"
        text="Align left test"
        isAlignLeft
      />
    )

    const textElement = screen.getByText('Align left test')
    const container = textElement.closest('div')
    expect(container).toHaveStyle('justify-content: flex-start')
  })
})
