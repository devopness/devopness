import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders correctly when passed "required" as type', () => {
    render(<ErrorMessage error={{ type: 'required' }} />)

    const expectedText = screen.getByText('This field is required!')
    expect(expectedText).toBeInTheDocument()
  })

  it('render correctly when passed a message', () => {
    const message = 'error message'
    render(<ErrorMessage error={{ message }} />)

    const expectedText = screen.getByText(message)
    expect(expectedText).toBeInTheDocument()
  })

  it('render correctly when passed an errors object with a message', () => {
    const message = 'error message'
    render(<ErrorMessage error={{ errors: { message } }} />)

    const expectedText = screen.getByText(message)
    expect(expectedText).toBeInTheDocument()
  })

  it('render correctly when no error is passed as prop', () => {
    render(<ErrorMessage error={undefined} />)

    const element = screen.getByTestId('error-message')
    expect(element.textContent).toEqual('')
  })

  it('render correctly a new class passed as prop', () => {
    const className = 'test'
    render(
      <ErrorMessage
        error={undefined}
        className={className}
      />
    )

    const element = screen.getByTestId('error-message')
    expect(element.classList.contains(className)).toBeTruthy()
  })
})
