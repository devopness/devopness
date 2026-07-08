import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { RadioSelectCards } from './RadioSelectCards'

const sampleData = [
  { value: 'option1', label: 'Option 1', icon: 'icon1' },
  {
    value: 'option2',
    label: 'Option 2',
    icon: { name: 'icon2', color: 'blue' },
  },
]

describe('RadioSelectCards', () => {
  it('renders without crashing', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={sampleData}
      />
    )
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={[]}
        isLoading
      />
    )
    const loader = screen.getByTestId('radio-select-cards-loader')
    expect(loader).toBeInTheDocument()
  })

  it('renders error message', () => {
    const error = { message: 'Please select an option' }
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={sampleData}
        error={error}
      />
    )
    expect(screen.getByText(error.message)).toBeInTheDocument()
  })

  it('allows selecting a radio option', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={sampleData}
      />
    )

    const option1 = screen.getByRole('radio', {
      name: 'Option 1',
    }) as HTMLInputElement

    const option2 = screen.getByRole('radio', {
      name: 'Option 2',
    }) as HTMLInputElement

    fireEvent.click(option1)
    expect(option1.checked).toBe(true)
    expect(option2.checked).toBe(false)

    fireEvent.click(option2)
    expect(option1.checked).toBe(false)
    expect(option2.checked).toBe(true)
  })

  it('applies a mobile breakpoint that switches the grid to 2 columns', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={sampleData}
      />
    )
    const styles = Array.from(document.querySelectorAll('style'))
      .map((style) => style.textContent)
      .join('\n')

    expect(styles).toContain('max-width: 600px')
    expect(styles).toContain('repeat(2, 1fr)')
  })

  it('does not warn when a data item sets both checked and defaultChecked (controlled/uncontrolled guard)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn())

    render(
      <RadioSelectCards
        name="exampleRadio"
        inputProps={{ onChange: vi.fn() }}
        data={[
          {
            value: 'option1',
            label: 'Option 1',
            icon: 'icon1',
            checked: true,
            defaultChecked: false,
          },
          {
            value: 'option2',
            label: 'Option 2',
            icon: 'icon2',
            checked: false,
            defaultChecked: true,
          },
        ]}
      />
    )

    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('treats the input as controlled once `checked` is set, ignoring `defaultChecked`', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        inputProps={{ onChange: vi.fn() }}
        data={[
          {
            value: 'option1',
            label: 'Option 1',
            icon: 'icon1',
            checked: true,
            defaultChecked: false,
          },
        ]}
      />
    )

    const option1 = screen.getByRole('radio', {
      name: 'Option 1',
    }) as HTMLInputElement

    expect(option1.checked).toBe(true)
  })
})
