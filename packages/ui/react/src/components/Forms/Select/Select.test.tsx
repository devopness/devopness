import type { MultiValue, SingleValue } from 'react-select'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './index'
import type { OptionProps } from './index'

const options: OptionProps<string>[] = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' },
  { label: 'Option C', value: 'C' },
]

describe('<Select />', () => {
  it('should render the select component with placeholder', () => {
    render(
      <Select
        options={options}
        placeholder="Select an option..."
      />
    )
    expect(screen.getByText('Select an option...')).toBeInTheDocument()
  })

  it('should allow selecting a single option', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Select
        options={options}
        placeholder="Select an option..."
        onChange={handleChange}
      />
    )

    const placeholder = screen.getByText('Select an option...')
    await user.click(placeholder)

    const optionA = screen.getByText('Option A')
    await user.click(optionA)

    expect(handleChange).toHaveBeenCalled()
    const selectedValue = handleChange.mock.calls[0][0] as
      | SingleValue<OptionProps<string>>
      | MultiValue<OptionProps<string>>
    expect(selectedValue).toMatchObject({ value: 'A', label: 'Option A' })
  })

  it('should show error message when error prop is provided', () => {
    render(
      <Select
        options={options}
        error={{ message: 'This field is required' }}
      />
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('should render readonly mode and not allow selection', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Select
        options={options}
        isReadOnly
        value={options[0]}
        onChange={handleChange}
      />
    )

    expect(screen.getByText('Option A')).toBeInTheDocument()

    await user.click(screen.getByText('Option A'))
    expect(screen.queryByText('Option B')).not.toBeInTheDocument()
  })

  it('should allow selecting multiple options when isMulti is true', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <Select
        options={options}
        isMulti
        placeholder="Select multiple options..."
        onChange={handleChange}
      />
    )

    await user.click(screen.getByText('Select multiple options...'))
    await user.click(screen.getByText('Option A'))

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Option B'))

    expect(handleChange).toHaveBeenCalledTimes(2)

    const lastCall = handleChange.mock.calls[1][0] as MultiValue<
      OptionProps<string>
    >
    expect(lastCall).toHaveLength(2)
    expect(lastCall[0]).toMatchObject({ label: 'Option A', value: 'A' })
    expect(lastCall[1]).toMatchObject({ label: 'Option B', value: 'B' })
  })

  it('should render custom "no options" message', async () => {
    const user = userEvent.setup()
    render(
      <Select
        options={[]}
        placeholder="Type something..."
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No match for "${inputValue}"` : 'No options available'
        }
      />
    )

    await user.click(screen.getByText('Type something...'))
    expect(screen.getByText('No options available')).toBeInTheDocument()

    const input = screen.getByRole('combobox')
    await user.type(input, 'xyz')

    expect(screen.getByText('No match for "xyz"')).toBeInTheDocument()
  })
})
