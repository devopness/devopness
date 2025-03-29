import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'
import { testHoverTooltip } from 'src/test-utils'

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

    const tooltipTrigger = screen.getByText(triggerTitle)
    await testHoverTooltip({
      element: tooltipTrigger,
      tooltipText: tooltipTitle,
    })
  })
})
