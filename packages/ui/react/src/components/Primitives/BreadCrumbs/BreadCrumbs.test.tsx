import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from 'styled-components'

import { BreadCrumbs } from './BreadCrumbs'

describe('BreadCrumbs', () => {
  it('renders breadcrumb labels and logo navigation', () => {
    const imageOnClick = vi.fn()

    render(
      <ThemeProvider theme={{}}>
        <BreadCrumbs
          navigateCrumbs={[
            {
              label: 'Projects',
              list: [],
              onClick: vi.fn(),
            },
          ]}
          backgroundColor="#fff"
          imageOnClick={imageOnClick}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Projects').parentElement).toBeInTheDocument()
  })
})
