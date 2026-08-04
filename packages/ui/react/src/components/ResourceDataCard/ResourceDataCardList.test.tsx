import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'

import { ResourceDataCardList } from './List'

const noopPagination = {
  firstPaginateAction: vi.fn(),
  previousPaginateAction: vi.fn(),
  nextPaginateAction: vi.fn(),
  lastPaginateAction: vi.fn(),
}

describe('ResourceDataCardList', () => {
  it('renders cards with correct data', () => {
    render(
      <ResourceDataCardList
        cards={[
          {
            title: 'Test Card',
            items: [],
            viewDetailsHref: '/test',
          },
        ]}
        pagination={noopPagination}
      />
    )

    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(
      <ResourceDataCardList
        cards={[]}
        emptyTableMessage="Nothing here"
      />
    )

    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders add card when onAdd is provided', () => {
    const handleAdd = vi.fn()
    render(
      <ResourceDataCardList
        cards={[]}
        onAdd={handleAdd}
        resourceTypeHumanReadable="Resource"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /add resource/i }))
    expect(handleAdd).toHaveBeenCalledTimes(1)
  })

  it('renders link card when onLink is provided', () => {
    const handleLink = vi.fn()
    render(
      <ResourceDataCardList
        cards={[]}
        onLink={handleLink}
        resourceTypeHumanReadable="Resource"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /link resource/i }))
    expect(handleLink).toHaveBeenCalledTimes(1)
  })

  it('renders pagination when pageCount is greater than 1', () => {
    render(
      <ResourceDataCardList
        cards={[
          {
            title: 'Test Card',
            items: [],
            viewDetailsHref: '/test',
          },
        ]}
        pageCount={2}
        pagination={noopPagination}
      />
    )

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })
})
