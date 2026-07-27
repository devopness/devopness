import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'

import { ResourceCardGrid } from './ResourceCardGrid'

const noopPagination = {
  firstPaginateAction: vi.fn(),
  previousPaginateAction: vi.fn(),
  nextPaginateAction: vi.fn(),
  lastPaginateAction: vi.fn(),
}

describe('ResourceCardGrid', () => {
  it('always renders the create tile first', () => {
    render(
      <ResourceCardGrid
        resourceType="project"
        resources={[{ name: 'my-app' }]}
        pageCount={1}
        pagination={noopPagination}
      />
    )

    expect(screen.getByText('Add project')).toBeInTheDocument()
    expect(screen.getByText('my-app')).toBeInTheDocument()
  })

  it('calls onCreateResource when the create tile is clicked', () => {
    const handleCreate = vi.fn()
    render(
      <ResourceCardGrid
        resourceType="project"
        resources={[]}
        onCreateResource={handleCreate}
        pageCount={1}
        pagination={noopPagination}
      />
    )

    fireEvent.click(screen.getByText('Add project'))
    expect(handleCreate).toHaveBeenCalledTimes(1)
  })

  it('renders one ResourceCard per resource', () => {
    render(
      <ResourceCardGrid
        resourceType="project"
        resources={[{ name: 'app-one' }, { name: 'app-two' }]}
        pageCount={1}
        pagination={noopPagination}
      />
    )

    expect(screen.getByText('app-one')).toBeInTheDocument()
    expect(screen.getByText('app-two')).toBeInTheDocument()
  })

  it('does not render pagination when pageCount is 1', () => {
    render(
      <ResourceCardGrid
        resourceType="project"
        resources={[]}
        pageCount={1}
        pagination={noopPagination}
      />
    )

    expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument()
  })

  it('renders pagination when pageCount is greater than 1', () => {
    render(
      <ResourceCardGrid
        resourceType="project"
        resources={[]}
        pageCount={2}
        pagination={noopPagination}
      />
    )

    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument()
  })
})
