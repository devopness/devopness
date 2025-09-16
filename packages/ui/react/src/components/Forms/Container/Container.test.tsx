import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Container } from './Container'

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <p>Test Content</p>
      </Container>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should have top margin by default', () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    )
    expect(container.firstChild).toHaveStyle('margin-top: 42px')
  })

  it('removes top margin when shouldRemoveTopMargin is true', () => {
    const { container } = render(
      <Container shouldRemoveTopMargin>
        <p>Content</p>
      </Container>
    )
    expect(container.firstChild).toHaveStyle('margin-top: 0px')
  })

  it('applies background color and height styles correctly', () => {
    const { getByText } = render(
      <Container styles={{ backgroundWrapperContent: 'red', height: 200 }}>
        <p>Styled Content</p>
      </Container>
    )
    const wrapper = getByText('Styled Content').parentElement
    expect(wrapper).toHaveStyle('background: red')
    expect(wrapper).toHaveStyle('height: 200px')
  })
})
