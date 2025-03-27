// src/components/Forms/Input/Input.test.tsx
import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Input } from '.'

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
          labelProps={{
            value: 'Username',
          }}
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
          publicStyle={{
            fontStyleValue: 'bold',
            fontStylePlaceholder: 'italic',
          }}
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveStyle({
        'font-style': 'bold',
      })
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

    it('focuses input on error', () => {
      const { rerender } = render(
        <Input
          type="text"
        />
      )

      const input = screen.getByRole('textbox')
      expect(document.activeElement).not.toBe(input)

      rerender(
        <Input
          type="text"
          error={{ message: 'Error occurred' }}
        />
      )

      expect(document.activeElement).toBe(input)
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      
      render(
        <Input
          type="text"
          ref={ref}
        />
      )

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })
})