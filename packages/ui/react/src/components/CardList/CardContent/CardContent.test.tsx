import { render, screen } from '@testing-library/react'

import type { CardContentProps } from './CardContent'
import { CardContent } from './CardContent'

const mockResources = [
  {
    id: 1,
    name: 'Resource 1',
    url: '/test/1',
  },
  {
    id: 2,
    name: 'Resource 2',
    url: '/test/2',
  },
]

describe('CardContent', () => {
  const defaultProps = {
    basePath: '/test',
    resourceTypeLabelPlural: 'Applications',
    resourceTypeLabelSingular: 'Application',
    resources: mockResources,
    isError: false,
    isLoading: false,
  } satisfies CardContentProps

  it('renders resource list correctly', () => {
    render(<CardContent {...defaultProps} />)

    expect(screen.getByText('Resource 1')).toBeInTheDocument()
    expect(screen.getByText('Resource 2')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <CardContent
        {...defaultProps}
        isLoading
      />
    )

    const skeletons = screen.getAllByTestId('resource-item-skeleton')
    expect(skeletons).toHaveLength(3)
  })

  it('handles empty state', () => {
    render(
      <CardContent
        {...defaultProps}
        resources={[]}
      />
    )

    expect(screen.getByText('No Applications')).toBeInTheDocument()
  })

  it('handles error state', () => {
    render(
      <CardContent
        {...defaultProps}
        isError
      />
    )

    expect(screen.getByText('Failed to load applications')).toBeInTheDocument()
  })
})
