import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'

import { ResourceCard } from './ResourceCard'

describe('ResourceCard', () => {
  describe('renders correctly', () => {
    it('with the name text', () => {
      render(<ResourceCard name="Test Project" />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('with the first letter of the name as the avatar initial (uppercased)', () => {
      render(<ResourceCard name="deploy" />)
      expect(screen.getByText('D')).toBeInTheDocument()
    })

    it('with organization when provided', () => {
      render(
        <ResourceCard
          name="My App"
          organization="Alice"
        />
      )
      expect(screen.getByText('Organization: Alice')).toBeInTheDocument()
    })

    it('with a relative "ago" label for a past createdAt', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      render(
        <ResourceCard
          name="Recent"
          createdAt={fiveMinutesAgo}
        />
      )
      expect(screen.getByText(/Created:.*ago/)).toBeInTheDocument()
    })

    it('with a relative "in" label for a future createdAt', () => {
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      render(
        <ResourceCard
          name="Future"
          createdAt={in30Days}
        />
      )
      expect(screen.getByText(/Created: in/)).toBeInTheDocument()
    })

    it('with both organization and createdAt together', () => {
      render(
        <ResourceCard
          name="Full Card"
          organization="Bob"
          createdAt={new Date()}
        />
      )
      expect(screen.getByText('Organization: Bob')).toBeInTheDocument()
      expect(screen.getByText(/Created:/)).toBeInTheDocument()
    })
  })

  describe('optional props absent', () => {
    it('does not render the meta section when organization and createdAt are both absent', () => {
      render(<ResourceCard name="Minimal" />)
      expect(screen.queryByText(/Organization:/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Created:/)).not.toBeInTheDocument()
    })

    it('does not render "Created" when createdAt is omitted', () => {
      render(
        <ResourceCard
          name="No Date"
          organization="Alice"
        />
      )
      expect(screen.queryByText(/Created:/)).not.toBeInTheDocument()
    })

    it('does not render "Organization" when organization is omitted', () => {
      render(
        <ResourceCard
          name="No Owner"
          createdAt={new Date()}
        />
      )
      expect(screen.queryByText(/Organization:/)).not.toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('calls onClick when the card is clicked', () => {
      const handleClick = vi.fn()
      render(
        <ResourceCard
          name="Clickable"
          onClick={handleClick}
        />
      )
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not throw when clicked and onClick is not provided', () => {
      render(<ResourceCard name="No Handler" />)
      expect(() => {
        fireEvent.click(screen.getByRole('button'))
      }).not.toThrow()
    })

    it.each([
      'Enter',
      ' ',
    ])('calls onClick when %s is pressed', (key) => {
      const handleClick = vi.fn()
      render(
        <ResourceCard
          name="Keyboard"
          onClick={handleClick}
        />
      )
      fireEvent.keyDown(screen.getByRole('button'), { key })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick for other keys', () => {
      const handleClick = vi.fn()
      render(
        <ResourceCard
          name="Keyboard"
          onClick={handleClick}
        />
      )
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' })
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has role="button" for keyboard/screen-reader users', () => {
      render(<ResourceCard name="A11y Card" />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has tabIndex=0 making it keyboard-focusable', () => {
      render(<ResourceCard name="Focusable" />)
      expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
    })
  })

  describe('useDynamicColor', () => {
    it('renders without crashing when true', () => {
      render(
        <ResourceCard
          name="Colored"
          useDynamicColor
        />
      )
      expect(screen.getByText('Colored')).toBeInTheDocument()
    })

    it('renders without crashing when false (default)', () => {
      render(<ResourceCard name="Default Color" />)
      expect(screen.getByText('Default Color')).toBeInTheDocument()
    })
  })
})
