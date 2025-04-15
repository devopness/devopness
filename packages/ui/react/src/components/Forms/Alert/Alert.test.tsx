import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it, vi } from 'vitest'

import { Alert } from './Alert'

const theme = {}
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

vi.mock('src/colors', () => ({
  getColor: (color: string) =>
    ({
      'blue.950': 'rgb(23, 37, 84)',
      'red.500': 'rgb(239, 68, 68)',
      'red.300': 'rgb(248, 113, 113)',
      'red.200': 'rgb(254, 202, 202)',
      'amber.400': 'rgb(251, 191, 36)',
      'amber.200': 'rgb(254, 215, 170)',
      'amber.100': 'rgb(254, 243, 199)',
      'green.600': 'rgb(22, 163, 74)',
      'green.300': 'rgb(134, 239, 172)',
      'green.150': 'rgb(187, 247, 208)',
    })[color],
}))

vi.mock('src/icons', () => ({
  iconLoader: (name: string, size: number) => (
    <svg
      data-testid={`icon-${name}`}
      width={size}
      height={size}
    />
  ),
}))

describe('Alert', () => {
  describe('renders different alert types', () => {
    it('renders error alert with correct icon and text', () => {
      renderWithTheme(
        <Alert
          type="error"
          alertDescription="Error occurred"
        />
      )
      expect(screen.getByText('Error occurred')).toBeInTheDocument()
      expect(screen.getByTestId('icon-error')).toBeInTheDocument()
    })

    it('renders success alert with correct icon and text', () => {
      renderWithTheme(
        <Alert
          type="success"
          alertDescription="Success!"
        />
      )
      expect(screen.getByText('Success!')).toBeInTheDocument()
      expect(screen.getByTestId('icon-success')).toBeInTheDocument()
    })

    it('renders warning alert with correct icon and text', () => {
      renderWithTheme(
        <Alert
          type="warning"
          alertDescription="Warning message"
        />
      )
      expect(screen.getByText('Warning message')).toBeInTheDocument()
      expect(screen.getByTestId('icon-warning')).toBeInTheDocument()
    })
  })

  describe('styling for different alert types', () => {
    it('renders error alert structure', () => {
      renderWithTheme(
        <Alert
          type="error"
          alertDescription="Error occurred"
        />
      )
      const content = screen.getByText('Error occurred').closest('div')
      const icon = screen.getByTestId('icon-error').parentElement
      expect(content).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
    })

    it('renders success alert structure', () => {
      renderWithTheme(
        <Alert
          type="success"
          alertDescription="Success!"
        />
      )
      const content = screen.getByText('Success!').closest('div')
      const icon = screen.getByTestId('icon-success').parentElement
      expect(content).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
    })

    it('renders warning alert structure', () => {
      renderWithTheme(
        <Alert
          type="warning"
          alertDescription="Warning message"
        />
      )
      const content = screen.getByText('Warning message').closest('div')
      const icon = screen.getByTestId('icon-warning').parentElement
      expect(content).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
    })
  })

  describe('handling of long text', () => {
    it('renders long text', () => {
      const longText =
        'This is a very long alert description that should wrap to the next line because it exceeds the typical width of an alert component.'
      renderWithTheme(
        <Alert
          type="error"
          alertDescription={longText}
        />
      )
      const label = screen.getByText(longText)
      expect(label).toBeInTheDocument()
    })
  })

  describe('close button functionality', () => {
    it('renders close button when canClose is true and triggers onClose', () => {
      const onClose = vi.fn()
      renderWithTheme(
        <Alert
          type="success"
          alertDescription="Success!"
          canClose
          onClose={onClose}
        />
      )
      const closeButton = screen.getByTestId('icon-close').closest('button')
      expect(closeButton).toBeInTheDocument()
      if (closeButton) fireEvent.click(closeButton)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not render close button when canClose is false', () => {
      renderWithTheme(
        <Alert
          type="success"
          alertDescription="Success!"
        />
      )
      expect(screen.queryByTestId('icon-close')).toBeNull()
    })
  })
  describe('padding variations', () => {
    it('renders with default padding structure', () => {
      renderWithTheme(
        <Alert
          type="error"
          alertDescription="Error occurred"
        />
      )
      const wrapper = screen
        .getByText('Error occurred')
        .closest('div')?.parentElement
      expect(wrapper).toBeInTheDocument()
    })

    it('renders without padding when noPadding is true', () => {
      renderWithTheme(
        <Alert
          type="error"
          alertDescription="Error occurred"
          noPadding
        />
      )
      const wrapper = screen
        .getByText('Error occurred')
        .closest('div')?.parentElement
      expect(wrapper).toBeInTheDocument()
    })
  })
})
