import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tooltip } from '.'

describe('Tooltip', () => {
  it('renders properly', async () => {
    const tooltipTitle = 'test'
    render(
      <Tooltip title={tooltipTitle}>
        <p>content</p>
      </Tooltip>
    )

    const tooltipBase = screen.getByTitle(tooltipTitle)
    fireEvent.mouseOver(tooltipBase)
    const tooltip = await screen.findByText(tooltipTitle)
    expect(tooltip).toBeInTheDocument()
    fireEvent.mouseOut(tooltipBase)
    await waitFor(() => {
      expect(tooltip).not.toBeInTheDocument()
    })
  })
})
