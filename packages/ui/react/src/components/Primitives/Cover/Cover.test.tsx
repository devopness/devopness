import { useMediaQuery } from '@mui/material'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Cover } from './Cover'

vi.mock('src/icons', () => ({
  getImageAssetUrl: (file: string) => `/mocked/path/${file}`,
}))

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material')
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  }
})

describe('Cover', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when minWidth matches', () => {
    ;(useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => query === '(min-width:600px)'
    )

    render(
      <Cover minWidth="600px">
        <div>Child content</div>
      </Cover>
    )

    expect(screen.getByAltText('devopness')).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('does not render when minWidth does not match', () => {
    ;(useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      false
    )

    render(
      <Cover minWidth="600px">
        <div>Child content</div>
      </Cover>
    )

    expect(screen.queryByText('Child content')).toBeNull()
  })

  it('renders white logo when specified', () => {
    ;(useMediaQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      true
    )

    render(
      <Cover logo="white">
        <div>Child content</div>
      </Cover>
    )

    const logo = screen.getByAltText('devopness')
    expect((logo as HTMLImageElement).src).toContain('logo_devopness_beta.png')
  })
})
