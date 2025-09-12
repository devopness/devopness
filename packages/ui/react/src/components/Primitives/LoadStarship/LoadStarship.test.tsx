import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { LoadStarship } from './LoadStarship'

describe('LoadStarship', () => {
  it('renders the starship GIF', () => {
    render(<LoadStarship />)
    const gif = screen.getByAltText(
      /this is an animated gif image of the devopness starship/i
    )
    expect(gif).toBeInTheDocument()
  })

  it('applies fullContainer style when prop is true', () => {
    const { container } = render(<LoadStarship isFullContainer />)
    expect(container.firstChild).toHaveStyle('position: fixed')
  })

  it('applies page loading style when fullContainer is false', () => {
    const { container } = render(<LoadStarship />)
    expect(container.firstChild).toHaveStyle(
      'height: calc(100vh - (105px + 42px))'
    )
  })
})
