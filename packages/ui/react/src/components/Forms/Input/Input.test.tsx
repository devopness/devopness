import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input } from './Input'

describe('Input', () => {
  describe('focus behavior on error', () => {
    it('should focus input when error prop is present', () => {
      render(
        <Input
          type="text"
          error={{ message: 'Test error' }}
          data-testid="test-input"
        />
      )

      const input = screen.getByTestId('test-input')
      expect(input).toHaveFocus()
    })

    it('should not focus input when no error is present', () => {
      render(
        <Input
          type="text"
          data-testid="test-input"
        />
      )

      const input = screen.getByTestId('test-input')
      expect(input).not.toHaveFocus()
    })

    it('should focus when error prop changes', () => {
      const { rerender } = render(
        <Input
          type="text"
          data-testid="test-input"
        />
      )

      const input = screen.getByTestId('test-input')
      expect(input).not.toHaveFocus()

      rerender(
        <Input
          type="text"
          error={{ message: 'New error' }}
          data-testid="test-input"
        />
      )

      expect(input).toHaveFocus()
    })

    it('should maintain focus behavior when using a custom ref', () => {
      const ref = { current: null }
      render(
        <Input
          type="text"
          ref={ref}
          error={{ message: 'Test error' }}
          data-testid="test-input"
        />
      )

      const input = screen.getByTestId('test-input')
      expect(input).toHaveFocus()
      expect(ref.current).toBe(input)
    })
  })
})
