import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it, vi } from 'vitest'

import { TextArea } from './TextArea'

const theme = {}
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

describe('TextArea', () => {
  it('renders without crashing', () => {
    renderWithTheme(<TextArea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with label', () => {
    renderWithTheme(<TextArea label={{ value: 'Description' }} />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders with error as string', () => {
    renderWithTheme(<TextArea error={{ message: 'Required field' }} />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('renders with error as object', () => {
    renderWithTheme(<TextArea error={{ message: 'Invalid input' }} />)
    expect(screen.getByText('Invalid input')).toBeInTheDocument()
  })

  it('applies noResize correctly', () => {
    renderWithTheme(<TextArea isResizable={false} />)
    expect(screen.getByRole('textbox')).toHaveStyle('resize: none')
  })

  it('forwards ref to textarea element', () => {
    const ref = { current: null as HTMLTextAreaElement | null }
    renderWithTheme(<TextArea inputRef={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('fires change event', () => {
    const handleChange = vi.fn()
    renderWithTheme(<TextArea onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })
})
