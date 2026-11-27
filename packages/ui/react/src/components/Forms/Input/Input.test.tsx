import '@testing-library/jest-dom'
import { MdOutlineEmail } from 'react-icons/md'

import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
          labelProps={{ htmlFor: 'username', value: 'Username' }}
        />
      )
      const input = screen.getByLabelText('Username')
      expect(input).toBeInTheDocument()
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

    it('with autocomplete off by default', () => {
      render(
        <Input
          type="text"
          data-testid="autocomplete-input"
        />
      )
      const input = screen.getByTestId('autocomplete-input')
      expect(input).toHaveAttribute('autocomplete', 'off')
    })

    it('allows overriding autocomplete via props', () => {
      render(
        <Input
          type="text"
          autoComplete="email"
          data-testid="autocomplete-override"
        />
      )
      const input = screen.getByTestId('autocomplete-override')
      expect(input).toHaveAttribute('autocomplete', 'email')
    })

    it('allows overriding autocomplete via inputProps', () => {
      render(
        <Input
          type="text"
          inputProps={{ autoComplete: 'username' }}
          data-testid="autocomplete-inputprops"
        />
      )
      const input = screen.getByTestId('autocomplete-inputprops')
      expect(input).toHaveAttribute('autocomplete', 'username')
    })

    it('with custom styles', () => {
      render(
        <Input
          type="text"
          publicStyle={{ fontStyleValue: 'italic' }}
        />
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveStyle({ 'font-style': 'italic' })
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
    it('does not allow editing when read-only', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(
        <Input
          type="text"
          defaultValue="initial"
          readOnly
          onChange={handleChange}
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readonly')

      await user.type(input, ' edited')

      expect(input).toHaveValue('initial')
      expect(handleChange).not.toHaveBeenCalled()
    })

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

  describe('password visibility toggle', () => {
    const renderPasswordInput = () => {
      render(
        <Input
          type="password"
          data-testid="password-input"
        />
      )

      return {
        input: screen.getByTestId('password-input') as HTMLInputElement,
        toggle: screen.getByRole('button', { name: 'Show password' }),
      }
    }

    it('toggles visibility with Enter', () => {
      const { input, toggle } = renderPasswordInput()

      toggle.focus()
      expect(toggle).toHaveFocus()

      fireEvent.keyDown(toggle, { key: 'Enter' })

      expect(input).toHaveAttribute('type', 'text')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
      expect(toggle).toHaveAttribute('aria-label', 'Hide password')
    })

    it('toggles visibility with Space and toggles back on subsequent Space', () => {
      const { input, toggle } = renderPasswordInput()

      fireEvent.keyDown(toggle, { key: ' ' })

      expect(input).toHaveAttribute('type', 'text')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
      expect(toggle).toHaveAttribute('aria-label', 'Hide password')

      fireEvent.keyDown(toggle, { key: ' ' })

      expect(input).toHaveAttribute('type', 'password')
      expect(toggle).toHaveAttribute('aria-pressed', 'false')
      expect(toggle).toHaveAttribute('aria-label', 'Show password')
    })

    it('does not toggle visibility with unrelated keys', () => {
      const { input, toggle } = renderPasswordInput()

      fireEvent.keyDown(toggle, { key: 'Escape' })
      fireEvent.keyDown(toggle, { key: 'Tab' })
      fireEvent.keyDown(toggle, { key: 'a' })

      expect(input).toHaveAttribute('type', 'password')
      expect(toggle).toHaveAttribute('aria-pressed', 'false')
      expect(toggle).toHaveAttribute('aria-label', 'Show password')
    })

    it('keeps toggling visibility with mouse clicks', () => {
      const { input, toggle } = renderPasswordInput()

      fireEvent.click(toggle)

      expect(input).toHaveAttribute('type', 'text')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
      expect(toggle).toHaveAttribute('aria-label', 'Hide password')

      fireEvent.click(toggle)

      expect(input).toHaveAttribute('type', 'password')
      expect(toggle).toHaveAttribute('aria-pressed', 'false')
      expect(toggle).toHaveAttribute('aria-label', 'Show password')
    })

    it('supports realistic keyboard interaction with userEvent', async () => {
      const user = userEvent.setup()
      const { input, toggle } = renderPasswordInput()

      toggle.focus()
      await user.keyboard('{Enter}')

      expect(input).toHaveAttribute('type', 'text')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
      expect(toggle).toHaveAttribute('aria-label', 'Hide password')

      await user.keyboard(' ')

      expect(input).toHaveAttribute('type', 'password')
      expect(toggle).toHaveAttribute('aria-pressed', 'false')
      expect(toggle).toHaveAttribute('aria-label', 'Show password')
    })
  })

  describe('accessibility', () => {
    it('has appropriate ARIA attributes when there is an error', () => {
      render(
        <Input
          type="text"
          error={{ message: 'Required field' }}
          data-testid="input-with-error"
        />
      )

      const input = screen.getByTestId('input-with-error')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-errormessage')
      expect(input).toHaveAttribute('aria-describedby')

      const errorId = input.getAttribute('aria-errormessage')
      const errorMessage = errorId ? document.getElementById(errorId) : null
      if (!errorMessage) {
        throw new Error('Error message element not found')
      }
      expect(errorMessage).toHaveTextContent('Required field')
    })

    it('associates label correctly with input using htmlFor', () => {
      render(
        <Input
          type="text"
          labelProps={{ htmlFor: 'user-name', value: 'Username' }}
        />
      )

      const input = screen.getByLabelText('Username')
      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
    })

    it('can be navigated and operated with keyboard', () => {
      const handleChange = vi.fn()
      render(
        <Input
          type="text"
          onChange={handleChange}
          placeholder="Enter your text"
        />
      )

      const input = screen.getByPlaceholderText('Enter your text')
      input.focus()
      expect(input).toHaveFocus()

      fireEvent.keyDown(input, { key: 'A', code: 'KeyA' })
      fireEvent.keyPress(input, { key: 'A', code: 'KeyA' })
      fireEvent.keyUp(input, { key: 'A', code: 'KeyA' })
      fireEvent.change(input, { target: { value: 'A' } })

      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue('A')
    })

    it('maintains focus after user interaction', () => {
      render(
        <Input
          type="text"
          placeholder="Field with focus"
          data-testid="focus-input"
        />
      )

      const input = screen.getByTestId('focus-input')
      input.focus()
      expect(input).toHaveFocus()

      fireEvent.change(input, { target: { value: 'Focus test' } })
      expect(input).toHaveFocus()
      expect(input).toHaveValue('Focus test')
    })

    it('properly manages focus with multiple inputs', () => {
      render(
        <>
          <Input
            type="text"
            labelProps={{ value: 'First field' }}
            data-testid="first-field"
          />
          <Input
            type="text"
            labelProps={{ value: 'Second field' }}
            data-testid="second-field"
          />
        </>
      )

      const firstInput = screen.getByTestId('first-field')
      const secondInput = screen.getByTestId('second-field')

      firstInput.focus()
      expect(firstInput).toHaveFocus()
      expect(secondInput).not.toHaveFocus()

      fireEvent.keyDown(firstInput, { key: 'Tab' })
      secondInput.focus()
      expect(firstInput).not.toHaveFocus()
      expect(secondInput).toHaveFocus()
    })
  })

  it('renders an icon when passed as a prop', () => {
    render(
      <Input
        type="text"
        icon={<MdOutlineEmail data-testid="input-icon" />}
        placeholder="With icon"
      />
    )
    const icon = screen.getByTestId('input-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders icon on the left by default', () => {
    render(
      <Input
        type="text"
        icon={<MdOutlineEmail data-testid="input-icon-left" />}
        placeholder="Left icon"
      />
    )
    const icon = screen.getByTestId('input-icon-left')
    expect(icon.parentElement).toHaveStyle('order: 0')
  })

  it('renders icon on the right when iconPosition is "right"', () => {
    render(
      <Input
        type="text"
        icon={<MdOutlineEmail data-testid="input-icon-right" />}
        iconPosition="right"
        placeholder="Right icon"
      />
    )
    const icon = screen.getByTestId('input-icon-right')
    expect(icon.parentElement).toHaveStyle('order: 1')
  })

  it('applies extra padding to the correct side when icon is present', () => {
    const { rerender } = render(
      <Input
        type="text"
        icon={<MdOutlineEmail />}
        iconPosition="left"
        data-testid="input-with-left-icon"
      />
    )

    const leftIconInput = screen.getByTestId('input-with-left-icon')
    expect(leftIconInput).toHaveStyle('padding-left: 8px')

    rerender(
      <Input
        type="text"
        icon={<MdOutlineEmail />}
        iconPosition="right"
        data-testid="input-with-right-icon"
      />
    )
    const rightIconInput = screen.getByTestId('input-with-right-icon')
    expect(rightIconInput).toHaveStyle('padding-right: 8px')
  })
})
