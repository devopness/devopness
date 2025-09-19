import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'

import { FormLoading } from './FormLoading'

const theme = {}
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

describe('FormLoading', () => {
  it('renders default skeleton structure', () => {
    renderWithTheme(<FormLoading ariaLabel="form-loading" />)

    const region = screen.getByRole('region', { name: 'form-loading' })
    expect(region).toBeInTheDocument()

    expect(region.querySelectorAll('.skeleton-title').length).toBe(0)
    expect(region.querySelectorAll('div')).not.toHaveLength(0)

    expect(region.querySelectorAll('div')).toBeTruthy()
  })

  it('applies aria-label when provided', () => {
    renderWithTheme(<FormLoading ariaLabel="custom-loading" />)
    expect(
      screen.getByRole('region', { name: 'custom-loading' })
    ).toBeInTheDocument()
  })
})
