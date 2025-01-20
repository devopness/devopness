import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Dropdown } from '.'
import { getColor } from 'src/colors'

describe('Dropdown', () => {
  it('renders correctly with button anchor', () => {
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[]}
      />
    )

    expect(screen.getByText('Menu')).toBeInTheDocument()
  })

  it('renders correctly with content anchor', () => {
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

  it('calls onToggle when dropdown is opened/closed', async () => {
    const onToggle = vi.fn()
    
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[{ label: 'Option' }]}
        onToggle={onToggle}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })

    expect(onToggle).toHaveBeenCalled()
  })

  it('calls onSelect when option is clicked', async () => {
    const onSelect = vi.fn()
    const option = { label: 'Option 1' }

    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[option]}
        onSelect={onSelect}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })
    
    await userEvent.click(screen.getByText('Option 1'))
    expect(onSelect).toHaveBeenCalledWith(option)
  })

  it('renders tooltip on button', async () => {
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
            linkProps: { target: '_blank' }
          }
        ]}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })

    const link = screen.getByText('Go to Link').closest('a')
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveAttribute('target', '_blank')
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
              color: 'white'
            }
          }
        ]}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })

    expect(screen.getByText('O')).toBeInTheDocument()
  })

  it('handles broken sequence styling', async () => {
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[
          { label: 'Option 1' },
          { label: 'Option 2', brokenSequence: true }
        ]}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })

    const option = screen.getByText('Option 2').closest('div')
    expect(option).toHaveStyle({ borderTop: `1px solid ${getColor('slate.300')}` })
  })

  it('handles disabled options correctly', async () => {
    const onSelect = vi.fn()
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[{ label: 'Disabled Option', isDisabled: true }]}
        onSelect={onSelect}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })
    
    await userEvent.click(screen.getByText('Disabled Option'))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('calls option onClick handler when provided', async () => {
    const onSelect = vi.fn()
    const onClick = vi.fn()
    
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[{ label: 'Custom Click', onClick }]}
        onSelect={onSelect}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })
    
    await userEvent.click(screen.getByText('Custom Click'))
    expect(onClick).toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('renders icon badge correctly', async () => {
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[{
          label: 'Option',
          badge: {
            icon: true,
            name: 'add',
            size: 12,
            backgroundColor: getColor('blue.100'),
            color: 'white'
          }
        }]}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })

    const icon = screen.getByTestId('option-0-badge')
    expect(icon).toBeInTheDocument()
    expect(icon.closest('span')).toHaveStyle({
      backgroundColor: getColor('blue.100')
    })
  })

  it('handles active state and custom colors', async () => {
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[{
          label: 'Active Option',
          isActive: true,
          activeBackgroundColor: 'blue.100',
          color: 'blue.800'
        }]}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })

    const option = screen.getByText('Active Option')
    expect(option).toHaveStyle({ color: getColor('blue.800') })
    expect(option.closest('div')).toHaveStyle({
      backgroundColor: getColor('blue.100')
    })
  })

  it('shows tooltip on text overflow', async () => {
    const longText = 'This is a very long option text that should trigger ellipsis'
    
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[{ label: longText }]}
      />
    )

    await act(async () => {
      await userEvent.click(screen.getByText('Menu'))
    })

    const option = screen.getByText(longText)
    expect(option).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    })

    await userEvent.hover(option)
    
    await waitFor(() => {
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })
})
