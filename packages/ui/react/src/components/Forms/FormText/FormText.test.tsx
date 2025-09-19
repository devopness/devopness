import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'

import { FormText } from './FormText'

const theme = {}
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

describe('FormText', () => {
  it('renders the title', () => {
    renderWithTheme(<FormText title="Main Title" />)
    expect(screen.getByText('Main Title')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    renderWithTheme(
      <FormText
        title="Main Title"
        subTitle="Subtitle text"
      />
    )
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    renderWithTheme(<FormText title="Main Title" />)
    expect(screen.queryByText('Subtitle text')).toBeNull()
  })

  it('applies custom color to subtitle', () => {
    renderWithTheme(
      <FormText
        title="Main Title"
        subTitle="Custom Color Subtitle"
        subTitleColor="rgb(239, 68, 68)"
      />
    )
    const subtitle = screen.getByText('Custom Color Subtitle')
    expect(subtitle).toHaveStyle('color: rgb(239, 68, 68)')
  })
})
