import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Label } from './Label'

vi.mock('styled-components', async () => ({
  ...(await vi.importActual('styled-components')),
  css: () => () => ({}),
}))

vi.mock('src/colors', () => ({
  getColor: (color: string) =>
    ({
      'slate.400': '#94a3b8',
      white: '#ffffff',
    })[color],
}))

describe('Label', () => {
  describe('renders correctly', () => {
    it('with required props', () => {
      render(
        <Label
          htmlFor="test-label"
          value="Test Label"
        />
      )
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('with optional indicator', () => {
      render(
        <Label
          htmlFor="test-label"
          value="Test Label"
          isOptional
        />
      )
      expect(screen.getByText('Test Label (Optional)')).toBeInTheDocument()
    })

    it('with help icon when helpValue provided', () => {
      const { rerender } = render(
        <Label
          htmlFor="test-label"
          value="Test Label"
        />
      )
      expect(screen.queryByLabelText('Help text')).toBeNull()

      rerender(
        <Label
          htmlFor="test-label"
          value="Test Label"
          helpValue="Help text"
        />
      )
      expect(screen.getByLabelText('Help text')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('help icon has consistent color', () => {
      render(
        <Label
          htmlFor="test-label"
          value="Test Label"
          helpValue="Help text"
        />
      )
      const svg = screen.getByLabelText('Help text').querySelector('svg')
      expect(svg).toHaveStyle('fill: #94a3b8')
      if (svg) {
        fireEvent.mouseOver(svg)
        expect(svg).toHaveStyle('fill: #94a3b8')
        fireEvent.mouseLeave(svg)
        expect(svg).toHaveStyle('fill: #94a3b8')
      }
    })
  })

  describe('accessibility', () => {
    it('help icon has aria-label', async () => {
      render(
        <Label
          htmlFor="test-label"
          value="Test Label"
          helpValue="Help text"
        />
      )
      const icon = screen.getByLabelText('Help text')
      expect(icon).toHaveAttribute('aria-label', 'Help text')
      await userEvent.hover(icon)
      expect(icon).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('composition', () => {
    it('has correct flex layout', () => {
      render(
        <Label
          htmlFor="test-label"
          value="Test Label"
        />
      )
      const container = screen.getByText('Test Label').parentElement
      expect(container).toHaveStyle('display: flex')
      expect(container).toHaveStyle('align-items: flex-end')
    })
  })
})
