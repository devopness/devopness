import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Input } from './Input'

describe('Input', () => {
  describe('renders correctly', () => {
    it('with required props', () => {
      render(
        <Input
          type="text"
          placeholder="Enter text"
        />
      )
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('with label', () => {
      render(
        <Input
          type="text"
          labelProps={{ value: 'Username' }}
        />
      )
      const label = screen.getByText('Username')
      expect(label).toBeInTheDocument()
    })

    it('with error message', () => {
      render(
        <Input
          type="text"
          error={{ message: 'This field is required' }}
        />
      )
      const errorMessage = screen.getByText('This field is required')
      expect(errorMessage).toBeInTheDocument()
    })

    it('with custom styles', () => {
      render(
        <Input
          type="text"
          publicStyle={{ fontStyleValue: 'bold' }}
        />
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveStyle({ 'font-style': 'bold' })
    })

    it('with number type and removed arrows', () => {
      render(
        <Input
          type="number"
          removeArrows
        />
      )
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('focus behavior on error', () => {
    it('without autoFocusOnError should not focus when error prop changes', () => {
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
      expect(input).not.toHaveFocus()
    })

    it('with autoFocusOnError should focus when error prop changes', () => {
      const { rerender } = render(
        <Input
          type="text"
          autoFocusOnError
          data-testid="test-input"
        />
      )
      const input = screen.getByTestId('test-input')
      expect(input).not.toHaveFocus()
      rerender(
        <Input
          type="text"
          autoFocusOnError
          error={{ message: 'New error' }}
          data-testid="test-input"
        />
      )
      expect(input).toHaveFocus()
    })
  })

  describe('interactions', () => {
    it('handles input changes', () => {
      const handleChange = vi.fn()
      render(
        <Input
          type="text"
          onChange={handleChange}
        />
      )
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test' } })
      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue('test')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(
        <Input
          type="text"
          ref={ref}
          data-testid="test-input"
        />
      )
      const input = screen.getByTestId('test-input')
      expect(ref.current).toBe(input)
    })
  })
})
