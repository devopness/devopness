import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Label } from './Label'

vi.mock('src/colors', () => ({
  getColor: (color: string) =>
    ({
      'slate.400': '#94a3b8',
      'blue.800': '#1e40af',
      'blue.950': '#172554',
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
    it('help icon renders with proper styling attributes', () => {
      render(
        <Label
          htmlFor="test-label"
          value="Test Label"
          helpValue="Help text"
        />
      )
      const icon = screen.getByLabelText('Help text')
      const svg = icon.querySelector('svg')

      // Verify SVG icon is rendered
      expect(svg).toBeInTheDocument()

      // Verify it has proper dimensions
      expect(svg).toHaveStyle({ width: '13px', height: '13px' })

      // Verify it has cursor pointer for interactivity
      expect(svg).toHaveStyle({ cursor: 'pointer' })
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
