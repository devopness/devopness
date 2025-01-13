import '@testing-library/jest-dom'

import { render, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ArrowHead } from './ArrowHead'

describe('ArrowHead', () => {
  describe('renders correctly', () => {
    const defaultProps = {
      fill: '#000000',
      stroke: '#FFFFFF',
    }

    it('with required props', () => {
      const { container } = render(<ArrowHead {...defaultProps} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('fill', '#000000')
      expect(svg).toHaveAttribute('stroke', '#FFFFFF')
    })

    it('with custom styles', () => {
      const customStyle = { opacity: 0.5 }
      const { container } = render(
        <ArrowHead
          {...defaultProps}
          style={customStyle}
        />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveStyle('opacity: 0.5')
    })
  })

  describe('interactions', () => {
    it('handles click events', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <ArrowHead
          fill="#000000"
          stroke="#FFFFFF"
          onClick={handleClick}
        />
      )

      const svg = container.querySelector('svg')
      if (!svg) throw new Error('SVG element not found')
      fireEvent.click(svg)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
