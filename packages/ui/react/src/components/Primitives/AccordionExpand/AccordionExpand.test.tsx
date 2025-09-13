import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { Link } from '../Link'
import { AccordionExpand } from './AccordionExpand'

describe('AccordionExpand', () => {
  const items = [
    { label: 'Option 1', onClick: vi.fn() },
    { label: 'Option 2', url: '/test' },
    { label: 'Disabled Option', isDisabled: true },
  ]

  it('renders the label', () => {
    render(
      <AccordionExpand
        label="Test Accordion"
        items={items}
        navigationComponent={Link}
      />
    )
    expect(screen.getByText('Test Accordion')).toBeInTheDocument()
  })

  it('expands and shows items on click', () => {
    render(
      <AccordionExpand
        label="Test Accordion"
        items={items}
        navigationComponent={Link}
      />
    )
    fireEvent.click(screen.getByText('Test Accordion'))
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('calls onClick for enabled item', () => {
    const onClick = vi.fn()
    render(
      <AccordionExpand
        label="Test Accordion"
        items={[
          { label: 'Option 1', onClick },
        ]}
      />
    )
    fireEvent.click(screen.getByText('Test Accordion'))
    fireEvent.click(screen.getByText('Option 1'))
    expect(onClick).toHaveBeenCalled()
  })

  it('does not call onClick for disabled item', () => {
    const onClick = vi.fn()
    render(
      <AccordionExpand
        label="Test Accordion"
        items={[
          { label: 'Disabled Option', onClick, isDisabled: true },
        ]}
      />
    )
    fireEvent.click(screen.getByText('Test Accordion'))
    fireEvent.click(screen.getByText('Disabled Option'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
