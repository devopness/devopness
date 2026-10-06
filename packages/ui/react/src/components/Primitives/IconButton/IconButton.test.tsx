import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { IconButton } from '.'
import { resolveVariantStyle } from './IconButton.styled'
import { getColor } from 'src/colors'

const renderIconButton = (
  props: Partial<React.ComponentProps<typeof IconButton>> = {}
) =>
  render(
    <IconButton
      name="edit"
      aria-label="Edit"
      {...props}
    />
  )

describe('IconButton', () => {
  describe('renders correctly', () => {
    it('with default props (primary variant)', () => {
      renderIconButton()

      const button = screen.getByTestId('icon-button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Edit')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveStyle({
        backgroundColor: getColor('purple.800'),
        color: getColor('white'),
        borderStyle: 'none',
      })
    })

    it('with ghost variant', () => {
      renderIconButton({ variant: 'ghost' })

      const button = screen.getByTestId('icon-button')
      expect(button).toHaveStyle({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: getColor('purple.800'),
        borderStyle: 'none',
      })
    })

    it('with outlined variant', () => {
      renderIconButton({ variant: 'outlined' })

      const button = screen.getByTestId('icon-button')
      expect(button).toHaveStyle({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: getColor('purple.800'),
        borderColor: getColor('purple.800'),
        borderStyle: 'solid',
      })
    })

    it('with custom color, backgroundColor and borderColor', () => {
      renderIconButton({
        variant: 'outlined',
        color: 'red.500',
        backgroundColor: 'amber.100',
        borderColor: 'blue.500',
      })

      const button = screen.getByTestId('icon-button')
      expect(button).toHaveStyle({
        color: getColor('red.500'),
        backgroundColor: getColor('amber.100'),
        borderColor: getColor('blue.500'),
      })
    })

    it('renders a circle (border-radius equals total size)', () => {
      renderIconButton({ size: 20, padding: 4 })

      const button = screen.getByTestId('icon-button')
      const totalSize = 20 + 4 * 2
      expect(button).toHaveStyle({
        width: `${totalSize}px`,
        height: `${totalSize}px`,
        borderRadius: `${totalSize}px`,
      })
    })

    it('outlined grows by 2px so the visible padding matches other variants', () => {
      renderIconButton({ variant: 'outlined', size: 20, padding: 4 })

      const button = screen.getByTestId('icon-button')
      const outerSize = 20 + 4 * 2 + 2
      expect(button).toHaveStyle({
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        borderRadius: `${outerSize}px`,
        borderWidth: '1px',
      })
    })

    it('hides the inner icon from assistive tech', () => {
      renderIconButton()

      const hiddenWrapper = screen
        .getByTestId('icon-button')
        .querySelector('[aria-hidden="true"]')
      expect(hiddenWrapper).toBeInTheDocument()
    })

    it('disabled state', () => {
      renderIconButton({ disabled: true })

      const button = screen.getByTestId('icon-button')
      expect(button).toBeDisabled()
      expect(button).toHaveStyle({ opacity: '0.5', cursor: 'not-allowed' })
    })
  })

  describe('interactions', () => {
    it('handles click events', () => {
      const handleClick = vi.fn()
      renderIconButton({ onClick: handleClick })

      fireEvent.click(screen.getByTestId('icon-button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not fire click when disabled', () => {
      const handleClick = vi.fn()
      renderIconButton({ onClick: handleClick, disabled: true })

      fireEvent.click(screen.getByTestId('icon-button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('resolveVariantStyle', () => {
    it('returns variant defaults when no overrides are given', () => {
      const primary = resolveVariantStyle('primary', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: undefined,
      })
      expect(primary.backgroundColor).toBe(getColor('purple.800'))
      expect(primary.iconColor).toBe(getColor('white'))

      const ghost = resolveVariantStyle('ghost', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: undefined,
      })
      expect(ghost.backgroundColor).toBe('transparent')
      expect(ghost.iconColor).toBe(getColor('purple.800'))

      const outlined = resolveVariantStyle('outlined', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: undefined,
      })
      expect(outlined.backgroundColor).toBe('transparent')
      expect(outlined.borderColor).toBe(getColor('purple.800'))
      expect(outlined.iconColor).toBe(getColor('purple.800'))
    })

    it('focus ring uses background color for primary', () => {
      const resolved = resolveVariantStyle('primary', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: undefined,
      })
      expect(resolved.focusRingColor).toBe(resolved.backgroundColor)
    })

    it('focus ring uses icon color for ghost and outlined', () => {
      const ghost = resolveVariantStyle('ghost', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: 'red.500',
      })
      expect(ghost.focusRingColor).toBe(getColor('red.500'))

      const outlined = resolveVariantStyle('outlined', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: 'red.500',
      })
      expect(outlined.focusRingColor).toBe(getColor('red.500'))
    })

    it('computes hover background as a color-mix', () => {
      const primary = resolveVariantStyle('primary', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: undefined,
      })
      expect(primary.hoverBackgroundColor).toBe(
        `color-mix(in srgb, ${primary.backgroundColor} 90%, #000)`
      )

      const outlined = resolveVariantStyle('outlined', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: undefined,
      })
      expect(outlined.hoverBackgroundColor).toBe(
        `color-mix(in srgb, ${outlined.iconColor} 12%, white)`
      )
    })

    it('ghost gets a light icon-tinted hover background, not the filter fallback', () => {
      const ghost = resolveVariantStyle('ghost', {
        backgroundColor: undefined,
        borderColor: undefined,
        color: undefined,
      })
      expect(ghost.hoverBackgroundColor).toBe(
        `color-mix(in srgb, ${ghost.iconColor} 12%, white)`
      )
    })
  })
})
