import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'

import type { CardListProps } from './CardList'
import { CardList } from './CardList'

const mockData = [
  {
    backgroundColor: 'blue.100',
    color: 'blue.500',
    indicator: 3,
    label: 'Test Card',
    icon: 'add',
    children: <div>Test Content</div>,
    footer: [],
    url: '/test',
  },
] satisfies CardListProps['data']

describe('CardList', () => {
  it('renders cards with correct data', () => {
    render(
      <CardList
        data={mockData}
        isError={false}
        isLoading={false}
        loadingCardsCount={3}
      />
    )

    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(
      <CardList
        data={[]}
        isError={false}
        isLoading={false}
        loadingCardsCount={3}
      />
    )

    expect(screen.getByTestId('card-list-empty-state')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('renders add button when addUrl is provided', () => {
    const dataWithAddUrl = [
      {
        ...mockData[0],
        addUrl: { to: '/test/add', disabled: true },
      },
    ] satisfies CardListProps['data']

    render(
      <CardList
        data={dataWithAddUrl}
        isError={false}
        isLoading={false}
        loadingCardsCount={1}
      />
    )

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })
})
