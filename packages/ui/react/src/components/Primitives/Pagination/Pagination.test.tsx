import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest' 

import { Pagination } from './Pagination'

const mockHandlers = {
  firstPaginateAction: vi.fn(),
  previousPaginateAction: vi.fn(),
  nextPaginateAction: vi.fn(),
  lastPaginateAction: vi.fn(),
}

describe('Pagination', () => {
  describe('rendering and interactions', () => {
    it('renders all buttons by default', () => {
      render(<Pagination {...mockHandlers} />)
      expect(screen.getByRole('button', { name: /First/i })).toBeVisible()
      expect(screen.getByRole('button', { name: /Previous/i })).toBeVisible()
      expect(screen.getByRole('button', { name: /Next/i })).toBeVisible()
      expect(screen.getByRole('button', { name: /Last/i })).toBeVisible()
    })

    it('hides first/last buttons when hideFirstAndLastButton is true', () => {
      render(
        <Pagination
          {...mockHandlers}
          hideFirstAndLastButton
        />
      )
      expect(
        screen.queryByRole('button', { name: /First/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /Last/i })
      ).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Previous/i })).toBeVisible()
      expect(screen.getByRole('button', { name: /Next/i })).toBeVisible()
    })
  })

  describe('disabled states', () => {
    it('disables all buttons when disableAllActions is true', () => {
      render(
        <Pagination
          {...mockHandlers}
          disableAllActions
        />
      )
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })

    it('disables previous/first buttons when disablePreviousActions is true', () => {
      render(
        <Pagination
          {...mockHandlers}
          disablePreviousActions
        />
      )
      expect(screen.getByRole('button', { name: /First/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Previous/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Next/i })).toBeEnabled()
      expect(screen.getByRole('button', { name: /Last/i })).toBeEnabled()
    })

    it('disables next/last buttons when disableNextActions is true', () => {
      render(
        <Pagination
          {...mockHandlers}
          disableNextActions
        />
      )
      expect(screen.getByRole('button', { name: /First/i })).toBeEnabled()
      expect(screen.getByRole('button', { name: /Previous/i })).toBeEnabled()
      expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Last/i })).toBeDisabled()
    })
  })

  describe('navigation interactions', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('triggers correct handlers when buttons are clicked', () => {
      render(<Pagination {...mockHandlers} />)
      fireEvent.click(screen.getByRole('button', { name: /First/i }))
      expect(mockHandlers.firstPaginateAction).toHaveBeenCalledTimes(1)

      fireEvent.click(screen.getByRole('button', { name: /Previous/i }))
      expect(mockHandlers.previousPaginateAction).toHaveBeenCalledTimes(1)

      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      expect(mockHandlers.nextPaginateAction).toHaveBeenCalledTimes(1)

      fireEvent.click(screen.getByRole('button', { name: /Last/i }))
      expect(mockHandlers.lastPaginateAction).toHaveBeenCalledTimes(1)
    })

    it('does not trigger handlers when buttons are disabled', () => {
      render(
        <Pagination
          {...mockHandlers}
          disablePreviousActions
          disableNextActions
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /First/i }))
      fireEvent.click(screen.getByRole('button', { name: /Previous/i }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByRole('button', { name: /Last/i }))

      expect(mockHandlers.firstPaginateAction).not.toHaveBeenCalled()
      expect(mockHandlers.previousPaginateAction).not.toHaveBeenCalled()
      expect(mockHandlers.nextPaginateAction).not.toHaveBeenCalled()
      expect(mockHandlers.lastPaginateAction).not.toHaveBeenCalled()
    })
  })

  describe('styling', () => {
    it('applies correct spacing between buttons', () => {
      render(<Pagination {...mockHandlers} />)
      const buttons = screen.getAllByRole('button')
      const container = buttons[0].parentElement
      expect(container).toHaveStyle('display: flex')
    })
  })
})
