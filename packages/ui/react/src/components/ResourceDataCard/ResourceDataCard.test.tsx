import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'

import { ResourceDataCard } from './ResourceDataCard'

describe('ResourceDataCard', () => {
  it('renders collapsed state correctly', () => {
    render(
      <ResourceDataCard
        title="Test Title"
        headerLabel="Test Label"
        prefixNode={<div>Prefix</div>}
        items={[
          { label: 'Field 1', value: 'Value 1' },
          { label: 'Field 2', value: 'Value 2', icon: 'nodejs' },
        ]}
        actions={<button type="button">Click me</button>}
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Prefix')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Test Title/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('expands when clicking the header', () => {
    render(
      <ResourceDataCard
        title="Test Title"
        items={[{ label: 'Field 1', value: 'Value 1' }]}
      />
    )

    const header = screen.getByRole('button', { name: /Test Title/i })
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('starts expanded if defaultExpanded is true', () => {
    render(
      <ResourceDataCard
        title="Test Title"
        defaultExpanded
        items={[{ label: 'Field 1', value: 'Value 1' }]}
      />
    )

    expect(screen.getByRole('button', { name: /Test Title/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })
})
