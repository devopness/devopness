import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Dropdown } from '.'
import { getColor } from 'src/colors'

describe('Dropdown', () => {
  /**
   * userEvent provides a more realistic way to simulate user interactions compared to fireEvent.
   * It performs multiple events that happen in a real browser (e.g., mouseOver, mouseMove, mouseDown,
   * mouseUp, click for a click event).
   *
   * Benefits:
   * - Handles state updates automatically (no explicit act() needed)
   * - More closely simulates real user behavior
   * - Includes built-in timing for events
   * - Maintains a cleaner test setup than fireEvent or manual act() wrapping
   *
   * Sequential events work reliably because userEvent:
   * - Waits for previous events to complete before starting new ones
   * - Ensures React state updates and re-renders are finished
   * - Includes proper event timing and debouncing
   *
   * Considerations:
   * - Slightly slower test execution (due to more realistic event simulation)
   * - Must use async/await syntax for all interactions
   *
   * @example
   * // Instead of:
   * fireEvent.click(element)
   * // or
   * act(() => { fireEvent.click(element) })
   *
   * // Use:
   * await user.click(element)
   *
   * // Sequential events just work:
   * await user.click(openButton)
   * await user.click(menuItem)
   *
   * @see https://testing-library.com/docs/user-event/intro/
   */
  const user = userEvent.setup()

  describe('badges', () => {
    it('renders icon badge correctly', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            {
              label: 'Option',
              badge: {
                icon: true,
                name: 'add',
                size: 12,
                backgroundColor: getColor('blue.100'),
                color: 'white',
              },
            },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))

      const icon = screen.getByTestId('option-0-badge')
      expect(icon).toBeInTheDocument()
      expect(icon.closest('span')).toHaveStyle({
        backgroundColor: getColor('blue.100'),
      })
      expect(screen.getByLabelText('add')).toHaveStyle({
        color: 'rgb(255, 255, 255)',
      })
    })

    it('renders icon badge with default size', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            {
              label: 'Option',
              badge: {
                icon: true,
                name: 'add',
                backgroundColor: getColor('blue.100'),
                color: 'white',
              },
            },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))

      const icon = screen.getByTestId('option-0-badge')
      expect(icon).toBeInTheDocument()
      expect(screen.getByLabelText('add')).toHaveAttribute('height', '12')
      expect(screen.getByLabelText('add')).toHaveAttribute('width', '12')
    })

    it('renders letter badge correctly', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            {
              label: 'Option',
              badge: {
                backgroundColor: 'red',
                color: 'white',
              },
            },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))

      expect(screen.getByText('O')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onSelect when option is clicked', async () => {
      const onSelect = vi.fn()
      const option = { label: 'Option 1' }

      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            option,
          ]}
          onSelect={onSelect}
        />
      )

      await user.click(screen.getByText('Menu'))
      await user.click(screen.getByText('Option 1'))

      expect(onSelect).toHaveBeenCalledWith(option)
    })

    it('calls onToggle when dropdown is opened/closed', async () => {
      const onToggle = vi.fn()

      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            { label: 'Option' },
          ]}
          onToggle={onToggle}
        />
      )

      await user.click(screen.getByText('Menu'))

      expect(onToggle).toHaveBeenCalled()
    })

    it('calls option onClick handler when provided', async () => {
      const onSelect = vi.fn()
      const onClick = vi.fn()

      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            { label: 'Custom Click', onClick },
          ]}
          onSelect={onSelect}
        />
      )

      await user.click(screen.getByText('Menu'))

      await user.click(screen.getByText('Custom Click'))
      expect(onClick).toHaveBeenCalled()
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('handles disabled options', async () => {
      const onSelect = vi.fn()

      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            { label: 'Disabled Option', isDisabled: true },
          ]}
          onSelect={onSelect}
        />
      )

      await user.click(screen.getByText('Menu'))
      await user.click(screen.getByText('Disabled Option'))

      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe('option styling', () => {
    it('handles active state with default colors', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            {
              label: 'Active Option',
              isActive: true,
            },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))

      const option = screen.getByText('Active Option')
      expect(option).toHaveStyle({ color: getColor('blue.800') })
      expect(option.closest('div')).toHaveStyle({
        backgroundColor: '',
      })
    })

    it('handles active state and custom colors', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            {
              label: 'Active Option',
              isActive: true,
              activeBackgroundColor: 'blue.100',
              color: 'blue.800',
            },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))

      const option = screen.getByText('Active Option')
      expect(option).toHaveStyle({ color: getColor('blue.800') })
      expect(option.closest('div')).toHaveStyle({
        backgroundColor: getColor('blue.100'),
      })
    })

    it('handles broken sequence styling', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            { label: 'Option 1' },
            { label: 'Option 2', brokenSequence: true },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))

      const option = screen.getByText('Option 2').closest('div')
      expect(option).toHaveStyle({
        borderTop: `1px solid ${getColor('slate.300')}`,
      })
    })

    it('renders link option correctly', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            {
              label: 'Go to Link',
              url: '/test',
              linkProps: { target: '_blank', hideExternalUrlIcon: true },
            },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))
      const link = screen.getByText('Go to Link').closest('a')
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveAttribute('target', '_blank')
      expect(screen.queryByLabelText('openInNewWindow')).not.toBeInTheDocument()
    })
  })

  describe('renders correctly', () => {
    describe('with button anchor', () => {
      it('renders correctly', () => {
        const icon = 'add'
        const iconSize = 12

        render(
          <Dropdown
            id="test-dropdown"
            anchorType="button"
            label="Menu"
            hideLabel
            options={[]}
            buttonProps={{
              icon,
              iconSize,
            }}
          />
        )

        expect(screen.getByTestId('dropdown-button')).not.toHaveTextContent(
          'Menu'
        )
        expect(screen.getByLabelText(icon)).toBeInTheDocument()
        expect(screen.getByLabelText(icon)).toHaveAttribute(
          'height',
          iconSize.toString()
        )
        expect(screen.getByLabelText(icon)).toHaveAttribute(
          'width',
          iconSize.toString()
        )
      })

      it('renders with buttonProps', () => {
        const defaultLabel = 'Open Popover'

        render(
          <Dropdown
            id="test-dropdown"
            anchorType="button"
            hideDropdownIcon
            options={[]}
            buttonProps={{
              backgroundColor: getColor('blue.100'),
            }}
          />
        )

        expect(screen.getByText(defaultLabel)).toBeInTheDocument()
        expect(screen.getByTestId('dropdown-button')).toHaveStyle({
          backgroundColor: getColor('blue.100'),
        })
        expect(
          screen.queryByTestId('dropdown-button')?.closest('svg')
        ).not.toBeInTheDocument()
      })
    })

    it('with content anchor', () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="content"
          content={<div>Custom Trigger</div>}
          options={[]}
        />
      )

      expect(screen.getByText('Custom Trigger')).toBeInTheDocument()
    })

    it('with tooltip on button', async () => {
      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[]}
          tooltip="Helpful tooltip"
        />
      )

      await userEvent.hover(screen.getByText('Menu'))

      await waitFor(() => {
        expect(screen.getByText('Helpful tooltip')).toBeInTheDocument()
      })
    })
  })

  describe('tooltips', () => {
    it('shows tooltip on text overflow', async () => {
      const longText =
        'This is a very long option text that should trigger ellipsis'

      render(
        <Dropdown
          id="test-dropdown"
          anchorType="button"
          label="Menu"
          options={[
            { label: longText },
          ]}
        />
      )

      await user.click(screen.getByText('Menu'))

      const option = screen.getByText(longText)
      expect(option).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      })

      await userEvent.hover(option)

      await waitFor(() => {
        expect(screen.getByText(longText)).toBeInTheDocument()
      })
    })
  })
})
