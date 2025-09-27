import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect } from 'vitest'

import { Autocomplete } from './Autocomplete'
import type { AutocompleteProps } from './Autocomplete'

const theme = {}
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

describe('Autocomplete', () => {
  const defaultProps: AutocompleteProps = {
    inputProps: { placeholder: 'Type something' },
    autocompleteProps: {
      options: [
        'Option 1',
        'Option 2',
      ],
      value: '',
    },
  }

  it('renders input with placeholder', () => {
    renderWithTheme(<Autocomplete {...defaultProps} />)
    expect(screen.getByPlaceholderText('Type something')).toBeInTheDocument()
  })

  it('renders options when typing', () => {
    renderWithTheme(<Autocomplete {...defaultProps} />)
    const input = screen.getByPlaceholderText('Type something')
    fireEvent.change(input, { target: { value: 'Option 1' } })
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })
})
