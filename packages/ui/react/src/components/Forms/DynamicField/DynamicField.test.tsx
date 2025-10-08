import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DynamicField } from './DynamicField'

describe('DynamicField', () => {
  it('renders a text input when type is "string"', () => {
    render(
      <DynamicField
        name="username"
        validation={{ type: 'string', min: 0, max: 100 }}
        placeholder="Enter username"
      />
    )
    const element = screen.getByTestId('rendered-field')

    expect(element.tagName).toEqual('INPUT')
    expect(element.getAttribute('type')).toEqual('text')
  })

  it('renders a textarea when type is "text"', () => {
    render(
      <DynamicField
        name="bio"
        validation={{ type: 'text', min: 0, max: 500 }}
        placeholder="Enter bio"
      />
    )
    const element = screen.getByTestId('rendered-field')

    expect(element.tagName).toEqual('TEXTAREA')
  })

  it('renders a number input when type is "number"', () => {
    render(
      <DynamicField
        name="age"
        validation={{ type: 'number', min: 0, max: 100 }}
        placeholder="Enter age"
      />
    )
    const element = screen.getByTestId('rendered-field')

    expect(element.tagName).toEqual('INPUT')
    expect(element.getAttribute('type')).toEqual('number')
  })

  it('renders a select when type is "boolean"', () => {
    render(
      <DynamicField
        name="active"
        validation={{ type: 'boolean', min: 0, max: 1 }}
        placeholder="Select status"
      />
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    const onChange = vi.fn()
    render(
      <DynamicField
        name="email"
        validation={{ type: 'string', min: 0, max: 100 }}
        placeholder="Enter email"
        onChange={onChange}
      />
    )
    const input = screen.getByPlaceholderText('Enter email')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('displays an error message when provided', () => {
    render(
      <DynamicField
        name="password"
        validation={{ type: 'string', min: 0, max: 100 }}
        error={{ message: 'Required field' }}
      />
    )
    expect(screen.getByText(/Required field/i)).toBeInTheDocument()
  })
})
