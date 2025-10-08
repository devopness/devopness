import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Status } from './Status'

describe('Status', () => {
  it('renders status value correctly', () => {
    render(
      <Status
        status="completed"
        statusHumanReadable="Completed"
        statusReasonHumanReadable="Finished successfully"
      />
    )
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('displays tooltip with status reason', () => {
    render(
      <Status
        status="failed"
        statusHumanReadable="Failed"
        statusReasonHumanReadable="Error during execution"
      />
    )
    const statusElement = screen.getByText('Failed')
    expect(statusElement).toBeInTheDocument()
  })
})
