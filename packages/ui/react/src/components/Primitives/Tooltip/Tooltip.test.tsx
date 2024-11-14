import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tooltip } from '.'

describe('Tooltip', () => {
  it('renders properly', async () => {
    const tooltipTitle = 'tooltip title'
    const triggerTitle = 'tooltip trigger'

    render(
      <Tooltip title={tooltipTitle}>
        <p>{triggerTitle}</p>
      </Tooltip>
    )

    const tooltipBase = screen.getByText(triggerTitle)
    fireEvent.mouseOver(tooltipBase)
    const tooltip = await screen.findByText(tooltipTitle)
    expect(tooltip).toBeInTheDocument()
    fireEvent.mouseOut(tooltipBase)
    await waitFor(() => {
      expect(tooltip).not.toBeInTheDocument()
    })
  })
})
